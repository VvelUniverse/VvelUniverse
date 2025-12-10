/**
 * Main Server File
 * Express server setup with authentication routes
 */

require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('./config/passport');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const connectRequestRoutes = require('./routes/connectRequests');
const cors = require('cors');
const path = require('path');

const imagesDir = path.join(__dirname, '../frontend/public/assets/images');
const defaultBackground = path.join(imagesDir, 'Space-bg.jpg');
const defaultFavicon = path.join(imagesDir, 'vvel-logo.png');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Serve static files (HTML, CSS, images, JS)
app.use(express.static(path.join(__dirname, '../frontend/public')));
app.use('/pages', express.static(path.join(__dirname, '../frontend/pages')));
app.use('/scripts', express.static(path.join(__dirname, '../frontend/scripts')));
app.use('/styles', express.static(path.join(__dirname, '../frontend/styles')));
app.use('/data', express.static(path.join(__dirname, '../frontend/data')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Asset aliases to avoid 404s from legacy paths/casing
app.get('/favicon.ico', (req, res) => {
  res.sendFile(defaultFavicon);
});

app.get([
  '/space-bg.png',
  '/Space-bg.png',
  '/space-bg.jpeg',
  '/Space-bg.jpeg',
  '/assets/images/space-bg.png',
  '/assets/images/Space-bg.png',
  '/assets/images/space-bg.jpeg',
  '/assets/images/Space-bg.jpeg',
  '/assets/images/space-bg.jpg'
], (req, res) => {
  res.sendFile(defaultBackground);
});

// API Routes
app.use('/api', authRoutes);
app.use('/api', profileRoutes);
app.use('/api', connectRequestRoutes);

// Root route - redirect to login page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/auth/index.html'));
});

// Common page routes (for backward compatibility and cleaner URLs)
app.get('/register', (req, res) => {
  console.log('📄 Serving register page');
  res.sendFile(path.join(__dirname, '../frontend/pages/auth/register.html'));
});

app.get('/login', (req, res) => {
  console.log('📄 Serving login page');
  res.sendFile(path.join(__dirname, '../frontend/pages/auth/index.html'));
});

app.get('/categories', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/categories/categories.html'));
});

app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/profile/profile.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/admin/admin.html'));
});

// Category routes
app.get('/business', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/categories/business/business-home.html'));
});

app.get('/cinema', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/categories/cinema/cinema-home.html'));
});

app.get('/education', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/categories/education/education-home.html'));
});

app.get('/influencers', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/categories/influencers/influencers-home.html'));
});

app.get('/law', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/categories/law/law-home.html'));
});

app.get('/medical', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/categories/medical/medical-home.html'));
});

app.get('/politics', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/categories/politics/politics-home.html'));
});

app.get('/science', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/categories/science/science-home.html'));
});

app.get('/sports', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/categories/sports/sports-home.html'));
});

app.get('/spiritual', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/spiritual/spiritual.html'));
});

// Category sub-pages routes (alerts, celebrations, community, search, wallet)
const categories = ['business', 'cinema', 'education', 'influencers', 'law', 'medical', 'politics', 'science', 'sports'];
const subPages = ['alerts', 'celebrations', 'community', 'search', 'wallet'];

categories.forEach(category => {
  subPages.forEach(page => {
    app.get(`/${category}-${page}`, (req, res) => {
      res.sendFile(path.join(__dirname, `../frontend/pages/categories/${category}/${category}-${page}.html`));
    });
  });
});

// Handle subcategory pages (e.g., /subcategories/medical-allopathy.html)
app.get(['/subcategories/:file', '/categories/:category/subcategories/:file'], (req, res, next) => {
  const fileName = req.params.file;
  const slug = fileName.replace(/\.html$/i, '');
  const [category] = slug.split('-');

  if (!categories.includes(category)) {
    return next();
  }

  const targetPath = path.join(__dirname, `../frontend/pages/categories/${category}/subcategories/${fileName}`);
  return res.sendFile(targetPath, (err) => {
    if (err) next();
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Legacy /{category}/{category}-{page}.html handler (e.g., /medical/medical-home.html)
app.get('/:category/:file', (req, res, next) => {
  const { category, file } = req.params;
  const validCategories = ['business', 'cinema', 'education', 'influencers', 'law', 'medical', 'politics', 'science', 'sports'];
  const subPages = ['home', 'alerts', 'celebrations', 'community', 'search', 'wallet'];

  if (!validCategories.includes(category)) return next();
  if (!file.endsWith('.html')) return next();

  const baseName = file.replace('.html', '');
  const expectedPrefix = `${category}-`;
  if (!baseName.startsWith(expectedPrefix)) return next();

  const page = baseName.slice(expectedPrefix.length);
  if (!subPages.includes(page)) return next();

  return res.sendFile(path.join(__dirname, `../frontend/pages/categories/${category}/${file}`));
});

// Legacy /{category}-{page}.html handler (e.g., /medical-home.html)
app.get('/:categoryPage.html', (req, res, next) => {
  const { categoryPage } = req.params;
  const parts = categoryPage.split('-');
  if (parts.length < 2) return next();
  const category = parts[0];
  const page = parts.slice(1).join('-');
  const validCategories = ['business', 'cinema', 'education', 'influencers', 'law', 'medical', 'politics', 'science', 'sports'];
  const subPages = ['home', 'alerts', 'celebrations', 'community', 'search', 'wallet'];

  if (!validCategories.includes(category)) return next();
  if (!subPages.includes(page)) return next();

  return res.sendFile(path.join(__dirname, `../frontend/pages/categories/${category}/${category}-${page}.html`));
});

// Handle legacy /pages/{category}-{page}.html paths
app.get('/pages/:categoryPage.html', (req, res) => {
  const categoryPage = req.params.categoryPage;
  
  // Parse category-page pattern (e.g., "science-celebrations")
  const parts = categoryPage.split('-');
  if (parts.length >= 2) {
    const category = parts[0];
    const page = parts.slice(1).join('-');
    
    // Check if it's a valid category
    const validCategories = ['business', 'cinema', 'education', 'influencers', 'law', 'medical', 'politics', 'science', 'sports'];
    if (validCategories.includes(category)) {
      // Redirect to clean URL
      return res.redirect(`/${categoryPage}`);
    }
  }
  
  // If not a category page, pass to next handler
  console.log(`⚠️  Unhandled route: ${req.method} ${req.url}`);
  res.status(404).send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>404 - Not Found</title>
      <style>
        body { font-family: Arial; padding: 50px; text-align: center; }
        h1 { color: #e74c3c; }
      </style>
    </head>
    <body>
      <h1>404 - Page Not Found</h1>
      <p>The page <code>${req.url}</code> does not exist.</p>
      <p><a href="/">Go to Home</a></p>
    </body>
    </html>
  `);
});

// Catch-all for debugging - log unhandled routes
app.use((req, res, next) => {
  console.log(`⚠️  Unhandled route: ${req.method} ${req.url}`);
  next();
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>404 - Not Found</title>
      <style>
        body { font-family: Arial; padding: 50px; text-align: center; }
        h1 { color: #e74c3c; }
      </style>
    </head>
    <body>
      <h1>404 - Page Not Found</h1>
      <p>The page <code>${req.url}</code> does not exist.</p>
      <p><a href="/">Go to Home</a></p>
    </body>
    </html>
  `);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

