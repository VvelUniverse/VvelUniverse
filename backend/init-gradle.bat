@echo off
echo Initializing Gradle Wrapper...
echo.

REM Initialize Gradle wrapper
gradle wrapper --gradle-version 8.5

echo.
echo Gradle wrapper initialized successfully!
echo You can now run: gradlew bootRun
echo.
pause

