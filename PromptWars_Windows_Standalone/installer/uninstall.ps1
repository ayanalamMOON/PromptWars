param(
    [Parameter(Mandatory = $true)]
    [string]$InstallBase
)

$ErrorActionPreference = "Stop"

$targetDir = Join-Path $InstallBase "PromptWars_Windows"
$uninstallExe = Join-Path $InstallBase "PromptWars_Uninstall.exe"
$uninstallCmd = Join-Path $InstallBase "uninstall.cmd"
$uninstallPs1 = Join-Path $InstallBase "uninstall.ps1"
$desktopLink = Join-Path ([Environment]::GetFolderPath("Desktop")) "PromptWars.lnk"
$startMenuDir = Join-Path $env:APPDATA "Microsoft\Windows\Start Menu\Programs\PromptWars"
$startMenuAppLink = Join-Path $startMenuDir "PromptWars.lnk"
$startMenuUninstallLink = Join-Path $startMenuDir "Uninstall PromptWars.lnk"

Write-Host "[PromptWars Uninstall] Removing PromptWars from: $targetDir"

# Stop launcher if running
Get-Process -Name "PromptWars_Launcher" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# Stop node processes that appear to belong to PromptWars runtime
Get-CimInstance Win32_Process -Filter "Name='node.exe'" -ErrorAction SilentlyContinue |
    Where-Object { $_.CommandLine -and $_.CommandLine -like "*PromptWars_Windows\\runtime*" } |
    ForEach-Object {
        Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
    }

Start-Sleep -Milliseconds 500

if (Test-Path -LiteralPath $targetDir) {
    Remove-Item -LiteralPath $targetDir -Recurse -Force
}

if (Test-Path -LiteralPath $uninstallCmd) {
    Remove-Item -LiteralPath $uninstallCmd -Force
}
if (Test-Path -LiteralPath $uninstallPs1) {
    Remove-Item -LiteralPath $uninstallPs1 -Force
}

$scheduleInstallBaseCleanup = $false
if (Test-Path -LiteralPath $uninstallExe) {
    # If this script was launched from the packaged uninstaller EXE, that EXE can be file-locked
    # during execution. Schedule delayed deletion after the process exits.
    $cleanupCmd = "/c ping 127.0.0.1 -n 3 >nul && del /f /q `"$uninstallExe`" >nul 2>&1"
    Start-Process -FilePath "cmd.exe" -ArgumentList $cleanupCmd -WindowStyle Hidden | Out-Null
    $scheduleInstallBaseCleanup = $true
}

if (Test-Path -LiteralPath $desktopLink) {
    Remove-Item -LiteralPath $desktopLink -Force
}
if (Test-Path -LiteralPath $startMenuAppLink) {
    Remove-Item -LiteralPath $startMenuAppLink -Force
}
if (Test-Path -LiteralPath $startMenuUninstallLink) {
    Remove-Item -LiteralPath $startMenuUninstallLink -Force
}
if (Test-Path -LiteralPath $startMenuDir) {
    $remaining = Get-ChildItem -LiteralPath $startMenuDir -Force -ErrorAction SilentlyContinue
    if (-not $remaining) {
        Remove-Item -LiteralPath $startMenuDir -Force
    }
}

if (Test-Path -LiteralPath $InstallBase) {
    $baseRemaining = Get-ChildItem -LiteralPath $InstallBase -Force -ErrorAction SilentlyContinue
    if (-not $baseRemaining -and -not $scheduleInstallBaseCleanup) {
        Remove-Item -LiteralPath $InstallBase -Force
    }
}

Write-Host "[PromptWars Uninstall] PromptWars has been removed."
