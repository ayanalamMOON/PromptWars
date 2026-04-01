import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";

const root = process.cwd();
const distDir = path.join(root, "dist");
const outputExe = path.join(distDir, "PromptWars_Uninstall.exe");
const nsisScript = path.join(root, "installer", "nsis", "PromptWarsStandaloneUninstaller.nsi");

function ensureExists(targetPath, label) {
    if (!fs.existsSync(targetPath)) {
        console.error(`[build-uninstaller] Missing ${label}: ${targetPath}`);
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
        console.error(`[build-uninstaller] ${message}`);
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

ensureExists(nsisScript, "installer/nsis/PromptWarsStandaloneUninstaller.nsi");

fs.mkdirSync(distDir, { recursive: true });
const makensisPath = resolveMakensisPath();

runOrExit(
    makensisPath,
    [
        `/DOUT_FILE=${outputExe}`,
        nsisScript,
    ],
    "Failed to build uninstaller with NSIS"
);

if (!fs.existsSync(outputExe)) {
    console.error(`[build-uninstaller] Uninstaller output not found: ${outputExe}`);
    process.exit(1);
}

console.log(`[build-uninstaller] Success: ${outputExe}`);
