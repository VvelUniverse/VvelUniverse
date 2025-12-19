@echo off
echo ====================================
echo   VvelUniverse Full Stack Launcher
echo ====================================
echo.
echo Choose which backend to run:
echo.
echo [1] Java Spring Boot Backend + Frontend (NEW - Port 8080)
echo [2] Node.js Backend + Frontend (LEGACY - Port 3000)
echo.
set /p choice="Enter your choice (1 or 2): "

if "%choice%"=="1" (
    echo.
    echo Starting Java Spring Boot Backend + Frontend...
    echo.
    echo Server: http://localhost:8080
    echo Backend API: http://localhost:8080/api
    echo.
    call start-java-backend.bat
) else (
    if "%choice%"=="2" (
        echo.
        echo Starting Node.js Backend + Frontend ^(Legacy Reference^)...
        echo.
        echo Server: http://localhost:3000
        echo.
        cd nodejsbackend
        npm run dev
    ) else (
        echo.
        echo Invalid choice. Please run again and select 1 or 2.
        pause
    )
)