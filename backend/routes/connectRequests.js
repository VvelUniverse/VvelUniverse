/**
 * Connect Requests Routes
 * Handles connection request management for admins and users
 */

const express = require('express');
const router = express.Router();
const ConnectRequest = require('../models/ConnectRequest');
const User = require('../models/User');

/**
 * Middleware to check if user is authenticated
 */
const requireAuth = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
  next();
};

/**
 * Middleware to check if user is admin
 */
const isAdmin = async (req, res, next) => {
  try {
    // First check if user is authenticated
    if (!req.isAuthenticated() || !req.user) {
      // Only log in debug mode
      if (process.env.DEBUG_AUTH === 'true') {
        console.log('Admin check failed: User not authenticated');
      }
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Check if user is admin
    // Use req.user._id or req.user.id depending on what's available
    const userId = req.user._id || req.user.id;
    if (!userId) {
      if (process.env.DEBUG_AUTH === 'true') {
        console.log('Admin check failed: No user ID found');
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid user session'
      });
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      if (process.env.DEBUG_AUTH === 'true') {
        console.log('Admin check failed: User not found in database');
      }
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check admin status - multiple ways to be admin
    const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',').map(e => e.toLowerCase().trim()) : [];
    const emailLower = user.email.toLowerCase();
    
    // Check if user is admin via:
    // 1. isAdmin flag in database
    // 2. Email in ADMIN_EMAILS env variable
    // 3. Email contains 'admin@'
    // 4. Email matches admin-config.js (if accessible)
    let isAdminUser = user.isAdmin === true || 
                      adminEmails.includes(emailLower) || 
                      emailLower.includes('admin@');
    
    // Also check backend admin config if available
    if (!isAdminUser) {
      try {
        const adminConfig = require('../config/admin.js');
        if (adminConfig && adminConfig.accounts) {
          const adminAccount = adminConfig.accounts.find(
            acc => acc.email.toLowerCase() === emailLower
          );
          if (adminAccount) {
            // Update user to be admin if not already
            if (!user.isAdmin) {
              user.isAdmin = true;
              user.adminPermissions = adminAccount.permissions || ['all'];
              await user.save();
            }
            isAdminUser = true;
          }
        }
      } catch (e) {
        // Admin config not accessible, that's okay
      }
    }
    
    if (!isAdminUser) {
      if (process.env.DEBUG_AUTH === 'true') {
        console.log(`Admin check failed: User ${user.email} is not an admin`);
      }
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    req.adminUser = user;
    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({
      success: false,
      message: 'Authorization check failed'
    });
  }
};

/**
 * GET /api/admin/connect-requests
 * Get all connect requests (with filters)
 */
router.get('/admin/connect-requests', isAdmin, async (req, res) => {
  try {
    const { status, influencerId, requesterId, page = 1, limit = 50 } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (influencerId) query.influencerId = influencerId;
    if (requesterId) query.requesterId = requesterId;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const requests = await ConnectRequest.find(query)
      .populate('requesterId', 'name email')
      .populate('influencerId', 'name email')
      .populate('approvedBy', 'name email')
      .populate('rejectedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ConnectRequest.countDocuments(query);

    res.json({
      success: true,
      requests,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get connect requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch connect requests'
    });
  }
});

/**
 * GET /api/admin/connect-requests/:id
 * Get a specific connect request
 */
router.get('/admin/connect-requests/:id', isAdmin, async (req, res) => {
  try {
    const request = await ConnectRequest.findById(req.params.id)
      .populate('requesterId', 'name email mobile')
      .populate('influencerId', 'name email mobile')
      .populate('approvedBy', 'name email')
      .populate('rejectedBy', 'name email');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Connect request not found'
      });
    }

    res.json({
      success: true,
      request
    });
  } catch (error) {
    console.error('Get connect request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch connect request'
    });
  }
});

/**
 * POST /api/admin/connect-requests/:id/approve
 * Approve a connect request
 */
