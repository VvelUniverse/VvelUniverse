# PowerShell script to fix relative links in HTML files
# Converts relative links to absolute paths

Write-Host "Fixing relative links in HTML files..." -ForegroundColor Cyan

$replacements = @(
    @{ Pattern = 'href="\.\/index\.html"'; Replacement = 'href="/"' }
    @{ Pattern = 'href="\.\/register\.html"'; Replacement = 'href="/register"' }
    @{ Pattern = 'href="index\.html"'; Replacement = 'href="/"' }
    @{ Pattern = 'href="register\.html"'; Replacement = 'href="/register"' }
    @{ Pattern = 'href="\.\/categories\.html"'; Replacement = 'href="/categories"' }
    @{ Pattern = 'href="categories\.html"'; Replacement = 'href="/categories"' }
    @{ Pattern = 'href="\.\/profile\.html"'; Replacement = 'href="/profile"' }
    @{ Pattern = 'href="profile\.html"'; Replacement = 'href="/profile"' }
    @{ Pattern = 'href="\.\/admin\.html"'; Replacement = 'href="/admin"' }
    @{ Pattern = 'href="admin\.html"'; Replacement = 'href="/admin"' }
)

$htmlFiles = Get-ChildItem -Path "frontend" -Filter "*.html" -Recurse
$modifiedFiles = 0

foreach ($file in $htmlFiles) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    $modified = $false
    
    foreach ($replacement in $replacements) {
        if ($content -match $replacement.Pattern) {
            $content = $content -replace $replacement.Pattern, $replacement.Replacement
            $modified = $true
        }
    }
    
    if ($modified -and $content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
        $modifiedFiles++
        Write-Host "Fixed: $($file.Name)" -ForegroundColor Green
    }
}

Write-Host "Done! Fixed $modifiedFiles files" -ForegroundColor Green
