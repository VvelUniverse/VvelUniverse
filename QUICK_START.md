# ⚡ QUICK START GUIDE

## 🎉 Your Java Spring Boot 3 Backend is Ready!

Everything is set up and ready to run. Just follow these simple steps:

---

## ✅ Step 1: Verify Prerequisites

### Check Java (REQUIRED)
```bash
java -version
```
**You need Java 17 or higher.**
- ❌ If not installed: Download from https://adoptium.net/

### Check MongoDB (REQUIRED)
```bash
mongo --version
# or
mongod --version
```
**MongoDB must be running on `localhost:27017`**
- ❌ If not installed: Download from https://www.mongodb.com/try/download/community
- Start MongoDB: `mongod` or `net start MongoDB` (Windows Service)

---

## 🚀 Step 2: Start the Backend

### **Option A: Simple Start (Recommended)**
```bash
cd vveluniverse
start-java-backend.bat
```

### **Option B: Choose Backend**
```bash
cd vveluniverse
start.bat
# Then select [1] for Java backend
```

### **Option C: Manual Start**
```bash
cd vveluniverse/backend
gradlew bootRun
```

---

## 🧪 Step 3: Test the Backend

### Browser Test
Open: http://localhost:8080/api/auth/status

You should see:
```json
{
  "success": true,
  "message": "Authentication endpoint is working"
}
```

### Interactive Test Page
Open: `vveluniverse/test-java-backend.html` in your browser

This gives you a beautiful UI to test all APIs!

---

## 👤 Step 4: Create Admin Account

### Using the Test Page
1. Open `test-java-backend.html`
2. Fill in the **Register User** form:
   - Name: `Admin User`
   - Email: `admin@vveluniverse.com`
   - Mobile: `9876543210`
   - Password: `Admin@123`
3. Click **Register**

### Using cURL
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Admin User\",\"email\":\"admin@vveluniverse.com\",\"mobile\":\"9876543210\",\"password\":\"Admin@123\"}"
```

---

## 🔐 Step 5: Login and Get JWT Token

### Using the Test Page
1. Fill in the **Login** form
2. Click **Login**
3. The JWT token is automatically saved!

### Using cURL
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@vveluniverse.com\",\"password\":\"Admin@123\"}"
```

**Save the token from the response!**

---

## 👑 Step 6: Make User an Admin

The registered user is NOT admin by default. Make them admin:

### Method 1: MongoDB Shell
```bash
mongosh vvel_universe
db.users.updateOne(
  { email: "admin@vveluniverse.com" },
  { $set: { isAdmin: true, adminPermissions: ["all"] } }
)
```

### Method 2: MongoDB Compass
1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. Go to `vvel_universe` → `users` collection
4. Find your user
5. Edit: Set `isAdmin: true` and `adminPermissions: ["all"]`

---

## 📁 Step 7: Test Category Management

### Using the Test Page
1. Make sure you're logged in (Step 5)
2. Fill in the **Create Category** form:
   - Name: `Sports`
   - Icon: `⚽`
   - Description: `Sports and athletics`
3. Click **Create Category**
4. Click **Get All Categories** to see your new category!

### Using cURL
```bash
# Create Category
curl -X POST http://localhost:8080/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d "{\"name\":\"Sports\",\"icon\":\"⚽\",\"description\":\"Sports content\",\"color\":\"#6366f1\"}"

# Get All Categories
curl http://localhost:8080/api/categories
```

---

## 🎨 Step 8: Connect Frontend to Java Backend

### Update Admin Dashboard

Edit `frontend/pages/admin/admin.html` and add this script tag:
```html
<script src="../scripts/api/java-backend-api.js"></script>
```

Then update your category form submission:
```javascript
async function handleAddCategory(event) {
    event.preventDefault();
    
    const categoryData = {
        name: document.getElementById('categoryName').value,
        icon: document.getElementById('categoryIcon').value || '📁',
        description: document.getElementById('categoryDescription').value,
        color: '#6366f1',
        order: 0
    };
    
    try {
        const response = await javaAPI.createCategory(categoryData);
        if (response.success) {
            alert('Category created successfully!');
            loadCategories();
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

async function loadCategories() {
    try {
        const response = await javaAPI.getAllCategories();
        if (response.success) {
            // Display categories
            console.log(response.data);
        }
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}
```

