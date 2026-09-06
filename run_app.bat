@echo off
title Seva Setu - Launcher
echo ==============================================================
echo   Seva Setu (सेवा सेतु) - Launching Full-Stack Application
echo ==============================================================
echo.

cd /d "%~dp0"

echo [1/2] Launching FastAPI Backend on port 8000...
start "Seva Setu Backend" cmd /c "run_backend.bat"

timeout /t 2 /nobreak >nul

echo [2/2] Launching Frontend on port 3000...
start "Seva Setu Frontend" cmd /c "run_frontend.bat"

echo.
echo Application started!
echo - Frontend: http://localhost:3000
echo - Backend:  http://localhost:8000
echo - API Docs: http://localhost:8000/docs
echo.