router.post('/admin/connect-requests/:id/approve', isAdmin, async (req, res) => {
  try {
    const request = await ConnectRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Connect request not found'
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Request is already ${request.status}`
      });
    }

    // Generate meeting code
    const meetingCode = `VVEL-${Date.now().toString(36).toUpperCase().slice(-6)}`;
    const meetingUrl = `/video-call.html?callId=${request._id}&name=${encodeURIComponent(request.influencerName)}&type=${request.sessionType}`;

    // Update request
    request.status = 'approved';
    request.approvedBy = req.adminUser._id;
    request.approvedAt = new Date();
    request.meetingCode = meetingCode;
    request.meetingUrl = meetingUrl;
    
    // Check if payment is needed
    if (request.paymentStatus !== 'paid') {
      request.paymentStatus = 'pending';
    }

    await request.save();

    // Populate for response
    await request.populate('requesterId', 'name email');
    if (request.influencerId) {
      await request.populate('influencerId', 'name email');
    }

    res.json({
      success: true,
      message: 'Connect request approved successfully. User has been notified.',
      request: {
        ...request.toObject(),
        meetingCode,
        meetingUrl
      }
    });
  } catch (error) {
    console.error('Approve connect request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve connect request'
    });
  }
});

/**
 * POST /api/admin/connect-requests/:id/reject
 * Reject a connect request
 */
router.post('/admin/connect-requests/:id/reject', isAdmin, async (req, res) => {
  try {
    const { reason } = req.body;
    const request = await ConnectRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Connect request not found'
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Request is already ${request.status}`
      });
    }

    request.status = 'rejected';
    request.rejectedBy = req.adminUser._id;
    request.rejectedAt = new Date();
    request.rejectionReason = reason || 'Request rejected by admin';

    await request.save();

    res.json({
      success: true,
      message: 'Connect request rejected',
      request
    });
  } catch (error) {
    console.error('Reject connect request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject connect request'
    });
  }
});

/**
 * POST /api/admin/connect-requests/:id/payment
 * Mark payment as received for a connect request
 */
router.post('/admin/connect-requests/:id/payment', isAdmin, async (req, res) => {
  try {
    const { paymentMethod = 'Manual confirmation' } = req.body;
    const request = await ConnectRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Connect request not found'
      });
    }

    if (request.paymentStatus === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Payment already recorded'
      });
    }

    request.paymentStatus = 'paid';
    request.paymentMethod = paymentMethod;
    request.paymentDate = new Date();

    // If approved but payment was pending, ensure it's still approved
    if (request.status === 'approved' && request.paymentStatus === 'paid') {
      // Generate meeting details if not already generated
      if (!request.meetingCode) {
        const meetingCode = `VVEL-${Date.now().toString(36).toUpperCase().slice(-6)}`;
        const meetingUrl = `/video-call.html?callId=${request._id}&name=${encodeURIComponent(request.influencerName)}&type=${request.sessionType}`;
        request.meetingCode = meetingCode;
        request.meetingUrl = meetingUrl;
      }
    }

    await request.save();

    res.json({
      success: true,
      message: 'Payment recorded',
      request
    });
  } catch (error) {
    console.error('Record payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record payment'
    });
  }
});

/**
 * GET /api/admin/stats
 * Get admin dashboard statistics
 */
