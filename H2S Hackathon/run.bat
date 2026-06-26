@echo off
title SkillMatch - Local Server
echo ===================================================
echo             SkillMatch Recruitment Platform
echo ===================================================
echo.
echo Starting Python static file server on port 8000...
echo Opening http://127.0.0.1:8000 in your browser...
echo.
echo Press Ctrl+C in this terminal to stop the server.
echo.
start http://127.0.0.1:8000
python -u server.py
