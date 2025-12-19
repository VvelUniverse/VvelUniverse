/**
 * Connect Request Model
 * Stores connection requests between users and influencers
 */

const mongoose = require('mongoose');

const connectRequestSchema = new mongoose.Schema({
  // Request details
  requesterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  requesterName: {
    type: String,
    required: true
  },
  requesterEmail: {
    type: String,
    required: true
  },
  
  // Influencer/Client details
  influencerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Can be null if influencer is not a registered user
    index: true,
    sparse: true
  },
  influencerName: {
    type: String,
    required: true
  },
  influencerEmail: {
    type: String,
    required: true
  },
  
  // Session details
  sessionTitle: {
    type: String,
    default: 'Connection Session'
  },
  sessionType: {
    type: String,
    enum: ['video', 'audio'],
    default: 'video'
  },
  durationMinutes: {
    type: Number,
    default: 30,
    min: 5,
    max: 120
  },
  scheduledTime: {
    type: Date
  },
  
  // Payment details
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  
  // Status and workflow
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
    default: 'pending',
    index: true
  },
  
  // Admin actions
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  rejectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rejectedAt: {
    type: Date
  },
  rejectionReason: {
    type: String
  },
  
  // Payment tracking
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String
  },
  paymentDate: {
    type: Date
  },
  
  // Meeting details (generated after approval)
  meetingCode: {
    type: String
  },
  meetingUrl: {
    type: String
  },
  
  // Additional information
  message: {
    type: String,
    maxlength: 500
  },
  notes: {
    type: String,
    maxlength: 1000
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
connectRequestSchema.index({ requesterId: 1, status: 1 });
connectRequestSchema.index({ influencerId: 1, status: 1 });
connectRequestSchema.index({ status: 1, createdAt: -1 });

// Update updatedAt before saving
connectRequestSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('ConnectRequest', connectRequestSchema);



