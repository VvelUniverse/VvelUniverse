# Setup SSH config and push to GitHub
$sshDir = "$env:USERPROFILE\.ssh"
$configPath = "$sshDir\config"

# Create SSH config
$configContent = @"
Host github.com
  HostName github.com
  User git
  IdentityFile $sshDir\id_ed25519_github
  IdentitiesOnly yes
  StrictHostKeyChecking accept-new
"@

Set-Content -Path $configPath -Value $configContent -Force

# Add GitHub to known_hosts
ssh-keyscan -t ed25519 github.com | Out-File -Append -FilePath "$sshDir\known_hosts" -Encoding utf8

# Push to GitHub
Write-Host "Pushing to GitHub..."
git push vvel main



