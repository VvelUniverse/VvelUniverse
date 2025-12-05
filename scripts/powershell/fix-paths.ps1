# PowerShell script to fix file paths in HTML files after restructuring
# This updates old relative paths to new absolute paths

Write-Host "Starting path migration..." -ForegroundColor Cyan

# Define path replacements
$replacements = @(
    # CSS files
    @{ Pattern = 'href="loading-styles\.css"'; Replacement = 'href="/styles/loading-styles.css"' }
    @{ Pattern = "href='loading-styles\.css'"; Replacement = "href='/styles/loading-styles.css'" }
    
    # Common JavaScript files
    @{ Pattern = 'src="app-state\.js"'; Replacement = 'src="/scripts/common/app-state.js"' }
    @{ Pattern = 'src="i18n\.js"'; Replacement = 'src="/scripts/common/i18n.js"' }
    @{ Pattern = 'src="loading-utils\.js"'; Replacement = 'src="/scripts/common/loading-utils.js"' }
    @{ Pattern = 'src="profile-icon\.js"'; Replacement = 'src="/scripts/common/profile-icon.js"' }
    @{ Pattern = 'src="swipe-navigation\.js"'; Replacement = 'src="/scripts/common/swipe-navigation.js"' }
    
    # Config JavaScript files
    @{ Pattern = 'src="admin-config\.js"'; Replacement = 'src="/scripts/config/admin-config.js"' }
    @{ Pattern = 'src="celebrations-config\.js"'; Replacement = 'src="/scripts/config/celebrations-config.js"' }
    
    # Utility JavaScript files
    @{ Pattern = 'src="alerts-icon\.js"'; Replacement = 'src="/scripts/utils/alerts-icon.js"' }
    @{ Pattern = 'src="add-profile-icon-to-categories\.js"'; Replacement = 'src="/scripts/utils/add-profile-icon-to-categories.js"' }
    
    # Category-specific JavaScript files
    @{ Pattern = 'src="business-common\.js"'; Replacement = 'src="/scripts/categories/business-common.js"' }
    @{ Pattern = 'src="cinema-common\.js"'; Replacement = 'src="/scripts/categories/cinema-common.js"' }
    @{ Pattern = 'src="education-common\.js"'; Replacement = 'src="/scripts/categories/education-common.js"' }
    @{ Pattern = 'src="influencers-common\.js"'; Replacement = 'src="/scripts/categories/influencers-common.js"' }
    @{ Pattern = 'src="law-common\.js"'; Replacement = 'src="/scripts/categories/law-common.js"' }
    @{ Pattern = 'src="medical-common\.js"'; Replacement = 'src="/scripts/categories/medical-common.js"' }
    @{ Pattern = 'src="politics-common\.js"'; Replacement = 'src="/scripts/categories/politics-common.js"' }
    @{ Pattern = 'src="science-common\.js"'; Replacement = 'src="/scripts/categories/science-common.js"' }
    @{ Pattern = 'src="sports-common\.js"'; Replacement = 'src="/scripts/categories/sports-common.js"' }
    
    # Image files
    @{ Pattern = 'src="vvel-logo\.png"'; Replacement = 'src="/assets/images/vvel-logo.png"' }
    @{ Pattern = 'src="Space-bg\.jpg"'; Replacement = 'src="/assets/images/space-bg.jpg"' }
    @{ Pattern = "url\('Space-bg\.jpg'\)"; Replacement = "url('/assets/images/space-bg.jpg')" }
    @{ Pattern = 'url\("Space-bg\.jpg"\)'; Replacement = 'url("/assets/images/space-bg.jpg")' }
    
    # Background image multiple attempts
    @{ Pattern = '(?s)background-image:\s*url\(''Space-bg\.jpg''\),\s*url\(''Space-bg\.png''\),\s*url\(''Space-bg\.jpeg''\),\s*url\(''space-bg\.jpg''\),\s*url\(''space-bg\.png''\),\s*url\(''space-bg\.jpeg''\);'; Replacement = "background-image: url('/assets/images/space-bg.jpg');" }
    
    # Page redirects in JavaScript
    @{ Pattern = "window\.location\.href\s*=\s*'/categories\.html'"; Replacement = "window.location.href = '/pages/categories/categories.html'" }
    @{ Pattern = 'window\.location\.href\s*=\s*"/categories\.html"'; Replacement = 'window.location.href = "/pages/categories/categories.html"' }
    @{ Pattern = "window\.location\.href\s*=\s*'categories\.html'"; Replacement = "window.location.href = '/pages/categories/categories.html'" }
    @{ Pattern = 'window\.location\.href\s*=\s*"categories\.html"'; Replacement = 'window.location.href = "/pages/categories/categories.html"' }
    
    @{ Pattern = "window\.location\.href\s*=\s*'/profile\.html'"; Replacement = "window.location.href = '/pages/profile/profile.html'" }
    @{ Pattern = "window\.location\.href\s*=\s*'profile\.html'"; Replacement = "window.location.href = '/pages/profile/profile.html'" }
    
    @{ Pattern = "window\.location\.href\s*=\s*'/admin\.html'"; Replacement = "window.location.href = '/pages/admin/admin.html'" }
    @{ Pattern = "window\.location\.href\s*=\s*'admin\.html'"; Replacement = "window.location.href = '/pages/admin/admin.html'" }
    
    # Page links in HTML
    @{ Pattern = 'href="categories\.html"'; Replacement = 'href="/pages/categories/categories.html"' }
    @{ Pattern = 'href="profile\.html"'; Replacement = 'href="/pages/profile/profile.html"' }
    @{ Pattern = 'href="admin\.html"'; Replacement = 'href="/pages/admin/admin.html"' }
    @{ Pattern = 'href="index\.html"'; Replacement = 'href="/pages/auth/index.html"' }
    @{ Pattern = 'href="register\.html"'; Replacement = 'href="/pages/auth/register.html"' }
)

# Get all HTML files in frontend
$htmlFiles = Get-ChildItem -Path "frontend" -Filter "*.html" -Recurse

$totalFiles = $htmlFiles.Count
$processedFiles = 0
$modifiedFiles = 0

Write-Host "Found $totalFiles HTML files to process..." -ForegroundColor Yellow

foreach ($file in $htmlFiles) {
    $processedFiles++
    $modified = $false
    
    try {
        $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
        $originalContent = $content
        
        # Apply all replacements
        foreach ($replacement in $replacements) {
            if ($content -match $replacement.Pattern) {
                $content = $content -replace $replacement.Pattern, $replacement.Replacement
                $modified = $true
            }
        }
        
        # Save if modified
        if ($modified -and $content -ne $originalContent) {
            Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
            $modifiedFiles++
            Write-Host "  [$processedFiles/$totalFiles] Updated: $($file.FullName)" -ForegroundColor Green
        } else {
            Write-Host "  [$processedFiles/$totalFiles] No changes: $($file.Name)" -ForegroundColor Gray
        }
    }
    catch {
        Write-Host "  [$processedFiles/$totalFiles] ERROR: $($file.Name) - $_" -ForegroundColor Red
    }
}

Write-Host "`nPath migration complete!" -ForegroundColor Cyan
Write-Host "Processed: $processedFiles files" -ForegroundColor White
Write-Host "Modified: $modifiedFiles files" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Review the changes" -ForegroundColor White
Write-Host "2. Test the application: npm run dev" -ForegroundColor White
Write-Host "3. Check browser console for any 404 errors" -ForegroundColor White

