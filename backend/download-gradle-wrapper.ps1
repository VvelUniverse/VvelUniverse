# Download Gradle Wrapper JAR
$url = "https://raw.githubusercontent.com/gradle/gradle/v8.5.0/gradle/wrapper/gradle-wrapper.jar"
$output = "gradle\wrapper\gradle-wrapper.jar"

Write-Host "Downloading Gradle Wrapper JAR..." -ForegroundColor Green
try {
    Invoke-WebRequest -Uri $url -OutFile $output -UseBasicParsing
    Write-Host "Success! Gradle Wrapper JAR downloaded!" -ForegroundColor Green
    Write-Host ""
    Write-Host "You can now run: .\gradlew.bat bootRun" -ForegroundColor Cyan
} catch {
    Write-Host "Failed to download Gradle Wrapper JAR" -ForegroundColor Red
    Write-Host "Please download manually from: $url" -ForegroundColor Yellow
    Write-Host "And save to: $output" -ForegroundColor Yellow
}

Read-Host "Press Enter to continue"

