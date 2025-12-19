# VvelUniverse Backend - Spring Boot 3

Modern Java Spring Boot 3 backend for VvelUniverse video call service application.

## 🚀 Technologies

- **Java 17** (LTS)
- **Spring Boot 3.2.1**
- **Spring Security** with JWT Authentication
- **Spring Data MongoDB**
- **Gradle 8.x**
- **MongoDB** Database
- **Lombok** for reduced boilerplate

## 📋 Prerequisites

1. **Java 17 or higher**
   ```bash
   java -version
   ```

2. **MongoDB** running on `localhost:27017`
   - Download: https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas (cloud)

3. **Gradle** (included via wrapper)

## 🏗️ Project Structure

```
backend/
├── src/main/java/com/vveluniverse/
│   ├── VvelUniverseApplication.java   # Main application
│   ├── config/                        # Configuration classes
│   │   ├── SecurityConfig.java        # Security & JWT config
│   │   └── CorsConfig.java            # CORS configuration
│   ├── model/                         # MongoDB entities
│   │   ├── User.java
│   │   ├── Category.java
│   │   └── ConnectRequest.java
│   ├── repository/                    # Spring Data repositories
│   ├── service/                       # Business logic
│   ├── controller/                    # REST API endpoints
│   ├── dto/                           # Data Transfer Objects
│   ├── security/                      # JWT implementation
│   │   ├── JwtTokenProvider.java
│   │   ├── JwtAuthenticationFilter.java
│   │   └── UserDetailsServiceImpl.java
│   └── exception/                     # Error handling
└── src/main/resources/
    └── application.properties         # Configuration

```

## ⚙️ Configuration

Edit `src/main/resources/application.properties`:

```properties
# Server runs on port 8080
server.port=8080

# MongoDB connection
spring.data.mongodb.uri=mongodb://localhost:27017/vvel_universe

# JWT Secret (change this in production!)
jwt.secret=YOUR_SECRET_KEY_HERE
jwt.expiration=86400000  # 24 hours

# CORS (add your frontend URLs)
cors.allowed-origins=http://localhost:3000
```

## 🚀 How to Run

### Option 1: Using Gradle Wrapper (Recommended)

**Windows:**
```bash
cd backend
.\gradlew bootRun
```

**Linux/Mac:**
```bash
cd backend
./gradlew bootRun
```

### Option 2: Build JAR and Run

```bash
cd backend
.\gradlew build
java -jar build/libs/vveluniverse-backend-1.0.0.jar
```

### Option 3: Using IDE

1. Open the `backend` folder in IntelliJ IDEA or Eclipse
2. Run `VvelUniverseApplication.java`

## 📡 API Endpoints

### Base URL
```
http://localhost:8080/api
```

### Authentication (No JWT required)

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "mobile": "1234567890",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzUxMiJ9...",
    "type": "Bearer",
    "id": "...",
    "email": "john@example.com",
    "name": "John Doe",
    "isAdmin": false
  }
}
```

### Categories (Public access)

#### Get All Categories
```http
GET /api/categories
```

#### Get Active Categories Only
```http
GET /api/categories?active=true
```

### Admin Endpoints (JWT with ADMIN role required)

#### Create Category
```http
POST /api/categories
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "Sports",
  "icon": "⚽",
  "description": "Sports and athletics",
  "color": "#6366f1",
  "order": 0
}
```

#### Update Category
```http
PUT /api/categories/{id}
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "Updated Name",
  "icon": "🎯"
}
```

#### Delete Category
```http
DELETE /api/categories/{id}
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Toggle Category Status
```http
PUT /api/categories/{id}/toggle
Authorization: Bearer YOUR_JWT_TOKEN
```

## 🔐 JWT Authentication Flow

1. **Register/Login** → Receive JWT token
2. **Store token** securely (in mobile app: KeyStore/Keychain)
3. **Add token to requests**:
   ```
   Authorization: Bearer YOUR_JWT_TOKEN
   ```
4. **Token expires** after 24 hours → Login again or use refresh token

## 🧪 Testing with Postman/cURL

### Register a user
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

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@vveluniverse.com",
    "password": "Admin@123"
  }'
```

### Create Category (with JWT)
```bash
curl -X POST http://localhost:8080/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Sports",
    "icon": "⚽",
    "description": "Sports content",
    "color": "#6366f1"
  }'
```

## 📱 Mobile App Integration

### Android (Kotlin)
```kotlin
// Add JWT to requests
val request = Request.Builder()
    .url("http://localhost:8080/api/categories")
    .addHeader("Authorization", "Bearer $jwtToken")
    .build()
```

### iOS (Swift)
```swift
// Add JWT to requests
var request = URLRequest(url: url)
request.addValue("Bearer \(jwtToken)", forHTTPHeaderField: "Authorization")
```

## 🛠️ Development

### Build
```bash
.\gradlew build
```

### Run Tests
```bash
.\gradlew test
```

### Clean Build
```bash
.\gradlew clean build
```

## 📊 Database

MongoDB collections created automatically:
- `users` - User accounts
- `categories` - Content categories
- `connectrequests` - Connection/call requests

## 🔧 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check connection string in `application.properties`

### Port Already in Use
- Change port in `application.properties`: `server.port=8081`
- Or kill the process using port 8080

### JWT Token Invalid
- Check if token is expired (24 hours default)
- Ensure "Bearer " prefix in Authorization header

## 📝 Next Steps

1. ✅ Backend is ready!
2. Update frontend to use `http://localhost:8080/api`
3. Test authentication flow
4. Test category management
5. Deploy to production server

## 🚀 Production Deployment

1. Update `application.properties` for production
2. Change JWT secret to a strong random key
3. Use environment variables for sensitive data
4. Build production JAR: `.\gradlew build -Pprod`
5. Deploy to server: AWS, Azure, or Google Cloud

---

**Built with ❤️ for VvelUniverse**

