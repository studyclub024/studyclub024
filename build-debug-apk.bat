@echo off
REM This script builds a debug APK with JAVA_HOME set locally
setlocal enabledelayedexpansion

set JAVA_HOME=C:\Program Files\Android\Android Studio\jbr
set Path=!JAVA_HOME!\bin;%Path%

echo JAVA_HOME set to: !JAVA_HOME!
echo Running Gradle build...
echo.

cd /d "%~dp0android"
call gradlew.bat assembleDebug

if exist "app\build\outputs\apk\debug\app-debug.apk" (
  echo.
  echo ============================================
  echo SUCCESS! Debug APK generated:
  echo.
  for %%F in (app\build\outputs\apk\debug\app-debug.apk) do (
    echo Path: %%~fF
    echo Size: %%~zF bytes
  )
  echo ============================================
) else (
  echo.
  echo APK not found. Check error messages above.
)

pause
