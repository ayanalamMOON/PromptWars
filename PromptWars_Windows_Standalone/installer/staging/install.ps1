param(
    [Parameter(Mandatory = $true)]
    [string]$InstallBase,

    [Parameter(Mandatory = $true)]
    [string]$PayloadZip
)

$ErrorActionPreference = "Stop"

Write-Host "[PromptWars Setup] Installing to: $InstallBase\PromptWars_Windows"

# Stop running PromptWars processes so updates can overwrite files cleanly.
Get-Process -Name "PromptWars_Launcher" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Get-CimInstance Win32_Process -Filter "Name='node.exe'" -ErrorAction SilentlyContinue |
    Where-Object { $_.CommandLine -and $_.CommandLine -like "*PromptWars_Windows\\runtime*" } |
    ForEach-Object {
        Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
    }
Start-Sleep -Milliseconds 500

if (-not (Test-Path -LiteralPath $PayloadZip)) {
    throw "payload.zip not found: $PayloadZip"
}

if (-not (Test-Path -LiteralPath $InstallBase)) {
    New-Item -ItemType Directory -Path $InstallBase -Force | Out-Null
}

Expand-Archive -LiteralPath $PayloadZip -DestinationPath $InstallBase -Force

$appExe = Join-Path $InstallBase "PromptWars_Windows\PromptWars_Launcher.exe"
if (-not (Test-Path -LiteralPath $appExe)) {
    throw "Launcher missing after install: $appExe"
}

$uninstallerExeSource = Join-Path $PSScriptRoot "PromptWars_Uninstall.exe"
$uninstallerExeTarget = Join-Path $InstallBase "PromptWars_Uninstall.exe"

if (-not (Test-Path -LiteralPath $uninstallerExeSource)) {
    throw "PromptWars_Uninstall.exe not found in installer payload"
}

Copy-Item -LiteralPath $uninstallerExeSource -Destination $uninstallerExeTarget -Force

$workDir = Split-Path -Parent $appExe
$wsh = New-Object -ComObject WScript.Shell

$desktop = [Environment]::GetFolderPath("Desktop")
$desktopLink = Join-Path $desktop "PromptWars.lnk"
$shortcut1 = $wsh.CreateShortcut($desktopLink)
$shortcut1.TargetPath = $appExe
$shortcut1.WorkingDirectory = $workDir
$shortcut1.IconLocation = "$appExe,0"
$shortcut1.Save()

$startMenuDir = Join-Path $env:APPDATA "Microsoft\Windows\Start Menu\Programs\PromptWars"
New-Item -ItemType Directory -Path $startMenuDir -Force | Out-Null
$startMenuLink = Join-Path $startMenuDir "PromptWars.lnk"
$shortcut2 = $wsh.CreateShortcut($startMenuLink)
$shortcut2.TargetPath = $appExe
$shortcut2.WorkingDirectory = $workDir
$shortcut2.IconLocation = "$appExe,0"
$shortcut2.Save()

$uninstallLink = Join-Path $startMenuDir "Uninstall PromptWars.lnk"
$shortcut3 = $wsh.CreateShortcut($uninstallLink)
$shortcut3.TargetPath = $uninstallerExeTarget
$shortcut3.WorkingDirectory = $InstallBase
$shortcut3.IconLocation = "$appExe,0"
$shortcut3.Save()

Write-Host "[PromptWars Setup] Launching PromptWars..."
Start-Process -FilePath $appExe | Out-Null
