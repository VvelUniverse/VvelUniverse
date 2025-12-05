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
    const { name, email, mobile, password } = req.body;

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
      provider: 'local'
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
    failureRedirect: '/pages/auth/register.html?error=google_auth_failed'
  }),
  (req, res) => {
    // Successful authentication, redirect to categories
    res.redirect('/pages/categories/categories.html');
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
    failureRedirect: '/pages/auth/register.html?error=instagram_auth_failed'
  }),
  (req, res) => {
    // Successful authentication, redirect to categories
    res.redirect('/pages/categories/categories.html');
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

/**
 * POST /forgot-password
 * Request password reset link
 */
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required'
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      // Don't reveal if user exists for security
      return res.json({
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent.'
      });
    }

    // Check if user has a password (local provider)
    if (user.provider !== 'local' || !user.password) {
      return res.json({
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent.'
      });
    }

    // TODO: Generate reset token and send email
    // For now, return success message
    // In production, you should:
    // 1. Generate a secure reset token
    // 2. Store it in database with expiration
    // 3. Send email with reset link
    // 4. Create reset password endpoint

    res.json({
      success: true,
      message: 'Password reset link has been sent to your email address. Please check your inbox.'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process password reset request. Please try again.'
    });
  }
});

/**
 * POST /forgot-login-id
 * Request login ID (email) via mobile number
 */
router.post('/forgot-login-id', async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number is required'
      });
    }

    // Find user by mobile number
    const user = await User.findOne({ mobile: mobile.trim() });

    if (!user) {
      // Don't reveal if user exists for security
      return res.json({
        success: true,
        message: 'If an account exists with this mobile number, your login ID has been sent via SMS.'
      });
    }

    // TODO: Send SMS with login ID (email)
    // For now, return success message
    // In production, you should:
    // 1. Integrate with SMS service (Twilio, AWS SNS, etc.)
    // 2. Send SMS with user's email address
    // 3. Log the action for security

    res.json({
      success: true,
      message: `Your login ID has been sent to ${mobile}. Please check your SMS.`
    });
  } catch (error) {
    console.error('Forgot login ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process login ID recovery request. Please try again.'
    });
  }
});

module.exports = router;