---

## 📡 API Endpoints Reference

Base URL: `http://localhost:8080/api`

### Public Endpoints (No Authentication)
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get JWT
- `GET /auth/status` - Check API status
- `GET /categories` - Get all active categories
- `GET /categories/{id}` - Get category by ID

### Admin Endpoints (Requires JWT + Admin Role)
- `POST /categories` - Create category
- `PUT /categories/{id}` - Update category
- `DELETE /categories/{id}` - Delete category
- `PUT /categories/{id}/toggle` - Toggle category status

---

## 🗂️ Project Structure

```
vveluniverse/
├── backend/                          # NEW Java Spring Boot 3
│   ├── src/main/java/com/vveluniverse/
│   │   ├── VvelUniverseApplication.java
│   │   ├── config/                   # Security, CORS, JWT
│   │   ├── model/                    # MongoDB entities
│   │   ├── repository/               # Data access
│   │   ├── service/                  # Business logic
│   │   ├── controller/               # REST APIs
│   │   ├── dto/                      # Request/Response objects
│   │   ├── security/                 # JWT implementation
│   │   └── exception/                # Error handling
│   ├── build.gradle
│   ├── gradlew.bat
│   └── README.md
│
├── nodejsbackend/                    # OLD Node.js backend
├── frontend/                         # Your frontend
│   └── scripts/api/
│       └── java-backend-api.js      # NEW API client
│
├── start-java-backend.bat           # Start Java backend
├── start.bat                        # Backend selector
├── test-java-backend.html           # API tester
├── SETUP_GUIDE.md                   # Full setup guide
└── QUICK_START.md                   # This file
```

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check Java
java -version

# Check MongoDB
mongod

# Check port 8080
netstat -ano | findstr :8080
```

### "Authentication required" error
1. Make sure you're logged in
2. Check JWT token is saved: `localStorage.getItem('jwt_token')`
3. Make sure user is admin (Step 6)

### "Failed to fetch" error
- Backend is not running on port 8080
- CORS issue (check `application.properties`)
- MongoDB is not running

### Categories not showing
1. Login first
2. Make user admin (Step 6)
3. Create categories using the test page
4. Check MongoDB: `db.categories.find()`

---

## 🎯 What's Next?

1. ✅ **Backend is running!**
2. ✅ **APIs are working!**
3. ⏳ Update frontend admin dashboard
4. ⏳ Build mobile apps (Android/iOS)
5. ⏳ Add video call functionality
6. ⏳ Deploy to production

---

## 📚 Additional Resources

- **Full Setup Guide**: `SETUP_GUIDE.md`
- **Backend README**: `backend/README.md`
- **API Client**: `frontend/scripts/api/java-backend-api.js`
- **Test Page**: `test-java-backend.html`

---

## 💡 Pro Tips

1. **Keep MongoDB running** - Backend needs it!
2. **Save your JWT token** - You'll need it for admin operations
3. **Use the test page** - It's the easiest way to test APIs
4. **Check browser console** - For API errors and responses
5. **Use MongoDB Compass** - To view/edit database directly

---

## ✅ Success Checklist

- [ ] Java 17+ installed
- [ ] MongoDB running
- [ ] Backend started successfully
- [ ] Can access http://localhost:8080/api/auth/status
- [ ] Admin user registered
- [ ] Admin user logged in (JWT token saved)
- [ ] User marked as admin in MongoDB
- [ ] Category created successfully
- [ ] Categories retrieved successfully

---

## 🎉 You're All Set!

Your Java Spring Boot 3 backend is ready for mobile app development!

**Next**: Open `test-java-backend.html` and start testing! 🚀

For detailed documentation, see `SETUP_GUIDE.md` and `backend/README.md`

