# Vvel Universe - Authentication System

Complete authentication system with Email/Password, Google OAuth, and Instagram OAuth support, integrated with MongoDB.

## 📁 Project Folder Structure

```
Vvel Multiverse/
├── backend/
│   ├── config/
│   │   ├── database.js          # MongoDB connection configuration
│   │   └── passport.js          # Passport OAuth strategies (Google, Instagram)
│   ├── models/
│   │   └── User.js              # User Mongoose schema/model
│   ├── routes/
│   │   └── auth.js              # Authentication routes (register, login, OAuth)
│   ├── env.example.txt          # Environment variables template
│   ├── package.json             # Node.js dependencies
│   └── server.js                # Main Express server file
├── Assets/                      # Static assets (images, etc.)
├── categories.html              # Categories page (redirected after login)
├── index.html                   # Login page
├── register.html                # Registration page
└── README.md                    # This file
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Google Cloud Console account (for Google OAuth)
- Facebook Developers account (for Instagram OAuth)

### Step 1: Install Dependencies

Navigate to the `backend` directory and install npm packages:

```bash
cd backend
npm install
```

### Step 2: Configure Environment Variables

1. Copy the environment template file:
   ```bash
   cp env.example.txt .env
   ```

2. Edit the `.env` file with your credentials:

```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/vvel_universe
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/vvel_universe?retryWrites=true&w=majority

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Instagram OAuth Credentials
INSTAGRAM_CLIENT_ID=your_instagram_client_id_here
INSTAGRAM_CLIENT_SECRET=your_instagram_client_secret_here

# Session Secret (generate a random string)
SESSION_SECRET=your_random_session_secret_here

# Server Port
PORT=3000

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Node Environment
NODE_ENV=development
```

### Step 3: Set Up MongoDB

**Option A: Local MongoDB**
- Install MongoDB locally
- Start MongoDB service
- Use: `MONGO_URI=mongodb://localhost:27017/vvel_universe`

**Option B: MongoDB Atlas (Cloud)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get connection string
4. Update `MONGO_URI` in `.env`

### Step 4: Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google+ API** or **Google Identity Services**
4. Navigate to **Credentials** > **Create Credentials** > **OAuth 2.0 Client ID**
5. Configure OAuth consent screen:
   - User type: External
   - Application name: Vvel Universe
   - Add your email
6. Create OAuth client:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:3000/api/auth/google/callback`
   - **Important:** Make sure the callback URL includes `/api` prefix!
7. Copy **Client ID** and **Client Secret** to `.env`

### Step 5: Set Up Instagram OAuth

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add **Instagram Basic Display** product
4. Create OAuth client:
   - Valid OAuth Redirect URIs: `http://localhost:3000/api/auth/instagram/callback`
   - **Important:** Make sure the callback URL includes `/api` prefix!
5. Copy **App ID** (Client ID) and **App Secret** (Client Secret) to `.env`
6. Note: Instagram Basic Display API may require app review for production use

### Step 6: Generate Session Secret

Generate a random session secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output to `SESSION_SECRET` in `.env`

### Step 7: Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# OR Production mode
npm start
```

The server will start on `http://localhost:3000` (or the port specified in `.env`)

## 🔐 Authentication Features

### 1. Email/Password Registration
- **Route:** `POST /api/register`
- **Fields:** name, email, mobile, password
- **Validation:**
  - All fields required
  - Password minimum 6 characters
  - Email and mobile must be unique
- **Password:** Hashed with bcrypt (10 rounds)

### 2. Email/Password Login
- **Route:** `POST /api/login`
- **Fields:** email, password
- **Error Messages:**
  - "Incorrect password" - wrong password
  - "You're not a registered user" - email not found

### 3. Google OAuth
- **Initiate:** `GET /api/auth/google`
- **Callback:** `GET /api/auth/google/callback`
- Redirects to `/categories.html` after successful authentication

### 4. Instagram OAuth
- **Initiate:** `GET /api/auth/instagram`
- **Callback:** `GET /api/auth/instagram/callback`
- Redirects to `/categories.html` after successful authentication

