@echo off
title Seva Setu - Frontend Web Application (Port 3000)
echo ==============================================================
echo   Seva Setu (सेवा सेतु) - Ministry of Cooperation
echo   Starting Frontend Web Server on http://localhost:3000
echo ==============================================================
echo.

cd /d "%~dp0"

echo Opening browser at http://localhost:3000 ...
start http://localhost:3000

if exist ".venv\Scripts\python.exe" (
    ".venv\Scripts\python.exe" -m http.server 3000 --directory frontend
) else (
    python -m http.server 3000 --directory frontend
)

pause
