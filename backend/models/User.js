/**
 * User Model Schema for MongoDB
 * Stores user authentication details including OAuth providers
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema Definition
const userSchema = new mongoose.Schema({
  // Basic user information
  name: {
    type: String,
    required: function() {
      // Name is required for manual registration, optional for OAuth (can be added later)
      return this.provider === 'local';
    },
    trim: true
  },
  
  // Email - unique identifier
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: { unique: true, sparse: true } // Sparse index allows null but enforces uniqueness when present
  },
  
  // Mobile number - unique identifier
  mobile: {
    type: String,
    trim: true,
    index: { unique: true, sparse: true } // Sparse index allows null but enforces uniqueness when present
  },
  
  // Hashed password (only for manual registration)
  password: {
    type: String,
    required: function() {
      return this.provider === 'local';
    },
    minlength: 6
  },
  
  // Authentication provider: 'local', 'google', or 'instagram'
  provider: {
    type: String,
    required: true,
    enum: ['local', 'google', 'instagram'],
    default: 'local'
  },
  
  // OAuth provider-specific IDs (for Google/Instagram)
  providerId: {
    type: String,
    sparse: true
  },
  
  // Account type: 'user' or 'client' (influencer)
  accountType: {
    type: String,
    enum: ['user', 'client'],
    default: 'user'
  },
  
  // Admin access
  isAdmin: {
    type: Boolean,
    default: false,
    index: true
  },
  
  // Admin permissions
  adminPermissions: {
    type: [String],
    default: []
  },
  
  // Profile photo URL
  profilePhoto: {
    type: String,
    default: null
  },
  
  // User bio
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Hash password before saving (only for local provider)
userSchema.pre('save', async function(next) {
  // Only hash password if it's new or modified and provider is local
  if (!this.isModified('password') || this.provider !== 'local') {
    return next();
  }
  
  try {
    // Hash password with 10 rounds
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password (for login)
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) {
    return false;
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

// Compound index to prevent duplicate email or mobile for local provider
userSchema.index({ email: 1, provider: 1 });
userSchema.index({ mobile: 1, provider: 1 });

// Create User model
const User = mongoose.model('User', userSchema);

module.exports = User;

