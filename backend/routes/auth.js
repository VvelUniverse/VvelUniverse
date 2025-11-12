/**
 * Authentication Routes
 * Handles registration, login, and OAuth callbacks
 */

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');

/**
 * POST /register
 * Register a new user with email and password
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, mobile, password, accountType } = req.body;

    // Validate required fields
    if (!name || !email || !mobile || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, mobile, and password'
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if user already exists (by email or mobile)
    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { mobile: mobile.trim() }
      ]
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create new user
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      mobile: mobile.trim(),
      password: password,
      provider: 'local',
      accountType: accountType || 'user'
    });

    await user.save();

    // Remove password from response
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      provider: user.provider
    };

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: userResponse
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'User already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.'
    });
  }
});

/**
 * POST /login
 * Login user with email and password
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "You're not a registered user"
      });
    }

    // Check if user has a password (local provider)
    if (user.provider !== 'local' || !user.password) {
      return res.status(400).json({
        success: false,
        message: 'This account was created with a social login. Please use that method to sign in.'
      });
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password'
      });
    }

    // Set session (for OAuth compatibility)
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Login session error'
        });
      }

      // Remove password from response
      const userResponse = {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        provider: user.provider
      };

      res.json({
        success: true,
        message: 'Login successful',
        user: userResponse
      });
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.'
    });
  }
});

/**
 * GET /auth/google
 * Initiate Google OAuth authentication
 */
router.get('/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

/**
 * GET /auth/google/callback
 * Handle Google OAuth callback
 */
router.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/register.html?error=google_auth_failed'
  }),
  (req, res) => {
    // Successful authentication, redirect to categories
    res.redirect('/categories.html');
  }
);

/**
 * GET /auth/instagram
 * Initiate Instagram OAuth authentication
 */
router.get('/auth/instagram',
  passport.authenticate('instagram', {
    scope: ['user_profile', 'user_media']
  })
);

/**
 * GET /auth/instagram/callback
 * Handle Instagram OAuth callback
 */
router.get('/auth/instagram/callback',
  passport.authenticate('instagram', {
    failureRedirect: '/register.html?error=instagram_auth_failed'
  }),
  (req, res) => {
    // Successful authentication, redirect to categories
    res.redirect('/categories.html');
  }
);

/**
 * GET /auth/logout
 * Logout user
 */
router.get('/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Logout failed'
      });
    }
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  });
});

/**
 * GET /auth/status
 * Check authentication status
 */
router.get('/auth/status', (req, res) => {
  if (req.isAuthenticated()) {
    const userResponse = {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      mobile: req.user.mobile,
      provider: req.user.provider
    };
    return res.json({
      success: true,
      authenticated: true,
      user: userResponse
    });
  }
  
  res.json({
    success: true,
    authenticated: false
  });
});

module.exports = router;

