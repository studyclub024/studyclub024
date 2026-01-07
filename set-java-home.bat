@echo off
REM This script sets JAVA_HOME permanently (requires Admin)
setx JAVA_HOME "C:\Program Files\Android\Android Studio\jbr" /M
if %errorlevel% equ 0 (
  echo JAVA_HOME set successfully to: C:\Program Files\Android\Android Studio\jbr
  echo Please restart your terminal or PC for changes to take effect.
) else (
  echo ERROR: Admin rights required. Right-click Command Prompt and select "Run as administrator"
  echo Then run this script again.
)
pause
