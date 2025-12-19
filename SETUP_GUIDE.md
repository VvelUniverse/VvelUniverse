# 🚀 VvelUniverse Setup Guide

## ✅ What's Been Built

You now have **TWO backend options**:

### 1. **Java Spring Boot 3 Backend** (NEW - Recommended)
- ✅ Location: `vveluniverse/backend/`
- ✅ Port: `8080`
- ✅ JWT Authentication (stateless, mobile-ready)
- ✅ MongoDB integration
- ✅ Category Management API
- ✅ Production-ready
- ✅ Perfect for Android/iOS apps

### 2. **Node.js Backend** (OLD)
- ✅ Location: `vveluniverse/nodejsbackend/`
- ✅ Port: `3000`
- ✅ Session-based authentication
- ✅ Original implementation

---

## 📋 Prerequisites

### Required:
1. **Java 17 or higher**
   - Download: https://adoptium.net/
   - Verify: `java -version`

2. **MongoDB** 
   - Download: https://www.mongodb.com/try/download/community
   - Start service: `mongod`
   - Or use MongoDB Atlas (cloud)

3. **Gradle** (optional - wrapper included)

### Optional (for Node.js backend):
4. **Node.js 14+** (if using old backend)

---

## 🏗️ Quick Start

### Step 1: Initialize Gradle Wrapper (One-time)

```bash
cd vveluniverse/backend
gradle wrapper --gradle-version 8.5
```

Or simply run:
```bash
cd vveluniverse/backend
init-gradle.bat
```

### Step 2: Start the Backend

**Option A: Use the Selector Script**
```bash
cd vveluniverse
start.bat
# Then choose [1] for Java backend
```

**Option B: Direct Start**
```bash
cd vveluniverse
start-java-backend.bat
```

**Option C: Manual Start**
```bash
cd vveluniverse/backend
gradlew bootRun
```

### Step 3: Verify It's Running

Open browser: `http://localhost:8080/api/auth/status`

You should see:
```json
{
  "success": true,
  "message": "Authentication endpoint is working"
}
```

---

## 🔧 First-Time Setup

### 1. Create Admin User

Use Postman, cURL, or any REST client:

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@vveluniverse.com",
    "mobile": "9876543210",
    "password": "Admin@123"
  }'
```

### 2. Login and Get JWT Token

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@vveluniverse.com",
    "password": "Admin@123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWI...",
    "type": "Bearer",
    "id": "657abc...",
    "email": "admin@vveluniverse.com",
    "name": "Admin User",
    "isAdmin": false
  }
}
```

**⚠️ Save this token!** You'll need it for admin operations.

### 3. Make User an Admin (Direct MongoDB)

Since we don't have a superadmin endpoint yet, update MongoDB directly:

```javascript
// In MongoDB shell or Compass
use vvel_universe

db.users.updateOne(
  { email: "admin@vveluniverse.com" },
  { 
    $set: { 
      isAdmin: true,
      adminPermissions: ["all"]
    } 
  }
)
```

Or use this one-liner:
```bash
mongosh vvel_universe --eval 'db.users.updateOne({email:"admin@vveluniverse.com"},{$set:{isAdmin:true,adminPermissions:["all"]}})'
```

---

## 🎯 Testing the APIs

### Test Category Creation (Admin Only)

```bash
curl -X POST http://localhost:8080/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "name": "Sports",
    "icon": "⚽",
    "description": "Sports and athletics content",
    "color": "#6366f1",
    "order": 0
  }'
```

### Get All Categories (Public)

```bash
curl http://localhost:8080/api/categories
```

---

## 🌐 Update Frontend to Use Java Backend

### Option 1: Update Admin Dashboard

Edit `frontend/pages/admin/admin.html`:

```javascript
// Change all API calls from:
const response = await fetch('/api/categories', ...)

// To:
const response = await fetch('http://localhost:8080/api/categories', ...)
```

### Option 2: Add Proxy (Better)

Or configure your frontend server to proxy to `localhost:8080`.

---

## 📊 Database Structure

MongoDB Collections:
- **users** - User accounts with JWT support
- **categories** - Content categories
- **connectrequests** - Video call connection requests

---

## 🔐 JWT Token Flow

1. **Register/Login** → Get JWT token
2. **Store token** securely (localStorage for web, KeyStore/Keychain for mobile)
3. **Add to requests**:
   ```
   Authorization: Bearer YOUR_TOKEN_HERE
   ```
4. **Token expires** after 24 hours → Login again

---

## 🎨 Current Features

### ✅ Authentication
- [x] User Registration
- [x] User Login with JWT
- [x] Password encryption (BCrypt)
- [x] JWT token generation
- [x] Token validation middleware
- [x] Role-based access (USER, ADMIN)

### ✅ Category Management
- [x] Create category (Admin only)
- [x] Get all categories (Public)
- [x] Get category by ID (Public)
- [x] Update category (Admin only)
- [x] Delete category (Admin only)
- [x] Toggle category status (Admin only)
- [x] Auto-slug generation

### ✅ Security
- [x] JWT authentication
- [x] BCrypt password hashing
- [x] CORS configuration
- [x] Role-based access control
- [x] Global exception handling

---

## 🛠️ Development Commands

```bash
# Build project
cd backend
gradlew build

# Run tests
gradlew test

# Clean and build
gradlew clean build

# Run in development mode
gradlew bootRun

# Create JAR file
gradlew build
# Output: build/libs/vveluniverse-backend-1.0.0.jar
```

---

## 🐛 Troubleshooting

### Java Not Found
```bash
# Download Java 17 from: https://adoptium.net/
# Add to PATH and restart terminal
```

### MongoDB Connection Error
```bash
# Start MongoDB service
mongod

# Or check if it's running
mongo --eval "db.version()"
```

### Port 8080 Already in Use
```bash
# Find and kill process
netstat -ano | findstr :8080
taskkill /PID <PID_NUMBER> /F

# Or change port in application.properties
server.port=8081
```

### Gradle Wrapper Not Found
```bash
cd backend
gradle wrapper --gradle-version 8.5
```

---

## 📱 Mobile App Integration

### Android (Retrofit)
```kotlin
interface ApiService {
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): Response<ApiResponse>
    
    @GET("categories")
    suspend fun getCategories(
        @Header("Authorization") token: String
    ): Response<ApiResponse>
}
```

### iOS (URLSession)
```swift
var request = URLRequest(url: url)
request.httpMethod = "POST"
request.addValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
request.addValue("application/json", forHTTPHeaderField: "Content-Type")
```

---

## 🚀 Next Steps

1. ✅ **Backend is ready!**
2. ⏳ Update frontend to use `http://localhost:8080/api`
3. ⏳ Test admin dashboard category management
4. ⏳ Build mobile apps (Android/iOS)
5. ⏳ Add video call WebSocket functionality
6. ⏳ Deploy to production

---

## 📝 API Documentation

Full API docs available in: `backend/README.md`

Base URL: `http://localhost:8080/api`

### Endpoints:
- `POST /auth/register` - Register user
- `POST /auth/login` - Login and get JWT
- `GET /auth/status` - Check API status
- `GET /categories` - Get all categories
- `POST /categories` - Create category (Admin)
- `PUT /categories/{id}` - Update category (Admin)
- `DELETE /categories/{id}` - Delete category (Admin)

---

**🎉 Your Java Spring Boot backend is ready to use!**

For questions or issues, check the README files or backend logs.

