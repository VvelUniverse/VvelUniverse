# MongoDB Connection Fix Guide

## Problem
If you see the error: **"MongoDB Connection Error: Password contains unescaped characters"**

This happens when your MongoDB password contains special characters that need to be URL-encoded in the connection string.

## Solution

### Option 1: URL-Encode Special Characters in Password (Recommended)

If your password contains special characters, encode them in the MONGO_URI:

| Character | Encoded |
|-----------|---------|
| `@` | `%40` |
| `#` | `%23` |
| `%` | `%25` |
| `&` | `%26` |
| `/` | `%2F` |
| `:` | `%3A` |
| `?` | `%3F` |
| `=` | `%3D` |
| `+` | `%2B` |
| `$` | `%24` |
| ` ` (space) | `%20` |

**Example:**
- Original password: `MyP@ss#word123`
- Encoded password: `MyP%40ss%23word123`
- Connection string: `mongodb+srv://username:MyP%40ss%23word123@cluster.mongodb.net/vvel_universe?retryWrites=true&w=majority`

### Option 2: Use MongoDB Atlas Connection String Builder

1. Go to MongoDB Atlas Dashboard
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your actual password (MongoDB Atlas will handle encoding)

### Option 3: Change Your MongoDB Password

If you can change your password:
1. Use a password without special characters
2. Use only alphanumeric characters and basic symbols that don't need encoding

### Option 4: Use Environment Variables for Password

Update your `.env` file to separate the password:

```env
MONGO_USER=your_username
MONGO_PASS=your_password_with_special_chars
MONGO_CLUSTER=cluster.mongodb.net
MONGO_DB=vvel_universe
```

Then update `backend/config/database.js` to construct the URI:

```javascript
const mongoURI = `mongodb+srv://${encodeURIComponent(process.env.MONGO_USER)}:${encodeURIComponent(process.env.MONGO_PASS)}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
```

## Quick Fix Steps

1. **Open your `.env` file** in the `backend` folder

2. **Find your MONGO_URI** line

3. **If using MongoDB Atlas:**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/vvel_universe
   ```
   - Replace `username` with your MongoDB username
   - Replace `password` with your password (encode special characters)
   - Replace `cluster.mongodb.net` with your cluster URL

4. **If password has special characters, encode them:**
   - Example: Password `abc@123#` → `abc%40123%23`

5. **Save the `.env` file**

6. **Restart your server** (`npm run dev`)

## Common Special Characters in Passwords

If your password contains any of these, encode them:
- `@` → `%40`
- `#` → `%23`
- `%` → `%25`
- `&` → `%26`

## Testing Your Connection String

You can test if your connection string is valid by checking it in:
- MongoDB Compass
- MongoDB Atlas connection string tester
- Or just try connecting - if it works, the encoding is correct

## Still Having Issues?

1. **Double-check your `.env` file:**
   - Make sure there are no extra spaces
   - Make sure quotes are not used (unless the value itself contains spaces)
   - Example: `MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/db`

2. **Verify MongoDB Access:**
   - Check if MongoDB is running (for local)
   - Check network access in MongoDB Atlas (for cloud)
   - Verify username and password are correct

3. **Check the error message:**
   - The updated code will provide more specific error messages
   - Follow the tips shown in the console

