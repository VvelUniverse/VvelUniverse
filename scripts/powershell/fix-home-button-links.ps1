# Fix Home button links in all pages
Write-Host "Fixing Home button links..." -ForegroundColor Cyan

$files = Get-ChildItem -Path "frontend" -Filter "*.html" -Recurse
$modifiedFiles = 0

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    
    # Fix Home button that points to /pages/categories/categories.html
    $content = $content -replace "window\.location\.href = '/pages/categories/categories\.html'", "window.location.href = '/categories'"
    $content = $content -replace 'window\.location\.href = "/pages/categories/categories\.html"', 'window.location.href = "/categories"'
    $content = $content -replace "window\.location\.href='/pages/categories/categories\.html'", "window.location.href='/categories'"
    $content = $content -replace 'window\.location\.href="/pages/categories/categories\.html"', 'window.location.href="/categories"'
    $content = $content -replace "href='/pages/categories/categories\.html'", "href='/categories'"
    $content = $content -replace 'href="/pages/categories/categories\.html"', 'href="/categories"'
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
        $modifiedFiles++
        Write-Host "Fixed: $($file.Name)" -ForegroundColor Green
    }
}

Write-Host "`nDone! Fixed $modifiedFiles files" -ForegroundColor Green

