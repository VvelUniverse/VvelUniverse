# Vvel Universe - Social Platform

A comprehensive social platform with multi-category support, authentication, and community features.

## 🎉 Project Successfully Reorganized!

The entire project has been restructured from 100+ files in the root directory to a clean, organized folder structure.

**See [STRUCTURE.md](./STRUCTURE.md) for detailed folder structure.**

## 📁 Quick Overview

```
VvelUniverse/
├── backend/          # Express.js server + MongoDB
├── frontend/         # HTML, CSS, JS organized by feature
│   ├── pages/       # HTML pages by category
│   ├── scripts/     # JavaScript utilities
│   ├── styles/      # CSS files
│   └── public/      # Static assets
├── uploads/         # User uploads (KYC, etc.)
├── scripts/         # Build & automation scripts
├── docs/            # Documentation
└── package.json     # Root package manager
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (local or Atlas account)
- **Google OAuth** credentials (optional)
- **Instagram OAuth** credentials (optional)

### Step 1: Install Dependencies

```powershell
# Install backend dependencies
cd backend
npm install
cd ..
```

### Step 2: Configure Environment

```powershell
# Copy environment template
cd backend
cp env.example.txt .env

# Edit .env with your credentials
notepad .env
```

**Required Environment Variables:**

```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/vvel_universe

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Instagram OAuth (optional)
INSTAGRAM_CLIENT_ID=your_instagram_client_id_here
INSTAGRAM_CLIENT_SECRET=your_instagram_client_secret_here

# Session Secret
SESSION_SECRET=generate_random_32_char_string

# Server Configuration
PORT=3000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

**Generate Session Secret:**

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 3: Set Up MongoDB

**Option A: Local MongoDB**
- Install and start MongoDB locally
- Use: `MONGO_URI=mongodb://localhost:27017/vvel_universe`

**Option B: MongoDB Atlas (Cloud)**
- Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create cluster and get connection string
- Update `MONGO_URI` in `.env`

### Step 4: Start the Server

**Option 1: Using PowerShell Script (Recommended)**

```powershell
# From project root
powershell -ExecutionPolicy Bypass -File .\scripts\powershell\start-server.ps1
```

**Option 2: Using NPM Scripts**

```powershell
# From project root
npm run dev
```

**Option 3: Manual Start**

```powershell
# From project root
cd backend
npm run dev
```

The server will start on **http://localhost:3000**

### Step 5: Access the Application

- **Login Page**: http://localhost:3000/ or http://localhost:3000/pages/auth/index.html
- **Register Page**: http://localhost:3000/pages/auth/register.html
- **Categories**: http://localhost:3000/pages/categories/categories.html (after login)

## 🔐 Authentication Features

### 1. Email/Password Authentication
- **Register**: POST `/api/register`
- **Login**: POST `/api/login`
- Password hashing with bcrypt
- Session-based authentication

### 2. Google OAuth
- **Initiate**: GET `/api/auth/google`
- **Callback**: GET `/api/auth/google/callback`
- See [docs/GOOGLE_OAUTH_SETUP.md](./docs/GOOGLE_OAUTH_SETUP.md) for setup

### 3. Instagram OAuth
- **Initiate**: GET `/api/auth/instagram`
- **Callback**: GET `/api/auth/instagram/callback`

### 4. Additional Endpoints
- **Check Status**: GET `/api/auth/status`
- **Logout**: GET `/api/auth/logout`
- **Health Check**: GET `/api/health`

## 📂 Categories

The platform supports multiple categories, each with dedicated pages:

- **Business** - 21 subcategories (agriculture, automotive, finance, etc.)
- **Cinema** - 24 subcategories (Bollywood, Hollywood, Kollywood, etc.)
- **Education** - 21 subcategories (computer, medical, engineering, etc.)
- **Influencers** - 12 subcategories (fashion, fitness, tech, travel, etc.)
- **Law** - Legal and judicial content
- **Medical** - Healthcare and medical content
- **Politics** - 8 regions (Africa, Asia, Europe, Americas, etc.)
- **Science** - Scientific content and research
- **Sports** - Various sports categories

Each category has consistent pages:
- Home
- Alerts
- Celebrations
- Community
- Search
- Wallet

## 🛠️ Development

### Project Structure

See [STRUCTURE.md](./STRUCTURE.md) for complete folder structure.

### Available Scripts

