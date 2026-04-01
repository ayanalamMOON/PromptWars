#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const http = require("http");
const { spawn, spawnSync } = require("child_process");

const APP_PORT = Number(process.env.PROMPTWARS_PORT || 4000);
const APP_HOST = process.env.PROMPTWARS_HOST || "127.0.0.1";
const APP_URL = `http://${APP_HOST}:${APP_PORT}`;

let ollamaProcess = null;
let startedOllama = false;

function log(message) {
    console.log(`[PromptWars Launcher] ${message}`);
}

function failAndExit(message, details) {
    console.error(`\n[PromptWars Launcher] ERROR: ${message}`);
    if (details) {
        console.error(details);
    }
    process.exit(1);
}

function commandExists(command, args = ["--version"]) {
    const result = spawnSync(command, args, {
        stdio: "ignore",
        shell: false,
        timeout: 12000,
        windowsHide: true,
    });
    return !result.error && result.status === 0;
}

function resolveRuntimeDir() {
    const packagedDir = path.dirname(process.execPath);
    const packagedRuntime = path.join(packagedDir, "runtime");

    if (fs.existsSync(path.join(packagedRuntime, "server.js"))) {
        return packagedRuntime;
    }

    const devRuntime = path.resolve(__dirname, "..", "dist", "PromptWars_Windows", "runtime");
    if (fs.existsSync(path.join(devRuntime, "server.js"))) {
        return devRuntime;
    }

    return null;
}

function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function checkHttp(url, timeoutMs = 2500) {
    return new Promise((resolve) => {
        const req = http.get(url, { timeout: timeoutMs }, (res) => {
            res.resume();
            resolve(res.statusCode && res.statusCode < 500);
        });

        req.on("error", () => resolve(false));
        req.on("timeout", () => {
            req.destroy();
            resolve(false);
        });
    });
}

async function waitForServer(url, attempts = 40, delayMs = 500) {
    for (let i = 0; i < attempts; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        const healthy = await checkHttp(url);
        if (healthy) {
            return true;
        }
        // eslint-disable-next-line no-await-in-loop
        await wait(delayMs);
    }
    return false;
}

function openBrowser(url) {
    spawn("cmd", ["/c", "start", "", url], {
        detached: true,
        stdio: "ignore",
        shell: false,
    }).unref();
}

/**
 * Checks Ollama availability.
 * Returns true  → Ollama is available; app runs in full HOST mode.
 * Returns false → Ollama is absent;    app runs in PARTICIPANT MODE
 *                 (inference disabled, UI still accessible for prompt submission).
 */
function ensureOllama() {
    if (!commandExists("ollama", ["--version"])) {
        log("-------------------------------------------------------");
        log("WARNING: Ollama is NOT installed on this device.");
        log("This device will run in PARTICIPANT MODE.");
        log("AI inference and judging features will be unavailable.");
        log("Participants can still submit prompts via the web UI.");
        log("To enable full host features, install Ollama from:");
        log("  https://ollama.com/download");
        log("-------------------------------------------------------");
        process.env.PARTICIPANT_MODE = "true";
        return false;
    }

    const running = spawnSync("ollama", ["list"], {
        stdio: "ignore",
        shell: false,
        timeout: 12000,
        windowsHide: true,
    }).status === 0;

    if (running) {
        log("Ollama is reachable. Running in full HOST mode.");
        process.env.PARTICIPANT_MODE = "false";
        return true;
    }

    log("Ollama is installed but not running. Starting 'ollama serve' in background...");
    ollamaProcess = spawn("ollama", ["serve"], {
        detached: true,
        stdio: "ignore",
        shell: false,
        windowsHide: true,
    });
    ollamaProcess.unref();
    startedOllama = true;
    process.env.PARTICIPANT_MODE = "false";
    return true;
}

function startServer(runtimeDir) {
    const serverFile = path.join(runtimeDir, "server.js");
    if (!fs.existsSync(serverFile)) {
        failAndExit("runtime/server.js not found.");
    }

    log(`Starting PromptWars runtime from: ${runtimeDir}`);
    process.env.NODE_ENV = "production";
    process.env.PORT = String(APP_PORT);
    process.env.HOSTNAME = "0.0.0.0";
    process.chdir(runtimeDir);
    require(serverFile);
}

function cleanupAndExit(code = 0) {
    if (startedOllama && ollamaProcess && !ollamaProcess.killed) {
        try {
            process.kill(-ollamaProcess.pid);
        } catch {
            // ignore; detached process may already have ended
        }
    }

    process.exit(code);
}

process.on("SIGINT", () => cleanupAndExit(0));
process.on("SIGTERM", () => cleanupAndExit(0));
process.on("uncaughtException", (err) => failAndExit("Unhandled exception", err));
process.on("unhandledRejection", (err) => failAndExit("Unhandled rejection", err));

async function main() {
    log("Pre-flight checks...");

    const runtimeDir = resolveRuntimeDir();
    if (!runtimeDir) {
        failAndExit("Runtime folder not found. Expected 'runtime' next to the EXE.");
    }

    const ollamaAvailable = ensureOllama();
    startServer(runtimeDir);

    const ready = await waitForServer(`${APP_URL}/api/status`);
    if (!ready) {
        failAndExit(`PromptWars server did not become ready at ${APP_URL}.`);
    }

    if (ollamaAvailable) {
        log(`PromptWars is running in HOST MODE at ${APP_URL}`);
    } else {
        log(`PromptWars is running in PARTICIPANT MODE at ${APP_URL}`);
        log("Note: AI inference is disabled. Use this device to submit prompts only.");
    }
    log("Opening browser...");
    openBrowser(APP_URL);
}

main();
