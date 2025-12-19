@echo off
echo ====================================
echo   VvelUniverse Java Backend
echo   Spring Boot 3 + MongoDB + JWT
echo ====================================
echo.

REM Set JAVA_HOME to Java 21
set JAVA_HOME=C:\Program Files\Java\jdk-21
set PATH=%JAVA_HOME%\bin;%PATH%

cd backend

REM Check if gradlew exists
if not exist gradlew.bat (
    echo Gradle wrapper not found. Initializing...
    call init-gradle.bat
)

echo Starting Spring Boot application...
echo Server will run on: http://localhost:8080/api
echo.
echo Press Ctrl+C to stop the server
echo.

call gradlew.bat bootRun

pause

