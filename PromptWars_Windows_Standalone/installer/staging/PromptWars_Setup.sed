[Version]
Class=IEXPRESS
SEDVersion=3

[Options]
PackagePurpose=InstallApp
ShowInstallProgramWindow=1
HideExtractAnimation=0
UseLongFileName=1
InsideCompressed=0
CAB_FixedSize=0
CAB_ResvCodeSigning=0
RebootMode=N
InstallPrompt=
DisplayLicense=
FinishMessage=PromptWars has been installed to %LOCALAPPDATA%\PromptWars.
TargetName=C:\Users\ayana\Projects\PromptWars\PromptWars_Windows_Standalone\dist\PromptWars_Setup.exe
FriendlyName=PromptWars Setup
AppLaunched=install.cmd
PostInstallCmd=<None>
AdminQuietInstCmd=
UserQuietInstCmd=
SourceFiles=SourceFiles

[SourceFiles]
SourceFiles0=C:\Users\ayana\Projects\PromptWars\PromptWars_Windows_Standalone\installer\staging

[SourceFiles0]
%FILE0%=
%FILE1%=
%FILE2%=
%FILE3%=

[Strings]
FILE0=install.cmd
FILE1=payload.zip
FILE2=install.ps1
FILE3=PromptWars_Uninstall.exe