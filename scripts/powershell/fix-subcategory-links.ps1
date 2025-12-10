# Fix all Category/Sub-Category paths to subcategories/
Write-Host "Fixing subcategory links..." -ForegroundColor Cyan

$replacements = @(
    @{ Pattern = 'Category/Sub-Category/Business/'; Replacement = 'subcategories/' }
    @{ Pattern = 'Category/Sub-Category/Cinema/'; Replacement = 'subcategories/' }
    @{ Pattern = 'Category/Sub-Category/Education/'; Replacement = 'subcategories/' }
    @{ Pattern = 'Category/Sub-Category/Influencers/'; Replacement = 'subcategories/' }
    @{ Pattern = 'Category/Sub-Category/Law/'; Replacement = 'subcategories/' }
    @{ Pattern = 'Category/Sub-Category/Medical/'; Replacement = 'subcategories/' }
    @{ Pattern = 'Category/Sub-Category/Politics/'; Replacement = 'subcategories/' }
    @{ Pattern = 'Category/Sub-Category/Science/'; Replacement = 'subcategories/' }
    @{ Pattern = 'Category/Sub-Category/Sports/Sports/'; Replacement = 'subcategories/' }
    @{ Pattern = 'Category/Sub-Category/Sports/'; Replacement = 'subcategories/' }
)

$htmlFiles = Get-ChildItem -Path "frontend\pages\categories" -Filter "*.html" -Recurse
$modifiedFiles = 0

foreach ($file in $htmlFiles) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    $modified = $false
    
    foreach ($replacement in $replacements) {
        if ($content -match [regex]::Escape($replacement.Pattern)) {
            $content = $content -replace [regex]::Escape($replacement.Pattern), $replacement.Replacement
            $modified = $true
        }
    }
    
    if ($modified) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
        $modifiedFiles++
        Write-Host "Fixed: $($file.Name)" -ForegroundColor Green
    }
}

Write-Host "Done! Fixed $modifiedFiles files" -ForegroundColor Green

