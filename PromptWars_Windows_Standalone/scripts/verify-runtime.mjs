import fs from "fs";
import path from "path";

const root = process.cwd();
const runtimeDir = path.join(root, "dist", "PromptWars_Windows", "runtime");

const requiredPaths = [
    path.join(runtimeDir, "server.js"),
    path.join(runtimeDir, "package.json"),
    path.join(runtimeDir, ".next"),
    path.join(runtimeDir, "node_modules"),
];

const missing = requiredPaths.filter((p) => !fs.existsSync(p));

if (missing.length) {
    console.error("[verify-runtime] Missing required runtime artifacts:");
    for (const item of missing) {
        console.error(` - ${item}`);
    }
    process.exit(1);
}

console.log("[verify-runtime] Runtime artifacts look good.");
