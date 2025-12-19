@echo off
echo ====================================
echo   VvelUniverse Frontend Server
echo ====================================
echo.
echo Server running on: http://localhost:3000
echo Press Ctrl+C to stop
echo.

cd frontend
python -m http.server 3000
