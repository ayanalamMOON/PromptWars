import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";

const root = process.cwd();
const distRoot = path.join(root, "dist", "PromptWars_Windows");
const runtimeDir = path.join(distRoot, "runtime");
const launcherExe = path.join(distRoot, "PromptWars_Launcher.exe");
const installerOutput = path.join(root, "dist", "PromptWars_Setup.exe");
const uninstallerExeSrc = path.join(root, "dist", "PromptWars_Uninstall.exe");
const nsisScript = path.join(root, "installer", "nsis", "PromptWarsInstaller.nsi");

function ensureExists(targetPath, label) {
    if (!fs.existsSync(targetPath)) {
        console.error(`[build-installer] Missing ${label}: ${targetPath}`);
        process.exit(1);
    }
}

function runOrExit(command, args, message) {
    const result = spawnSync(command, args, {
        stdio: "inherit",
        shell: false,
        windowsHide: true,
    });

    if (result.error || result.status !== 0) {
        console.error(`[build-installer] ${message}`);
        if (result.error) {
            console.error(result.error.message);
        }
        process.exit(result.status || 1);
    }
}

function resolveMakensisPath() {
    const envCandidate = process.env.NSIS_MAKENSIS;
    const candidates = [
        envCandidate,
        "C:\\Program Files (x86)\\NSIS\\makensis.exe",
        "C:\\Program Files\\NSIS\\makensis.exe",
        "makensis",
    ].filter(Boolean);

    for (const candidate of candidates) {
        if (candidate.toLowerCase() === "makensis") {
            return candidate;
        }

        if (fs.existsSync(candidate)) {
            return candidate;
        }
    }

    return "makensis";
}

ensureExists(distRoot, "distribution folder");
ensureExists(runtimeDir, "runtime folder");
ensureExists(path.join(runtimeDir, "server.js"), "runtime/server.js");
ensureExists(launcherExe, "PromptWars_Launcher.exe");
ensureExists(uninstallerExeSrc, "dist/PromptWars_Uninstall.exe");
ensureExists(nsisScript, "installer/nsis/PromptWarsInstaller.nsi");

const makensisPath = resolveMakensisPath();

runOrExit(
    makensisPath,
    [
        `/DAPP_SOURCE_DIR=${distRoot}`,
        `/DUNINSTALLER_EXE_SOURCE=${uninstallerExeSrc}`,
        `/DOUT_FILE=${installerOutput}`,
        nsisScript,
    ],
    "Failed to build installer with NSIS"
);

if (!fs.existsSync(installerOutput)) {
    console.error(`[build-installer] Installer output not found: ${installerOutput}`);
    process.exit(1);
}

console.log(`[build-installer] Success: ${installerOutput}`);
