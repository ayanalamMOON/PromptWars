@echo off
setlocal EnableExtensions

set "THIS_DIR=%~dp0"
set "INSTALL_BASE=%LOCALAPPDATA%\PromptWars"
set "PAYLOAD_ZIP=%THIS_DIR%payload.zip"
set "INSTALL_SCRIPT=%THIS_DIR%install.ps1"

powershell -NoProfile -ExecutionPolicy Bypass -File "%INSTALL_SCRIPT%" -InstallBase "%INSTALL_BASE%" -PayloadZip "%PAYLOAD_ZIP%"
set "EXIT_CODE=%ERRORLEVEL%"

if not "%EXIT_CODE%"=="0" (
  exit /b %EXIT_CODE%
)

echo.
echo [PromptWars Setup] Installation complete.
exit /b 0