router.get('/admin/stats', isAdmin, async (req, res) => {
  try {
    const [
      totalRequests,
      pendingRequests,
      approvedRequests,
      rejectedRequests,
      needsPayment
    ] = await Promise.all([
      ConnectRequest.countDocuments(),
      ConnectRequest.countDocuments({ status: 'pending' }),
      ConnectRequest.countDocuments({ status: 'approved' }),
      ConnectRequest.countDocuments({ status: 'rejected' }),
      ConnectRequest.countDocuments({ 
        status: 'approved', 
        paymentStatus: 'pending' 
      })
    ]);

    res.json({
      success: true,
      stats: {
        totalRequests,
        pendingRequests,
        approvedRequests,
        rejectedRequests,
        needsPayment,
        completedRequests: await ConnectRequest.countDocuments({ status: 'completed' })
      }
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
});

/**
 * POST /api/connect-requests
 * Create a new connect request (for users)
 */
router.post('/connect-requests', requireAuth, async (req, res) => {
  try {
    const {
      influencerId,
      sessionTitle,
      sessionType,
      durationMinutes,
      scheduledTime,
      amount,
      message
    } = req.body;

    const requesterId = req.user._id;

    // If influencerId is not provided, try to find by name or create a placeholder
    let influencer = null;
    let influencerName = 'Community Host';
    let influencerEmail = 'host@community.com';
    let finalInfluencerId = influencerId || null;

    if (influencerId) {
      influencer = await User.findById(influencerId);
      if (!influencer) {
        return res.status(404).json({
          success: false,
          message: 'Influencer not found'
        });
      }

      if (influencer.accountType !== 'client') {
        return res.status(400).json({
          success: false,
          message: 'User is not a client/influencer'
        });
      }

      influencerName = influencer.name;
      influencerEmail = influencer.email;
      finalInfluencerId = influencer._id;
    } else {
      // If no influencerId, use the hostName from session if provided
      const { hostName, hostEmail } = req.body;
      if (hostName) {
        influencerName = hostName;
      }
      if (hostEmail) {
        influencerEmail = hostEmail;
        // Try to find user by email
        const foundUser = await User.findOne({ email: hostEmail.toLowerCase() });
        if (foundUser && foundUser.accountType === 'client') {
          influencer = foundUser;
          finalInfluencerId = foundUser._id;
        }
      }
    }

    // Create connect request
    const connectRequest = new ConnectRequest({
      requesterId,
      requesterName: req.user.name,
      requesterEmail: req.user.email,
      influencerId: finalInfluencerId,
      influencerName: influencerName,
      influencerEmail: influencerEmail,
      sessionTitle: sessionTitle || 'Connection Session',
      sessionType: sessionType || 'video',
      durationMinutes: durationMinutes || 30,
      scheduledTime: scheduledTime ? new Date(scheduledTime) : undefined,
      amount: amount || 0,
      message: message || '',
      status: 'pending',
      paymentStatus: 'pending'
    });

    await connectRequest.save();

    // Populate for response (if influencerId exists)
    await connectRequest.populate('requesterId', 'name email');
    if (connectRequest.influencerId) {
      await connectRequest.populate('influencerId', 'name email');
    }

    res.status(201).json({
      success: true,
      message: 'Connect request created successfully',
      request: connectRequest
    });
  } catch (error) {
    console.error('Create connect request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create connect request'
    });
  }
});

/**
 * GET /api/connect-requests/my-requests
 * Get connect requests for the authenticated user
 */
router.get('/connect-requests/my-requests', requireAuth, async (req, res) => {
  try {
    const { status } = req.query;
    const query = {
      $or: [
        { requesterId: req.user._id },
        { influencerId: req.user._id }
      ]
    };
    
    if (status) {
      query.status = status;
    }

    const requests = await ConnectRequest.find(query)
      .populate('requesterId', 'name email')
      .populate('influencerId', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      requests
    });
  } catch (error) {
    console.error('Get my requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch requests'
    });
  }
});

/**
 * POST /api/admin/grant-admin
 * Grant admin access to a user (admin only)
 */
router.post('/admin/grant-admin', isAdmin, async (req, res) => {
  try {
    const { email, name, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find or create user
    let user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      // Create new user with admin access
      user = new User({
        name: name || email.split('@')[0],
        email: email.toLowerCase().trim(),
        password: password,
        provider: 'local',
        accountType: 'user',
        isAdmin: true,
        adminPermissions: ['requests:read', 'requests:write']
      });
    } else {
      // Update existing user to admin
      user.isAdmin = true;
      if (name) user.name = name;
      if (password) {
        user.password = password; // Will be hashed by pre-save hook
      }
      if (!user.adminPermissions || user.adminPermissions.length === 0) {
        user.adminPermissions = ['requests:read', 'requests:write'];
      }
    }

    await user.save();

    // Remove password from response
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      adminPermissions: user.adminPermissions
    };

    res.json({
      success: true,
      message: 'Admin access granted successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Grant admin access error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to grant admin access'
    });
  }
});

/**
 * GET /api/admin/admins
 * Get list of all admin users
 */
router.get('/admin/admins', isAdmin, async (req, res) => {
  try {
    const admins = await User.find({ isAdmin: true })
      .select('name email adminPermissions createdAt')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      admins
    });
  } catch (error) {
    console.error('Get admins error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin list'
    });
  }
});

module.exports = router;

