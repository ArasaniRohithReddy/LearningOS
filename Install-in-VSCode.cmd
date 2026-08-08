@echo off
REM One-click installer for the LearningOS - Drona VS Code extension.
REM Double-clicking the .vsix opens the WRONG installer (Visual Studio). This installs it into VS Code.
setlocal enabledelayedexpansion

set "VSIX="
for /f "delims=" %%F in ('dir /b /o-n "%~dp0extension\learningos-drona-*.vsix" 2^>nul') do (
  if not defined VSIX set "VSIX=%~dp0extension\%%F"
)
if not defined VSIX for /f "delims=" %%F in ('dir /b /o-n "%~dp0learningos-drona-*.vsix" 2^>nul') do (
  if not defined VSIX set "VSIX=%~dp0%%F"
)

if not defined VSIX (
  echo [X] Could not find a learningos-drona-*.vsix next to this script.
  pause
  exit /b 1
)

echo Installing "LearningOS - Drona" from:
echo   %VSIX%
echo.

set "DONE="
where code >nul 2>nul
if %errorlevel%==0 (
  echo == VS Code ==
  call code --install-extension "%VSIX%" --force
  set "DONE=1"
)

where code-insiders >nul 2>nul
if %errorlevel%==0 (
  echo == VS Code Insiders ==
  call code-insiders --install-extension "%VSIX%" --force
  set "DONE=1"
)

echo.
if defined DONE (
  echo Done. Open VS Code, open the Chat view, and type:  @drona
) else (
  echo [!] The 'code' command was not found on PATH.
  echo     Open VS Code, run the Command Palette ^(Ctrl+Shift+P^),
  echo     choose "Shell Command: Install 'code' command in PATH", then run this again.
  echo     OR in VS Code: Extensions view -^> "..." menu -^> "Install from VSIX..." -^> pick the file above.
)
echo.
pause
