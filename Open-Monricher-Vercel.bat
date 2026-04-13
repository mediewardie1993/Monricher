@echo off
cd /d "%~dp0"

set "VC=%APPDATA%\npm\vercel.cmd"
if not exist "%VC%" set "VC=vercel"
set "TMP_FILE=%TEMP%\monricher_vercel_ls.txt"

echo Opening Vercel project dashboard...
start "" "https://vercel.com/mediewardie1993s-projects/monricher"

echo Fetching latest deployment URL...
call "%VC%" ls --scope mediewardie1993s-projects > "%TMP_FILE%"

set "LATEST_URL="
for /f "usebackq delims=" %%L in (`findstr /r "^https://monricher-.*\.vercel\.app$" "%TMP_FILE%"`) do (
  if not defined LATEST_URL set "LATEST_URL=%%L"
)

if defined LATEST_URL (
  echo Opening latest deployment: %LATEST_URL%
  start "" "%LATEST_URL%"
) else (
  echo Could not detect a deployment URL automatically.
)

echo.
echo Recent deployments for Monricher:
type "%TMP_FILE%"
del "%TMP_FILE%" >nul 2>&1

pause
