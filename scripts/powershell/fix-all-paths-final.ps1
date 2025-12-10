# Final comprehensive path fix for all HTML files
Write-Host "Running final comprehensive path fix..." -ForegroundColor Cyan

$files = Get-ChildItem -Path "frontend" -Filter "*.html" -Recurse
$modifiedFiles = 0

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    
    # Fix any remaining /pages/{category}-{page}.html patterns
    $content = $content -replace 'href="/pages/(business|cinema|education|influencers|law|medical|politics|science|sports)-(home|alerts|celebrations|community|search|wallet)\.html"', 'href="/$1-$2"'
    $content = $content -replace "href='/pages/(business|cinema|education|influencers|law|medical|politics|science|sports)-(home|alerts|celebrations|community|search|wallet)\.html'", "href='/$1-$2'"
    
    # Fix window.location patterns
    $content = $content -replace 'window\.location\.href\s*=\s*"/pages/(business|cinema|education|influencers|law|medical|politics|science|sports)-(home|alerts|celebrations|community|search|wallet)\.html"', 'window.location.href = "/$1-$2"'
    $content = $content -replace "window\.location\.href\s*=\s*'/pages/(business|cinema|education|influencers|law|medical|politics|science|sports)-(home|alerts|celebrations|community|search|wallet)\.html'", "window.location.href = '/$1-$2'"
    
    # Fix profile paths
    $content = $content -replace 'href="/pages/profile/profile\.html"', 'href="/profile"'
    $content = $content -replace "href='/pages/profile/profile\.html'", "href='/profile'"
    $content = $content -replace "window\.location\.href='/pages/profile/profile\.html'", "window.location.href='/profile'"
    $content = $content -replace 'window\.location\.href="/pages/profile/profile\.html"', 'window.location.href="/profile"'
    
    # Fix community/wallet paths
$content = $content -replace 'href="/pages/features/community\.html"', 'href="/pages/features/community.html"'
$content = $content -replace 'href="/pages/features/wallet\.html"', 'href="/pages/features/wallet.html"'

# Fix absolute home links like /sports-home.html -> /sports
$content = $content -replace 'window\.location\.href\s*=\s*"/(business|cinema|education|influencers|law|medical|politics|science|sports)-home\.html"', 'window.location.href="/$1"'
$content = $content -replace "window\.location\.href\s*=\s*'/(business|cinema|education|influencers|law|medical|politics|science|sports)-home\.html'", "window.location.href='/$1'"
$content = $content -replace "href='/pages/(business|cinema|education|influencers|law|medical|politics|science|sports)/(business|cinema|education|influencers|law|medical|politics|science|sports)-home\.html'", "href='/$1'"
$content = $content -replace 'href="/pages/(business|cinema|education|influencers|law|medical|politics|science|sports)/(business|cinema|education|influencers|law|medical|politics|science|sports)-home\.html"', 'href="/$1"'

# Fix deep relative ../../../science-home.html -> /science
$content = $content -replace "\.\./\.\./\.\./(business|cinema|education|influencers|law|medical|politics|science|sports)-home\.html", "/$1"
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
        $modifiedFiles++
        Write-Host "Fixed: $($file.Name)" -ForegroundColor Green
    }
}

Write-Host "`nDone! Fixed $modifiedFiles files" -ForegroundColor Green
Write-Host "All paths should now work correctly!" -ForegroundColor Cyan