```json
{
  "start": "cd backend && npm start",
  "dev": "cd backend && npm run dev",
  "dev:clean": "powershell -ExecutionPolicy Bypass -File ./scripts/powershell/start-server.ps1",
  "kill-port": "cd backend && node scripts/kill-port.js"
}
```

### Kill Port (if server won't start)

```powershell
npm run kill-port
```

## 📝 API Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/register` | Register new user |
| POST | `/api/login` | Login with email/password |
| GET | `/api/auth/google` | Initiate Google OAuth |
| GET | `/api/auth/google/callback` | Google OAuth callback |
| GET | `/api/auth/instagram` | Initiate Instagram OAuth |
| GET | `/api/auth/instagram/callback` | Instagram OAuth callback |
| GET | `/api/auth/status` | Check authentication status |
| GET | `/api/auth/logout` | Logout user |
| GET | `/api/health` | Health check |

## 🗄️ Database Models

### User Model
```javascript
{
  name: String,          // Required for local provider
  email: String,         // Required, unique
  mobile: String,        // Unique
  password: String,      // Hashed (local provider only)
  provider: String,      // 'local', 'google', 'instagram'
  providerId: String,    // OAuth provider user ID
  createdAt: Date,
  updatedAt: Date
}
```

### ConnectRequest Model
```javascript
{
  from: ObjectId,        // User who sent request
  to: ObjectId,          // User who receives request
  status: String,        // 'pending', 'accepted', 'rejected'
  createdAt: Date,
  updatedAt: Date
}
```

## 🔒 Security Features

- ✅ Password hashing with bcrypt (10 rounds)
- ✅ Session-based authentication
- ✅ CORS configuration
- ✅ Input validation
- ✅ Unique constraints on email/mobile
- ✅ Environment variables for sensitive data
- ✅ OAuth integration for social login

## 📖 Documentation

Additional documentation is available in the `/docs` folder:

- [FREE_KYC_VERIFICATION_OPTIONS.md](./docs/FREE_KYC_VERIFICATION_OPTIONS.md)
- [FRONTEND_INTEGRATION_EXAMPLES.md](./docs/FRONTEND_INTEGRATION_EXAMPLES.md)
- [GITHUB_AUTH_SETUP.md](./docs/GITHUB_AUTH_SETUP.md)
- [GOOGLE_OAUTH_SETUP.md](./docs/GOOGLE_OAUTH_SETUP.md)
- [KYC_VERIFICATION_AUTOMATION_REQUIREMENTS.md](./docs/KYC_VERIFICATION_AUTOMATION_REQUIREMENTS.md)

## 🐛 Troubleshooting

### MongoDB Connection Error
- Verify MongoDB is running (local)
- Check connection string in `.env`
- Ensure network access for MongoDB Atlas

### OAuth Not Working
- Verify redirect URIs match in OAuth provider settings
- Check credentials in `.env`
- Ensure OAuth consent screen is configured

### Port Already in Use
```powershell
npm run kill-port
```

Or manually:
```powershell
# Find process
netstat -ano | findstr :3000

# Kill process (replace PID)
taskkill /PID <PID> /F
```

### Server Won't Start
1. Check MongoDB connection
2. Verify all dependencies installed: `cd backend && npm install`
3. Check `.env` file exists and is configured
4. Try clean start: `npm run dev:clean`

## 🎯 Next Steps

### Path Updates Required

After restructuring, you need to update file paths in HTML/JS files:

**Example Updates Needed:**

```html
<!-- OLD -->
<script src="app-state.js"></script>
<link rel="stylesheet" href="loading-styles.css">
<img src="vvel-logo.png" alt="Logo">

<!-- NEW -->
<script src="/scripts/common/app-state.js"></script>
<link rel="stylesheet" href="/styles/loading-styles.css">
<img src="/assets/images/vvel-logo.png" alt="Logo">
```

### Recommended Improvements

1. **Add .gitignore** - Ignore node_modules, .env, uploads
2. **Update Paths** - Fix all file references in HTML/JS
3. **Add Tests** - Unit and integration tests
4. **Error Logging** - Implement proper logging (Winston, Morgan)
5. **Email Service** - For password reset functionality
6. **SMS Service** - For mobile verification
7. **File Upload** - Complete KYC verification flow
8. **Admin Dashboard** - Finish admin functionality

## 📄 License

ISC

## 👤 Author

Vvel Universe Team

---

**Need Help?** Check out the documentation in the `/docs` folder or open an issue.
