@echo off
cd /d "%~dp0"

echo Building Monricher...
npm.cmd run build
if errorlevel 1 (
  echo Build failed. Deployment stopped.
  pause
  exit /b 1
)

echo Deploying to Vercel production...
if exist "%APPDATA%\npm\vercel.cmd" (
  call "%APPDATA%\npm\vercel.cmd" deploy --prod --yes
) else (
  vercel deploy --prod --yes
)

if errorlevel 1 (
  echo Deployment failed.
  pause
  exit /b 1
)

echo Deployment complete.
pause
