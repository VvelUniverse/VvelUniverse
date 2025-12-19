/**
 * Profile Routes
 * Handles user profile data, updates, and photo uploads
 */

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const ConnectRequest = require('../models/ConnectRequest');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '..', '..', 'uploads', 'profiles');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename: userId-timestamp.extension
    const userId = req.user._id.toString();
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `${userId}-${timestamp}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Middleware to check authentication
const requireAuth = (req, res, next) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
  next();
};

/**
 * GET /api/profile
 * Get current user's profile data
 */
router.get('/profile', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        accountType: user.accountType,
        profilePhoto: user.profilePhoto,
        bio: user.bio || '',
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
});

/**
 * PUT /api/profile
 * Update user profile
 */
router.put('/profile', requireAuth, async (req, res) => {
  try {
    const { name, mobile, bio } = req.body;
    const userId = req.user._id;

    const updateData = {};
    
    if (name !== undefined) {
      updateData.name = name.trim();
    }
    
    if (mobile !== undefined) {
      // Check if mobile is already taken by another user
      if (mobile && mobile.trim()) {
        const existingUser = await User.findOne({
          mobile: mobile.trim(),
          _id: { $ne: userId }
        });
        
        if (existingUser) {
          return res.status(409).json({
            success: false,
            message: 'Mobile number already in use'
          });
        }
        updateData.mobile = mobile.trim();
      } else {
        updateData.mobile = null;
      }
    }
    
    if (bio !== undefined) {
      if (bio.length > 500) {
        return res.status(400).json({
          success: false,
          message: 'Bio must be 500 characters or less'
        });
      }
      updateData.bio = bio.trim();
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        accountType: user.accountType,
        profilePhoto: user.profilePhoto,
        bio: user.bio || '',
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

/**
 * POST /api/profile/photo
 * Upload profile photo
 */
router.post('/profile/photo', requireAuth, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const userId = req.user._id;
    
    // Generate URL for the uploaded file
    // In production, you might want to use a CDN or cloud storage
    const photoUrl = `/uploads/profiles/${req.file.filename}`;

    // Delete old photo if exists
    const user = await User.findById(userId);
    if (user && user.profilePhoto) {
      const oldPhotoPath = path.join(__dirname, '..', '..', user.profilePhoto);
      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath);
      }
    }

    // Update user profile photo
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { profilePhoto: photoUrl } },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile photo uploaded successfully',
      data: {
        profilePhoto: updatedUser.profilePhoto
      }
    });
  } catch (error) {
    console.error('Photo upload error:', error);
    
    // Delete uploaded file if there was an error
    if (req.file) {
      const filePath = path.join(__dirname, '..', '..', 'uploads', 'profiles', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to upload profile photo'
    });
  }
});

/**
 * GET /api/profile/stats
 * Get user statistics (connections, followers, requests, posts)
 */
router.get('/profile/stats', requireAuth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get connection requests count (requests sent by user)
    const requestsCount = await ConnectRequest.countDocuments({
      requesterId: userId
    });

    // Get approved connections count
    const connectionsCount = await ConnectRequest.countDocuments({
      requesterId: userId,
      status: 'approved'
    });

    // For now, followers and posts are placeholder values
    // You can implement these based on your business logic
    const followersCount = 0; // TODO: Implement followers system
    const postsCount = 0; // TODO: Implement posts system

    res.json({
      success: true,
      data: {
        connections: connectionsCount,
        followers: followersCount,
        requests: requestsCount,
        posts: postsCount
      }
    });
  } catch (error) {
    console.error('Get profile stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile statistics'
    });
  }
});

module.exports = router;


