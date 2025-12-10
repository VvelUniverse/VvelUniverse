# Fix script paths in all subcategory pages
Write-Host "Fixing script paths in subcategory pages..." -ForegroundColor Cyan

$categories = @('business', 'cinema', 'education', 'influencers', 'law', 'medical', 'politics', 'science', 'sports')
$modifiedFiles = 0

foreach ($category in $categories) {
    $subcategoryPath = "frontend\pages\categories\$category\subcategories"
    
    if (Test-Path $subcategoryPath) {
        $files = Get-ChildItem -Path $subcategoryPath -Filter "*.html"
        
        foreach ($file in $files) {
            $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
            $originalContent = $content
            
            # Fix category-specific common.js
            $content = $content -replace 'src="/business-common\.js"', 'src="/scripts/categories/business-common.js"'
            $content = $content -replace 'src="/cinema-common\.js"', 'src="/scripts/categories/cinema-common.js"'
            $content = $content -replace 'src="/education-common\.js"', 'src="/scripts/categories/education-common.js"'
            $content = $content -replace 'src="/influencers-common\.js"', 'src="/scripts/categories/influencers-common.js"'
            $content = $content -replace 'src="/law-common\.js"', 'src="/scripts/categories/law-common.js"'
            $content = $content -replace 'src="/medical-common\.js"', 'src="/scripts/categories/medical-common.js"'
            $content = $content -replace 'src="/politics-common\.js"', 'src="/scripts/categories/politics-common.js"'
            $content = $content -replace 'src="/science-common\.js"', 'src="/scripts/categories/science-common.js"'
            $content = $content -replace 'src="/sports-common\.js"', 'src="/scripts/categories/sports-common.js"'
            
            # Fix profile-icon.js
            $content = $content -replace 'src="/profile-icon\.js"', 'src="/scripts/common/profile-icon.js"'
            
            # Fix other common scripts if present
            $content = $content -replace 'src="/app-state\.js"', 'src="/scripts/common/app-state.js"'
            $content = $content -replace 'src="/swipe-navigation\.js"', 'src="/scripts/common/swipe-navigation.js"'
            
            if ($content -ne $originalContent) {
                Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
                $modifiedFiles++
                Write-Host "Fixed: $category/subcategories/$($file.Name)" -ForegroundColor Green
            }
        }
    }
}

Write-Host "`nDone! Fixed $modifiedFiles files" -ForegroundColor Green

