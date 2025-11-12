# Free KYC Verification Setup Instructions

Complete step-by-step guide to set up free KYC verification system.

---

## 📋 Prerequisites

1. **Node.js** (v14 or higher)
2. **MongoDB** (local or Atlas)
3. **Tesseract OCR** (for ID verification)
4. **Google Cloud Account** (for YouTube API - free tier)

---

## 🚀 Step 1: Install System Dependencies

### Install Tesseract OCR

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install tesseract-ocr
```

**macOS:**
```bash
brew install tesseract
```

**Windows:**
1. Download installer from: https://github.com/UB-Mannheim/tesseract/wiki
2. Install to default location: `C:\Program Files\Tesseract-OCR`
3. Add to PATH or set environment variable:
   ```bash
   setx PATH "%PATH%;C:\Program Files\Tesseract-OCR"
   ```

**Verify Installation:**
```bash
tesseract --version
```

### Install Chromium (for Puppeteer)

Puppeteer will automatically download Chromium, but if you have issues:

**Ubuntu/Debian:**
```bash
sudo apt-get install chromium-browser
```

**macOS:**
```bash
brew install chromium
```

---

## 📦 Step 2: Install Node.js Dependencies

Navigate to the `backend` directory:

```bash
cd backend
npm install
```

This will install:
- `tesseract.js` - OCR library
- `sharp` - Image processing
- `puppeteer` - Web scraping for social media
- `axios` - HTTP client for APIs
- `multer` - File upload handling

---

## 🔑 Step 3: Get YouTube API Key (Free)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use existing)
3. Enable **YouTube Data API v3**:
   - Go to "APIs & Services" > "Library"
   - Search for "YouTube Data API v3"
   - Click "Enable"
4. Create API Key:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the API key
5. (Optional) Restrict API key to YouTube Data API v3 for security

**Free Tier:** 10,000 units/day (1 API call = 1 unit)

---

## ⚙️ Step 4: Configure Environment Variables

Add to your `.env` file in the `backend` directory:

```env
# YouTube API Key (for social media verification)
YOUTUBE_API_KEY=your_youtube_api_key_here

# Optional: Tesseract path (if not in PATH)
# TESSERACT_PATH=/usr/bin/tesseract
# Windows: TESSERACT_PATH=C:\Program Files\Tesseract-OCR\tesseract.exe
```

---

## 📁 Step 5: Create Upload Directory

Create directory for KYC document uploads:

```bash
# From project root
mkdir -p uploads/kyc
```

Or manually create `uploads/kyc` folder in project root.

**Important:** Add to `.gitignore`:
```
uploads/
```

---

## 🗄️ Step 6: Update User Model (Optional)

If you want to track account type in User model, update `backend/models/User.js`:

```javascript
// Add to userSchema
accountType: {
  type: String,
  enum: ['user', 'client'],
  default: 'user'
}
```

---

## 🧪 Step 7: Test the Setup

### Test Tesseract OCR

Create a test file `backend/test-ocr.js`:

```javascript
const Tesseract = require('tesseract.js');

Tesseract.recognize(
  'path/to/test-image.jpg',
  'eng',
  { logger: m => console.log(m) }
).then(({ data: { text } }) => {
  console.log('OCR Result:', text);
});
```

Run:
```bash
node test-ocr.js
```

### Test YouTube API

Create a test file `backend/test-youtube.js`:

```javascript
const axios = require('axios');
require('dotenv').config();

async function test() {
  const channelId = 'UC_x5XG1OV2P6uZZ5FSM9Ttw'; // Google Developers
  const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${process.env.YOUTUBE_API_KEY}`;
  
  try {
    const response = await axios.get(url);
    console.log('YouTube API Test:', response.data.items[0].statistics);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

test();
```

Run:
```bash
node test-youtube.js
```

---

## 🚀 Step 8: Start the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

---

## 📡 Step 9: Test KYC Submission

### Using Postman or cURL:

```bash
curl -X POST http://localhost:3000/api/influencer/kyc \
  -F "userId=YOUR_USER_ID" \
  -F "idType=aadhaar" \
  -F "idNumber=123456789012" \
  -F "idFront=@/path/to/id-front.jpg" \
  -F "idBack=@/path/to/id-back.jpg" \
  -F 'socialMedia={"youtube":{"url":"https://youtube.com/@channel","subscribers":1000}}' \
  -F "bio=Test bio"
```

### Expected Response:

```json
{
  "success": true,
  "message": "KYC submitted successfully. Verification in progress.",
  "kycId": "...",
  "status": "pending"
}
```

---

## 🔍 Step 10: Check Verification Status

```bash
curl http://localhost:3000/api/influencer/kyc/status?userId=YOUR_USER_ID
```

---

## ⚠️ Important Notes

### Web Scraping Warnings

1. **Instagram/Twitter/TikTok verification uses web scraping**
   - May violate platform Terms of Service
   - Use at your own risk
   - Consider using official APIs when available

2. **Rate Limiting**
   - Implement delays between requests
   - Use proxies if needed (for production)
   - Monitor for IP blocking

### Accuracy Considerations

1. **Tesseract OCR Accuracy:**
   - 70-90% accuracy (vs 95%+ for paid services)
   - Depends on image quality
   - May require manual review for edge cases

2. **Social Media Verification:**
   - Follower counts change in real-time
   - 10% variance threshold is acceptable
   - Some platforms may have rate limits

### Production Recommendations

1. **Add Queue System:**
   - Use Bull or similar for async processing
   - Handle retries and failures
   - Monitor queue status

2. **Add Logging:**
   - Log all verification attempts
   - Track success/failure rates
   - Monitor API usage

3. **Add Caching:**
   - Cache social media follower counts
   - Reduce API calls
   - Improve performance

4. **Add Manual Review:**
   - Flag low-confidence verifications
   - Allow admin review
   - Provide override mechanism

---

## 🐛 Troubleshooting

### Tesseract Not Found

**Error:** `Tesseract is not installed`

**Solution:**
- Verify Tesseract is installed: `tesseract --version`
- Set `TESSERACT_PATH` in `.env` if needed
- Restart server after installation

### Puppeteer Chromium Download Fails

**Error:** `Failed to download Chromium`

**Solution:**
```bash
# Set Puppeteer to skip download (use system Chromium)
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
npm install puppeteer
```

Or manually set Chromium path:
```javascript
const browser = await puppeteer.launch({
  executablePath: '/usr/bin/chromium-browser'
});
```

### YouTube API Quota Exceeded

**Error:** `Quota exceeded`

**Solution:**
- Check API usage in Google Cloud Console
- Wait for quota reset (daily)
- Consider implementing caching
- Use multiple API keys and rotate

### Image Processing Errors

**Error:** `Image processing failed`

**Solution:**
- Check file format (JPEG, PNG, PDF)
- Verify file size (< 5MB)
- Check file permissions
- Ensure Sharp is properly installed

---

## 📊 Monitoring

### Check Verification Status

```javascript
// Get all pending verifications
const pending = await KYC.find({ status: 'verifying' });

// Get verification statistics
const stats = await KYC.aggregate([
  {
    $group: {
      _id: '$status',
      count: { $sum: 1 }
    }
  }
]);
```

### API Usage Tracking

Monitor YouTube API usage in Google Cloud Console:
- APIs & Services > Dashboard
- View quota and usage

---

## ✅ Verification Complete!

Your free KYC verification system is now set up and ready to use!

**Next Steps:**
1. Test with real data
2. Monitor accuracy and adjust thresholds
3. Add manual review for edge cases
4. Consider upgrading to paid services if needed

---

**Last Updated**: [Current Date]
**Version**: 1.0

