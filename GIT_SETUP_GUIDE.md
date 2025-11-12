# Git Setup Guide for Vvel Universe

## ⚠️ Important: Before You Start

**DO NOT commit these files:**
- `.env` files (contain passwords and API keys)
- `uploads/` folder (contains user documents)
- `node_modules/` (can be reinstalled)
- Any files with sensitive data

## 📋 Step-by-Step Setup

### Step 1: Install Git (if not installed)

**Windows:**
1. Download from: https://git-scm.com/download/win
2. Install with default settings
3. Restart your terminal/PowerShell

**macOS:**
```bash
brew install git
```

**Linux:**
```bash
sudo apt-get install git
```

### Step 2: Verify Git Installation

```bash
git --version
```

### Step 3: Configure Git (First Time Only)

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Step 4: Initialize Repository

```bash
# Navigate to project root
cd "D:\Vvel Multiverse"

# Initialize git
git init
```

### Step 5: Check What Will Be Committed

```bash
# See what files will be added
git status

# See detailed changes
git status --short
```

### Step 6: Add Files to Staging

```bash
# Add all files (respects .gitignore)
git add .
```

**Verify sensitive files are NOT included:**
```bash
# Check if .env is being tracked (should show nothing)
git ls-files | grep .env

# Check if uploads folder is being tracked (should show nothing)
git ls-files | grep uploads
```

### Step 7: Create Initial Commit

```bash
git commit -m "Initial commit: Vvel Universe with KYC verification system"
```

### Step 8: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `vvel-universe` (or your preferred name)
3. Description: "Vvel Universe - Social platform with influencer KYC verification"
4. Choose Public or Private
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

### Step 9: Add Remote and Push

**Replace `yourusername` and `repository-name` with your actual GitHub username and repo name:**

```bash
# Add remote repository
git remote add origin https://github.com/yourusername/repository-name.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

**If you get authentication error:**
- Use Personal Access Token instead of password
- Or use SSH: `git@github.com:yourusername/repository-name.git`

## 🔐 Security Checklist

Before pushing, verify these files are **NOT** in your commit:

```bash
# Check for .env files
git ls-files | findstr .env

# Check for uploads
git ls-files | findstr uploads

# Check for node_modules
git ls-files | findstr node_modules
```

If any of these show files, they will be committed! Fix by:

```bash
# Remove from git tracking (but keep local file)
git rm --cached backend/.env
git rm --cached -r uploads/

# Update .gitignore if needed
# Then commit the removal
git add .gitignore
git commit -m "Remove sensitive files from tracking"
```

## 📝 Recommended Commit Message Format

```bash
git commit -m "feat: Add KYC verification system with free OCR and social media verification"
```

Common prefixes:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Formatting
- `refactor:` - Code restructuring
- `test:` - Adding tests
- `chore:` - Maintenance

## 🔄 Future Updates

```bash
# Check status
git status

# Add changes
git add .

# Commit
git commit -m "Your commit message"

# Push
git push
```

## 🚨 If You Accidentally Committed Sensitive Files

```bash
# Remove from git history (use with caution!)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch backend/.env" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (WARNING: This rewrites history)
git push origin --force --all
```

**Better solution:** Rotate all API keys and passwords that were exposed!

## 📚 Useful Git Commands

```bash
# View commit history
git log --oneline

# View changes
git diff

# Create new branch
git checkout -b feature-name

# Switch branches
git checkout main

# Merge branch
git merge feature-name

# View remote
git remote -v

# Update remote URL
git remote set-url origin https://github.com/yourusername/new-repo.git
```

## ✅ Final Checklist

- [ ] Git installed
- [ ] Git configured (name & email)
- [ ] `.gitignore` file created
- [ ] Repository initialized
- [ ] Sensitive files checked (no .env, uploads, etc.)
- [ ] Initial commit created
- [ ] GitHub repository created
- [ ] Remote added
- [ ] Code pushed successfully

---

**Ready to push!** Follow the steps above and replace `yourusername/repository-name` with your actual GitHub details.

