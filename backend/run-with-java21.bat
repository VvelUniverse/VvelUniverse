@echo off
echo ====================================
echo   Looking for Java 21...
echo ====================================

REM Try to find Java 21 installation
set JAVA21_HOME=

REM Common Java 21 locations
if exist "C:\Program Files\Eclipse Adoptium\jdk-21*" (
    for /d %%i in ("C:\Program Files\Eclipse Adoptium\jdk-21*") do set JAVA21_HOME=%%i
)
if exist "C:\Program Files\Java\jdk-21*" (
    for /d %%i in ("C:\Program Files\Java\jdk-21*") do set JAVA21_HOME=%%i
)

if defined JAVA21_HOME (
    echo Found Java 21 at: %JAVA21_HOME%
    set JAVA_HOME=%JAVA21_HOME%
    echo Using Java 21 for this session
    echo.
    gradlew.bat bootRun
) else (
    echo.
    echo ERROR: Java 21 not found!
    echo.
    echo Your current Java version is too new (Java 25).
    echo Spring Boot 3 requires Java 17 or Java 21.
    echo.
    echo Please install Java 21 from:
    echo https://adoptium.net/temurin/releases/?version=21
    echo.
    echo After installation, run this script again.
    echo.
    pause
)

