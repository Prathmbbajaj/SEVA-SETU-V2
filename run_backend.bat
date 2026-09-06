@echo off
title Seva Setu - FastAPI Backend (Port 8000)
echo ==============================================================
echo   Seva Setu (सेवा सेतु) - Ministry of Cooperation
echo   Starting Live FastAPI Backend on http://localhost:8000
echo   Swagger API Docs: http://localhost:8000/docs
echo ==============================================================
echo.

cd /d "%~dp0"

if exist ".venv\Scripts\python.exe" (
    ".venv\Scripts\python.exe" -m uvicorn main:app --app-dir backend --reload --port 8000
) else if exist "backend\venv\Scripts\python.exe" (
    "backend\venv\Scripts\python.exe" -m uvicorn main:app --app-dir backend --reload --port 8000
) else (
    python -m uvicorn main:app --app-dir backend --reload --port 8000
)

pause
