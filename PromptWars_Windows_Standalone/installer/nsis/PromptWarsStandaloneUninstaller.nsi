Unicode True
RequestExecutionLevel user

!include "MUI2.nsh"
!include "LogicLib.nsh"

!ifndef OUT_FILE
  !define OUT_FILE "PromptWars_Uninstall.exe"
!endif

Name "PromptWars Uninstaller"
OutFile "${OUT_FILE}"
InstallDir "$LOCALAPPDATA\PromptWars\PromptWars_Windows"
InstallDirRegKey HKCU "Software\PromptWars" "InstallDir"
ShowInstDetails show
BrandingText "PromptWars"

!define MUI_ABORTWARNING
!define MUI_ICON "${NSISDIR}\\Contrib\\Graphics\\Icons\\modern-uninstall.ico"

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_COMPONENTS
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_LANGUAGE "English"

Section "Remove PromptWars application files" SecRemoveApp
  RMDir /r "$INSTDIR\runtime"
  Delete "$INSTDIR\PromptWars_Launcher.exe"
  Delete "$INSTDIR\BUILD_INFO.txt"
  Delete "$INSTDIR\Uninstall PromptWars.exe"
  RMDir "$INSTDIR"

  DeleteRegKey HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\PromptWars"
  DeleteRegKey HKCU "Software\PromptWars"
SectionEnd

Section /o "Remove Start Menu and Desktop shortcuts" SecRemoveLinks
  Delete "$DESKTOP\PromptWars.lnk"
  Delete "$SMPROGRAMS\PromptWars\PromptWars.lnk"
  Delete "$SMPROGRAMS\PromptWars\Uninstall PromptWars.lnk"
  RMDir "$SMPROGRAMS\PromptWars"
SectionEnd

Section /o "Remove this uninstaller executable" SecSelfDelete
  StrCpy $0 "$EXEPATH"
  nsExec::Exec 'cmd /C ping 127.0.0.1 -n 3 >nul & del /f /q "$0"'
SectionEnd
