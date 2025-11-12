# Install KYC Dependencies

The server crashed because KYC dependencies are not installed. Follow these steps:

## Quick Fix

Run this command in the `backend` directory:

```bash
cd backend
npm install multer tesseract.js sharp puppeteer axios
```

## What Each Package Does

- **multer** - File upload handling for ID documents
- **tesseract.js** - OCR for ID number extraction
- **sharp** - Image processing and enhancement
- **puppeteer** - Web scraping for social media (Instagram, Twitter, TikTok)
- **axios** - HTTP client for YouTube API

## After Installation

1. Restart the server:
   ```bash
   npm run dev
   ```

2. The server should now start without errors.

## Optional: Install System Dependencies

For full functionality, also install:

### Tesseract OCR (Required for ID verification)
- **Windows**: Download from https://github.com/UB-Mannheim/tesseract/wiki
- **macOS**: `brew install tesseract`
- **Ubuntu/Debian**: `sudo apt-get install tesseract-ocr`

### YouTube API Key (Required for YouTube verification)
1. Go to https://console.cloud.google.com/
2. Create project and enable YouTube Data API v3
3. Create API key
4. Add to `.env`: `YOUTUBE_API_KEY=your_key_here`

## Note

The server will now start even without these dependencies, but KYC features won't work until they're installed.

