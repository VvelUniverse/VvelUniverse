# Script to fix navigation bar spacing
$files = Get-ChildItem -Path . -Filter *.html -Recurse -File

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    
    # Replace justify-around with justify-evenly
    $content = $content -replace 'justify-around', 'justify-evenly'
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline -Encoding UTF8
        Write-Host "Fixed: $($file.FullName)"
    }
}

Write-Host "Done!"

