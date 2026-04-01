@echo off
setlocal EnableExtensions

set "THIS_DIR=%~dp0"
set "INSTALL_BASE=%LOCALAPPDATA%\PromptWars"
set "UNINSTALL_SCRIPT=%THIS_DIR%uninstall.ps1"

powershell -NoProfile -ExecutionPolicy Bypass -File "%UNINSTALL_SCRIPT%" -InstallBase "%INSTALL_BASE%"
set "EXIT_CODE=%ERRORLEVEL%"

if not "%EXIT_CODE%"=="0" (
  exit /b %EXIT_CODE%
)

echo.
echo [PromptWars Uninstall] Uninstall complete.
exit /b 0
