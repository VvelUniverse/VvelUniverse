# Fix category home links like 'medical-home.html' -> '/medical'
Write-Host "Fixing category home links..." -ForegroundColor Cyan

$categories = @('business', 'cinema', 'education', 'influencers', 'law', 'medical', 'politics', 'science', 'sports')
$modified = 0

foreach ($category in $categories) {
    $root = "frontend\\pages\\categories\\$category"
    if (Test-Path $root) {
        $files = Get-ChildItem -Path $root -Filter "*.html" -Recurse
        foreach ($file in $files) {
            $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
            $orig = $content
            $pattern = "$category-home\.html"
            $replacement = "/$category"
            $content = $content -replace "window\.location\.href='${pattern}'", "window.location.href='$replacement'"
            $content = $content -replace "window\.location\.href=\"${pattern}\"", "window.location.href=\"$replacement\""
            $content = $content -replace "href='${pattern}'", "href='$replacement'"
            $content = $content -replace "href=\"${pattern}\"", "href=\"$replacement\""
            if ($content -ne $orig) {
                Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
                $modified++
                Write-Host "Fixed: $($file.Name)" -ForegroundColor Green
            }
        }
    }
}

Write-Host "`nDone! Fixed $modified files" -ForegroundColor Green


