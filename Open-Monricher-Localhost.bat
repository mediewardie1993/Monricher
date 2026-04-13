@echo off
cd /d "%~dp0"
echo Starting Monricher local server...
start "" http://localhost:3000
npm.cmd run dev
