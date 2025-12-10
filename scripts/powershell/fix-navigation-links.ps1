# Fix navigation links in all category pages
Write-Host "Fixing navigation links..." -ForegroundColor Cyan

$categories = @('business', 'cinema', 'education', 'influencers', 'law', 'medical', 'politics', 'science', 'sports')

$modifiedFiles = 0

foreach ($category in $categories) {
    $categoryPath = "frontend\pages\categories\$category"
    
    if (Test-Path $categoryPath) {
        $files = Get-ChildItem -Path $categoryPath -Filter "*.html" -File
        
        foreach ($file in $files) {
            $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
            $originalContent = $content
            
            # Fix home link
            $content = $content -replace "window\.location\.href='home\.html'", "window.location.href='$category-home.html'"
            $content = $content -replace 'window\.location\.href="home\.html"', "window.location.href='$category-home.html'"
            
            # Fix community link
            $content = $content -replace "window\.location\.href='community\.html'", "window.location.href='$category-community.html'"
            $content = $content -replace 'window\.location\.href="community\.html"', "window.location.href='$category-community.html'"
            
            # Fix alerts link
            $content = $content -replace "window\.location\.href='alerts\.html'", "window.location.href='$category-alerts.html'"
            $content = $content -replace 'window\.location\.href="alerts\.html"', "window.location.href='$category-alerts.html'"
            
            # Fix celebrations link
            $content = $content -replace "window\.location\.href='celebrations\.html'", "window.location.href='$category-celebrations.html'"
            $content = $content -replace 'window\.location\.href="celebrations\.html"', "window.location.href='$category-celebrations.html'"
            
            # Fix search link
            $content = $content -replace "window\.location\.href='search\.html'", "window.location.href='$category-search.html'"
            $content = $content -replace 'window\.location\.href="search\.html"', "window.location.href='$category-search.html'"
            
            # Fix wallet link
            $content = $content -replace "window\.location\.href='wallet\.html'", "window.location.href='$category-wallet.html'"
            $content = $content -replace 'window\.location\.href="wallet\.html"', "window.location.href='$category-wallet.html'"
            
            if ($content -ne $originalContent) {
                Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
                $modifiedFiles++
                Write-Host "Fixed: $category/$($file.Name)" -ForegroundColor Green
            }
        }
    }
}

Write-Host "`nDone! Fixed $modifiedFiles files" -ForegroundColor Green

