Unicode True
RequestExecutionLevel user

!include "MUI2.nsh"
!include "LogicLib.nsh"

!ifndef APP_SOURCE_DIR
  !error "APP_SOURCE_DIR define is required"
!endif

!ifndef UNINSTALLER_EXE_SOURCE
  !error "UNINSTALLER_EXE_SOURCE define is required"
!endif

!ifndef OUT_FILE
  !define OUT_FILE "PromptWars_Setup.exe"
!endif

Name "PromptWars"
OutFile "${OUT_FILE}"
InstallDir "$LOCALAPPDATA\PromptWars\PromptWars_Windows"
InstallDirRegKey HKCU "Software\PromptWars" "InstallDir"
ShowInstDetails show
ShowUninstDetails show
BrandingText "PromptWars"

!define MUI_ABORTWARNING
!define MUI_ICON "${NSISDIR}\\Contrib\\Graphics\\Icons\\modern-install.ico"
!define MUI_UNICON "${NSISDIR}\\Contrib\\Graphics\\Icons\\modern-uninstall.ico"
!define MUI_FINISHPAGE_RUN "$INSTDIR\PromptWars_Launcher.exe"
!define MUI_FINISHPAGE_RUN_TEXT "Launch PromptWars now"

; --- Custom Ollama-check page (shown before the standard pages) ---
Var OllamaFound

Page custom OllamaCheckPage_Create OllamaCheckPage_Leave

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_COMPONENTS
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_LANGUAGE "English"

; ---------------------------------------------------------------------------
; Custom page: detect Ollama and inform the user of their device role
; ---------------------------------------------------------------------------
Function OllamaCheckPage_Create
  nsExec::ExecToStack 'cmd /C ollama --version'
  Pop $0   ; exit code
  Pop $1   ; output (ignored)

  ${If} $0 == 0
    StrCpy $OllamaFound "1"
  ${Else}
    StrCpy $OllamaFound "0"
  ${EndIf}

  nsDialogs::Create 1018
  Pop $9

  ${If} $9 == error
    Abort
  ${EndIf}

  ; Title label
  ${NSD_CreateLabel} 0 0 100% 20u "Ollama Detection"
  Pop $9
  SetCtlColors $9 "" "transparent"
  CreateFont $8 "$(^Font)" "10" "700"
  SendMessage $9 ${WM_SETFONT} $8 1

  ${If} $OllamaFound == "1"
    ; ---- Ollama FOUND ----
    ${NSD_CreateLabel} 0 24u 100% 14u "Ollama detected on this device."
    Pop $9
    SetCtlColors $9 "008000" "transparent"

    ${NSD_CreateLabel} 0 42u 100% 50u "This device will run as a HOST. It will handle AI inference, prompt execution, and judging during matches.$\n$\nOllama will be started automatically when PromptWars launches."
    Pop $9
  ${Else}
    ; ---- Ollama NOT FOUND ----
    ${NSD_CreateLabel} 0 24u 100% 14u "Ollama was NOT found on this device."
    Pop $9
    SetCtlColors $9 "cc0000" "transparent"

    ${NSD_CreateLabel} 0 42u 100% 80u "This device will run in PARTICIPANT MODE.$\n$\nAI inference and judging will be unavailable, but participants can still submit prompts using this device.$\n$\nTo enable full host features, install Ollama from https://ollama.com/download and re-run the launcher."
    Pop $9
  ${EndIf}

  nsDialogs::Show
FunctionEnd

Function OllamaCheckPage_Leave
FunctionEnd

Section "PromptWars Application Files (required)" SecApp
  SectionIn RO

  SetOutPath "$INSTDIR"
  File /r "${APP_SOURCE_DIR}\*"

  SetOutPath "$INSTDIR\.."
  File "/oname=PromptWars_Uninstall.exe" "${UNINSTALLER_EXE_SOURCE}"

  WriteRegStr HKCU "Software\PromptWars" "InstallDir" "$INSTDIR"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\PromptWars" "DisplayName" "PromptWars"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\PromptWars" "DisplayIcon" "$INSTDIR\PromptWars_Launcher.exe"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\PromptWars" "Publisher" "PromptWars"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\PromptWars" "InstallLocation" "$INSTDIR"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\PromptWars" "UninstallString" '"$INSTDIR\..\PromptWars_Uninstall.exe"'
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\PromptWars" "QuietUninstallString" '"$INSTDIR\..\PromptWars_Uninstall.exe" /S'
  WriteRegDWORD HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\PromptWars" "NoModify" 1
  WriteRegDWORD HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\PromptWars" "NoRepair" 1
SectionEnd

Section /o "Desktop shortcut" SecDesktop
  CreateShortcut "$DESKTOP\PromptWars.lnk" "$INSTDIR\PromptWars_Launcher.exe" "" "$INSTDIR\PromptWars_Launcher.exe" 0
SectionEnd

Section /o "Start Menu shortcuts" SecStartMenu
  CreateDirectory "$SMPROGRAMS\PromptWars"
  CreateShortcut "$SMPROGRAMS\PromptWars\PromptWars.lnk" "$INSTDIR\PromptWars_Launcher.exe" "" "$INSTDIR\PromptWars_Launcher.exe" 0
  CreateShortcut "$SMPROGRAMS\PromptWars\Uninstall PromptWars.lnk" "$INSTDIR\..\PromptWars_Uninstall.exe" "" "$INSTDIR\PromptWars_Launcher.exe" 0
SectionEnd
