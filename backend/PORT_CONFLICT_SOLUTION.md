# Port 3000 Already In Use - Solutions

## Quick Fix (Option 1): Kill the Process

If you see `EADDRINUSE` error, port 3000 is already in use. Kill the process:

**Windows:**
```bash
# Find the process
netstat -ano | findstr :3000

# Kill the process (replace PID with the number from above)
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
# Find the process
lsof -ti:3000

# Kill the process
kill -9 $(lsof -ti:3000)
```

## Alternative (Option 2): Use a Different Port

### Method 1: Environment Variable

Create or update `backend/.env`:
```env
PORT=3001
```

### Method 2: Change Default Port

Edit `backend/server.js`:
```javascript
const PORT = process.env.PORT || 3001; // Changed from 3000 to 3001
```

Then update frontend API calls to use port 3001.

## After Fixing

Restart the server:
```bash
cd backend
npm run dev
```

