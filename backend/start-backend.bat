@echo off
echo ====================================
echo   VvelUniverse Java Backend Starter
echo ====================================
echo.

REM Find Java 21 by running java -version
for /f "tokens=3" %%v in ('java -version 2^>^&1 ^| findstr /i "version"') do (
    set JAVA_VER=%%v
    goto :found
)

:found
echo Detected Java version: %JAVA_VER%
echo.

REM Check if it's Java 21
echo %JAVA_VER% | findstr /C:"21." >nul
if %errorlevel% equ 0 (
    echo ✓ Java 21 detected!
    echo.
    
    REM Find JAVA_HOME from where java.exe is
    for /f "delims=" %%i in ('where java 2^>nul') do (
        set JAVA_EXE=%%i
        goto :setHome
    )
    
    :setHome
    REM Get directory two levels up from java.exe (bin\java.exe -> JDK root)
    for %%F in ("%JAVA_EXE%") do set JAVA_BIN=%%~dpF
    for %%F in ("%JAVA_BIN%.") do set JAVA_HOME=%%~dpF
    
    REM Remove trailing backslash
    if "%JAVA_HOME:~-1%"=="\" set JAVA_HOME=%JAVA_HOME:~0,-1%
    
    echo Using JAVA_HOME: %JAVA_HOME%
    echo.
    echo Starting Spring Boot backend...
    echo Server will be available at: http://localhost:8080/api
    echo.
    
    gradlew.bat clean bootRun
    
) else (
    echo.
    echo ✗ Java 21 not found!
    echo Current version: %JAVA_VER%
    echo.
    echo Please install Java 21 from:
    echo https://www.oracle.com/java/technologies/downloads/#java21
    echo.
    echo After installation, set it as your default Java version.
    echo.
    pause
)

