# Routes Reference Guide

## ✅ All Routes Working

Your server now supports both full paths and clean URLs!

## 🌐 Clean URLs (NEW)

### **Authentication Pages**
- **Login:** http://localhost:3000/ or http://localhost:3000/login
- **Register:** http://localhost:3000/register

### **Main Pages**
- **Categories:** http://localhost:3000/categories
- **Profile:** http://localhost:3000/profile
- **Admin:** http://localhost:3000/admin

### **Category Pages**
- **Business:** http://localhost:3000/business
- **Cinema:** http://localhost:3000/cinema
- **Education:** http://localhost:3000/education
- **Influencers:** http://localhost:3000/influencers
- **Law:** http://localhost:3000/law
- **Medical:** http://localhost:3000/medical
- **Politics:** http://localhost:3000/politics
- **Science:** http://localhost:3000/science
- **Sports:** http://localhost:3000/sports
- **Spiritual:** http://localhost:3000/spiritual

## 📂 Full Paths (Also Work)

### **Authentication**
- http://localhost:3000/pages/auth/index.html
- http://localhost:3000/pages/auth/register.html

### **Categories**
- http://localhost:3000/pages/categories/categories.html
- http://localhost:3000/pages/categories/business/business-home.html
- http://localhost:3000/pages/categories/cinema/cinema-home.html
- etc...

### **Profile**
- http://localhost:3000/pages/profile/profile.html

### **Admin**
- http://localhost:3000/pages/admin/admin.html

## 🔌 API Endpoints

### **Authentication**
- `POST /api/register` - Register new user
- `POST /api/login` - Login with email/password
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - Google OAuth callback
- `GET /api/auth/instagram` - Initiate Instagram OAuth
- `GET /api/auth/instagram/callback` - Instagram OAuth callback
- `GET /api/auth/status` - Check authentication status
- `GET /api/auth/logout` - Logout user
- `POST /api/forgot-password` - Request password reset
- `POST /api/forgot-login-id` - Request login ID via mobile

### **System**
- `GET /api/health` - Health check

## 📁 Static File Routes

### **Assets**
- `/assets/images/*` - Images (served from frontend/public/assets/images/)
- `/styles/*` - CSS files (served from frontend/styles/)
- `/scripts/*` - JavaScript files (served from frontend/scripts/)
- `/data/*` - JSON data files (served from frontend/data/)
- `/uploads/*` - User uploads (served from uploads/)

### **Pages**
- `/pages/*` - All HTML pages (served from frontend/pages/)

## ✨ Examples

### **Accessing Register Page (All work!)**
```
http://localhost:3000/register
http://localhost:3000/pages/auth/register.html
```

### **Accessing Business Category (All work!)**
```
http://localhost:3000/business
http://localhost:3000/pages/categories/business/business-home.html
```

### **Loading Images**
```html
<img src="/assets/images/vvel-logo.png">
<img src="/assets/images/space-bg.jpg">
```

### **Loading Scripts**
```html
<script src="/scripts/common/app-state.js"></script>
<script src="/scripts/categories/business-common.js"></script>
```

### **Loading Styles**
```html
<link rel="stylesheet" href="/styles/loading-styles.css">
```

## 🔄 OAuth Redirects

After successful OAuth authentication:
- Redirects to: `/categories`
- Which serves: `frontend/pages/categories/categories.html`

After failed OAuth:
- Redirects to: `/register?error=oauth_failed`
- Which serves: `frontend/pages/auth/register.html` with error parameter

## 🎯 Quick Test Commands

### **Test Main Pages**
```bash
# Login page
curl http://localhost:3000/

# Register page
curl http://localhost:3000/register

# Categories page
curl http://localhost:3000/categories
```

### **Test API**
```bash
# Health check
curl http://localhost:3000/api/health

# Auth status
curl http://localhost:3000/api/auth/status
```

## 📝 Notes

- All routes are case-sensitive
- Clean URLs (without .html) are recommended
- Full paths still work for backward compatibility
- Static files are served from their respective folders
- OAuth callbacks automatically redirect to categories page

---

**Your routes are now fully configured and working!** ✅

