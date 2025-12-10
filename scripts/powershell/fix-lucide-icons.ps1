# Ensure Lucide icons initialize properly in all pages
Write-Host "Fixing Lucide icon initialization..." -ForegroundColor Cyan

$files = Get-ChildItem -Path "frontend\pages\categories" -Filter "*.html" -Recurse
$modifiedFiles = 0

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    
    # Replace standalone lucide.createIcons() with wrapped version
    $content = $content -replace '(?<!document\.addEventListener\(''DOMContentLoaded'', function\(\) \{\s*)\s*lucide\.createIcons\(\);(?!\s*\}\);)', @'
document.addEventListener('DOMContentLoaded', function() {
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    });
'@
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
        $modifiedFiles++
        Write-Host "Fixed: $($file.Name)" -ForegroundColor Green
    }
}

Write-Host "`nDone! Fixed $modifiedFiles files" -ForegroundColor Green
Write-Host "Icons should now load properly after page refresh" -ForegroundColor Cyan

