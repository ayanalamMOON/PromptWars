# PromptWars Windows Standalone

This folder contains a **Windows standalone launcher** for PromptWars and a **real NSIS wizard installer/uninstaller**.

It produces a double-clickable executable:

- `dist/PromptWars_Windows/PromptWars_Launcher.exe`

The launcher starts the packaged PromptWars runtime from:

- `dist/PromptWars_Windows/runtime/`

---

## Detailed implementation plan (what this setup does)

1. **Keep PromptWars_App untouched**
   - No edits are made to `PromptWars_App` source files.
   - This standalone folder only consumes already prepared runtime artifacts.

2. **Verify runtime integrity before packaging**
   - `scripts/verify-runtime.mjs` checks that required files exist:
     - `runtime/server.js`
     - `runtime/package.json`
     - `runtime/.next`
     - `runtime/node_modules`

3. **Build a native Windows launcher executable**
   - `src/launcher.cjs` is compiled to `.exe` using `pkg`.
   - Output file:
     - `dist/PromptWars_Windows/PromptWars_Launcher.exe`

4. **Launcher startup flow**
   - Checks `ollama` availability.
   - If Ollama isn’t running, attempts `ollama serve` in background.
   - Starts `runtime/server.js` on port `4000` (default) using the launcher's bundled runtime.
   - Waits for health readiness (`/api/status`).
   - Opens browser automatically to `http://127.0.0.1:4000`.

5. **Target-device run model**
   - Copy the full `dist/PromptWars_Windows` folder to target Windows device.
   - Device prerequisites:
     - Ollama installed and in PATH
       - (No manual `npm start` step required)
   - Double-click `PromptWars_Launcher.exe`.

---

## Build steps (inside this folder)

1. Install packaging dependency:
   - `npm install`

2. Build launcher executable:
   - `npm run build`

3. Build installer executable (wizard installer):
   - `npm run build:installer`

4. Build uninstaller executable only (optional):
   - `npm run build:uninstaller`

Installer output (wizard with install directory selection):
- `dist/PromptWars_Setup.exe`
Uninstaller output (wizard with uninstall options):
- `dist/PromptWars_Uninstall.exe`

---

## Distribution layout

`dist/PromptWars_Windows/`
- `PromptWars_Launcher.exe`
- `runtime/`
  - `server.js`
  - `.next/`
  - `node_modules/`
  - `package.json`
  - `.env`
  - `sessions/`

> Keep `runtime` next to the `.exe`.

## Installer behavior

- Running `PromptWars_Setup.exe` installs to:
   - Default: `%LOCALAPPDATA%\\PromptWars\\PromptWars_Windows`
   - User can choose a custom installation directory from the installer UI.
- It creates:
   - Desktop shortcut: `PromptWars.lnk`
   - Start menu shortcut: `Start Menu > Programs > PromptWars > PromptWars.lnk`
    - Start menu uninstaller: `Start Menu > Programs > PromptWars > Uninstall PromptWars.lnk`
- It launches PromptWars automatically after installation.

## Uninstaller

- Installed uninstaller executable:
   - `<InstallDir>\\..\\PromptWars_Uninstall.exe`
- You can uninstall by one-click:
   - Start menu shortcut: `Uninstall PromptWars`
   - or double-click the installed `PromptWars_Uninstall.exe`
- Uninstaller UI options include:
  - Remove PromptWars application files
  - Remove Start Menu/Desktop shortcuts
  - Optionally remove the uninstaller executable itself

---

## Notes

- Default port is `4000`. You can override by setting env var `PROMPTWARS_PORT` before launch.
- The launcher logs to console and keeps running while the app is active.
