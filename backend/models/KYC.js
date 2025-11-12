/**
 * KYC Verification Model
 * Stores influencer KYC verification data
 */

const mongoose = require('mongoose');

const kycSchema = new mongoose.Schema({
  // Reference to user
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },

  // Account type
  accountType: {
    type: String,
    enum: ['user', 'client'],
    required: true,
    default: 'client'
  },

  // Overall verification status
  status: {
    type: String,
    enum: ['pending', 'verifying', 'approved', 'rejected'],
    default: 'pending'
  },

  // ID Proof Section
  idProof: {
    idType: {
      type: String,
      enum: ['aadhaar', 'passport', 'driving', 'pan', 'voter', 'other'],
      required: true
    },
    idNumber: {
      type: String,
      required: true
    },
    idFrontUrl: {
      type: String,
      required: true
    },
    idBackUrl: {
      type: String
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    verificationDetails: {
      extractedData: {
        type: mongoose.Schema.Types.Mixed
      },
      confidence: {
        type: Number,
        min: 0,
        max: 1
      },
      verifiedAt: {
        type: Date
      },
      verifiedBy: {
        type: String,
        enum: ['ai', 'manual'],
        default: 'ai'
      },
      error: {
        type: String
      }
    }
  },

  // Social Media Verification
  socialMedia: {
    instagram: {
      url: String,
      followers: Number,
      verified: Boolean,
      verificationStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
      },
      apiFollowerCount: Number,
      variance: Number,
      verifiedAt: Date,
      error: String
    },
    youtube: {
      url: String,
      subscribers: Number,
      verified: Boolean,
      verificationStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
      },
      apiSubscriberCount: Number,
      variance: Number,
      verifiedAt: Date,
      error: String
    },
    twitter: {
      url: String,
      followers: Number,
      verified: Boolean,
      verificationStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
      },
      apiFollowerCount: Number,
      variance: Number,
      verifiedAt: Date,
      error: String
    },
    facebook: {
      url: String,
      followers: Number,
      verified: Boolean,
      verificationStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
      },
      apiFollowerCount: Number,
      variance: Number,
      verifiedAt: Date,
      error: String
    },
    tiktok: {
      url: String,
      followers: Number,
      verified: Boolean,
      verificationStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
      },
      apiFollowerCount: Number,
      variance: Number,
      verifiedAt: Date,
      error: String
    }
  },

  // Additional Information
  bio: {
    type: String,
    maxlength: 500
  },

  // Rejection reason
  rejectionReason: {
    type: String
  },

  // Timestamps
  submittedAt: {
    type: Date,
    default: Date.now
  },
  verifiedAt: {
    type: Date
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update updatedAt before saving
kycSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for faster queries
kycSchema.index({ userId: 1 });
kycSchema.index({ status: 1 });
kycSchema.index({ 'idProof.verificationStatus': 1 });

const KYC = mongoose.model('KYC', kycSchema);

module.exports = KYC;