### 5. Additional Routes
- `GET /api/auth/status` - Check authentication status
- `GET /api/auth/logout` - Logout user
- `GET /api/health` - Health check endpoint

## 📋 API Routes Summary

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/register` | Register new user (email/password) |
| POST | `/api/login` | Login with email/password |
| GET | `/api/auth/google` | Initiate Google OAuth |
| GET | `/api/auth/google/callback` | Google OAuth callback |
| GET | `/api/auth/instagram` | Initiate Instagram OAuth |
| GET | `/api/auth/instagram/callback` | Instagram OAuth callback |
| GET | `/api/auth/status` | Check auth status |
| GET | `/api/auth/logout` | Logout user |

## 🗄️ User Model Schema

```javascript
{
  name: String,           // Required for local provider
  email: String,          // Required, unique, lowercase
  mobile: String,         // Unique (sparse index)
  password: String,       // Hashed with bcrypt (local provider only)
  provider: String,       // 'local', 'google', or 'instagram'
  providerId: String,     // OAuth provider user ID
  createdAt: Date,
  updatedAt: Date
}
```

**Unique Constraints:**
- Email must be unique across all providers
- Mobile number must be unique across all providers
- Prevents duplicate accounts with same email or mobile

## 🎨 Frontend Integration

### Example: Google Login Button

```html
<a class="social-btn" href="/api/auth/google">
  Sign in with Google
</a>
```

### Example: Instagram Login Button

```html
<a class="social-btn" href="/api/auth/instagram">
  Sign in with Instagram
</a>
```

### Example: Register Form (JavaScript)

```javascript
async function handleRegister() {
  const response = await fetch('/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      name: 'John Doe',
      email: 'john@example.com',
      mobile: '+1234567890',
      password: 'securepassword'
    })
  });
  
  const data = await response.json();
  if (data.success) {
    window.location.href = '/categories.html';
  } else {
    alert(data.message); // e.g., "User already exists"
  }
}
```

### Example: Login Form (JavaScript)

```javascript
async function handleLogin() {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      email: 'john@example.com',
      password: 'securepassword'
    })
  });
  
  const data = await response.json();
  if (data.success) {
    window.location.href = '/categories.html';
  } else {
    alert(data.message); // e.g., "Incorrect password" or "You're not a registered user"
  }
}
```

## ⚠️ Error Handling

### Registration Errors
- **400 Bad Request:** Missing required fields
- **409 Conflict:** "User already exists" (duplicate email or mobile)
- **500 Internal Server Error:** Server/database error

### Login Errors
- **400 Bad Request:** Missing email or password
- **401 Unauthorized:** "Incorrect password"
- **404 Not Found:** "You're not a registered user"
- **500 Internal Server Error:** Server/database error

## 🔒 Security Features

1. **Password Hashing:** bcrypt with 10 salt rounds
2. **Session Management:** Express sessions with secure cookies
3. **Input Validation:** Server-side validation for all inputs
4. **Duplicate Prevention:** Unique indexes on email and mobile
5. **CORS Configuration:** Configurable CORS for frontend
6. **Environment Variables:** Sensitive data stored in `.env`

## 📝 Notes

- All passwords are hashed before storage (bcrypt)
- Sessions are used for OAuth authentication
- Email and mobile numbers are case-insensitive and trimmed
- OAuth users don't require password field
- Instagram Basic Display may require app review for production
- Ensure MongoDB connection string is correct in `.env`

## 🐛 Troubleshooting

**MongoDB Connection Error:**
- Check MongoDB service is running (local)
- Verify connection string in `.env`
- Check network access for MongoDB Atlas

**OAuth Not Working:**
- Verify redirect URIs match exactly in OAuth provider settings
- Check `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` in `.env`
- Check `INSTAGRAM_CLIENT_ID`, `INSTAGRAM_CLIENT_SECRET` in `.env`
- Ensure OAuth consent screen is configured

**Port Already in Use:**
- Change `PORT` in `.env` to a different port
- Kill process using port: `lsof -ti:3000 | xargs kill` (Mac/Linux)

## 📄 License

ISC

