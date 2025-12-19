# VvelUniverse - Java Backend Full Stack Setup

## ✅ Configuration Complete

The Java Spring Boot backend is now configured to serve the full frontend application, just like the Node.js backend does.

## 🚀 How to Start

Run the start script:
```batch
.\start.bat
```

Then choose:
- **Option 1**: Java Spring Boot Backend + Frontend (NEW - Port 8080)
- **Option 2**: Node.js Backend + Frontend (LEGACY - Port 3000 - for reference)

## 📍 URLs

### Java Backend (Option 1)
- **Full Application**: http://localhost:8080
- **Backend API**: http://localhost:8080/api
- **Login**: http://localhost:8080/login
- **Register**: http://localhost:8080/register

### Node.js Backend (Option 2 - Legacy)
- **Full Application**: http://localhost:3000
- **Backend API**: http://localhost:3000/api

## ✨ What's Configured

### Backend Features
- ✅ Java 21 with Spring Boot 3
- ✅ MongoDB integration (separate database: `vvel_universe_java`)
- ✅ JWT authentication
- ✅ CORS configured for all origins
- ✅ Serves frontend at root path
- ✅ API endpoints at `/api/*`

### Frontend Integration
- ✅ All HTML pages served
- ✅ JavaScript and CSS assets
- ✅ Images and background (Space-bg.jpg with aliases)
- ✅ Category routes (/sports, /medical, etc.)
- ✅ Category sub-pages (/sports-alerts, /medical-community, etc.)
- ✅ Clean URLs (no file extensions needed)

### Routes Configured
- `/` → Login page
- `/login` → Login page
- `/register` → Register page
- `/profile` → Profile page
- `/categories` → Categories page
- `/business`, `/cinema`, `/education`, `/influencers`, `/law`, `/medical`, `/politics`, `/science`, `/sports`, `/spiritual` → Category home pages
- `/[category]-[page]` → Category sub-pages (e.g., `/sports-alerts`)
- Background image accessible at multiple paths for compatibility

## 🔧 Technical Details

### Files Modified/Created:
1. **`backend/src/main/java/com/vveluniverse/config/WebMvcConfig.java`**
   - Configures static resource serving

2. **`backend/src/main/java/com/vveluniverse/controller/PageController.java`**
   - Handles frontend page routing
   - Background image aliases
   - Category routing

3. **`backend/src/main/java/com/vveluniverse/config/SecurityConfig.java`**
   - Updated to allow frontend routes
   - API endpoints at `/api/*`

4. **`backend/src/main/java/com/vveluniverse/controller/AuthController.java`**
   - Updated to `/api/auth/*`

5. **`backend/src/main/java/com/vveluniverse/controller/CategoryController.java`**
   - Updated to `/api/categories/*`

6. **`backend/src/main/resources/application.properties`**
   - Removed context-path
   - Server runs on port 8080

7. **`start-java-backend.bat`**
   - Sets JAVA_HOME to Java 21
   - Starts Gradle wrapper

8. **`start.bat`**
   - Menu to choose Java or Node.js backend

### Database
- Java backend uses: `vvel_universe_java`
- Node.js backend uses: `vvel_universe`
- Both can run independently

## 📝 Notes

- Node.js backend is kept for reference only
- Java backend is the main production backend
- Frontend works with both backends automatically
- All API calls go to `/api/*` which works for both
- Background images and assets are properly served

## ✅ Next Steps

1. Run `.\start.bat`
2. Choose Option 1 (Java backend)
3. Wait for server to start (~2-5 seconds)
4. Application will be available at http://localhost:8080
5. Register/login should work with backend at http://localhost:8080/api

## 🐛 Troubleshooting

If you get build errors:
- Make sure JAVA_HOME is set to Java 21
- Run: `.\start-java-backend.bat` directly to see detailed errors
- Check MongoDB is running on localhost:27017

If frontend doesn't load:
- Check that `frontend` folder is at the same level as `backend` folder
- Clear browser cache and reload
