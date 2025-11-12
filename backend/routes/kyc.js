/**
 * KYC Verification Routes
 * Handles influencer KYC submission and verification
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const KYC = require('../models/KYC');
const kycVerification = require('../services/kycVerification');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/kyc');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and PDF are allowed.'));
    }
  }
});

/**
 * POST /api/influencer/kyc
 * Submit KYC verification
 */
router.post('/influencer/kyc', upload.fields([
  { name: 'idFront', maxCount: 1 },
  { name: 'idBack', maxCount: 1 }
]), async (req, res) => {
  try {
    const userId = req.body.userId || req.session?.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }

    // Parse social media data
    let socialMedia;
    try {
      socialMedia = JSON.parse(req.body.socialMedia || '{}');
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid social media data format'
      });
    }

    // Validate required fields
    if (!req.body.idType || !req.body.idNumber || !req.files?.idFront) {
      return res.status(400).json({
        success: false,
        message: 'ID type, ID number, and ID front image are required'
      });
    }

    // Check if at least one social media account is provided
    if (!kycVerification.hasSocialMediaAccount(socialMedia)) {
      return res.status(400).json({
        success: false,
        message: 'At least one social media account is required'
      });
    }

    // Check if KYC already exists
    const existingKYC = await KYC.findOne({ userId });
    if (existingKYC && existingKYC.status === 'approved') {
      return res.status(409).json({
        success: false,
        message: 'KYC already approved'
      });
    }

    // Prepare KYC data
    const kycData = {
      userId,
      accountType: req.body.accountType || 'client',
      idProof: {
        idType: req.body.idType,
        idNumber: req.body.idNumber,
        idFrontUrl: `/uploads/kyc/${req.files.idFront[0].filename}`,
        idBackUrl: req.files.idBack?.[0] 
          ? `/uploads/kyc/${req.files.idBack[0].filename}` 
          : undefined
      },
      socialMedia: {
        instagram: socialMedia.instagram || {},
        youtube: socialMedia.youtube || {},
        twitter: socialMedia.twitter || {},
        facebook: socialMedia.facebook || {},
        tiktok: socialMedia.tiktok || {}
      },
      bio: req.body.bio || ''
    };

    // Create or update KYC record
    let kyc;
    if (existingKYC) {
      kyc = await KYC.findOneAndUpdate(
        { userId },
        { ...kycData, status: 'pending', updatedAt: new Date() },
        { new: true }
      );
    } else {
      kyc = new KYC(kycData);
      await kyc.save();
    }

    // Start verification process asynchronously
    verifyKYCAsync(kyc._id, kycData, req.files);

    res.status(201).json({
      success: true,
      message: 'KYC submitted successfully. Verification in progress.',
      kycId: kyc._id,
      status: kyc.status
    });

  } catch (error) {
    console.error('KYC submission error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit KYC'
    });
  }
});

/**
 * GET /api/influencer/kyc/status
 * Get KYC verification status
 */
router.get('/influencer/kyc/status', async (req, res) => {
  try {
    const userId = req.query.userId || req.session?.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }

    const kyc = await KYC.findOne({ userId });

    if (!kyc) {
      return res.status(404).json({
        success: false,
        message: 'KYC not found'
      });
    }

    res.json({
      success: true,
      kyc: {
        status: kyc.status,
        idVerificationStatus: kyc.idProof.verificationStatus,
        socialVerificationStatus: Object.keys(kyc.socialMedia).reduce((acc, platform) => {
          if (kyc.socialMedia[platform].url) {
            acc[platform] = kyc.socialMedia[platform].verificationStatus;
          }
          return acc;
        }, {}),
        rejectionReason: kyc.rejectionReason,
        submittedAt: kyc.submittedAt,
        verifiedAt: kyc.verifiedAt
      }
    });

  } catch (error) {
    console.error('KYC status error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get KYC status'
    });
  }
});

/**
 * Async function to verify KYC
 */
async function verifyKYCAsync(kycId, kycData, files) {
  try {
    const kyc = await KYC.findById(kycId);
    if (!kyc) return;

    // Update status to verifying
    kyc.status = 'verifying';
    await kyc.save();

    // Prepare verification data
    const verificationData = {
      idType: kycData.idProof.idType,
      idNumber: kycData.idProof.idNumber,
      idFrontPath: path.join(__dirname, '../../', kycData.idProof.idFrontUrl),
      socialMedia: kycData.socialMedia
    };

    // Perform verification
    const results = await kycVerification.verifyKYC(verificationData);

    // Update KYC with verification results
    kyc.idProof.verificationStatus = results.idVerification.verified ? 'approved' : 'rejected';
    kyc.idProof.verificationDetails = {
      extractedData: results.idVerification.extractedData,
      confidence: results.idVerification.confidence,
      verifiedAt: new Date(),
      verifiedBy: 'ai',
      error: results.idVerification.error
    };

    // Update social media verification results
    for (const [platform, result] of Object.entries(results.socialVerification)) {
      if (kyc.socialMedia[platform]) {
        kyc.socialMedia[platform].verificationStatus = result.verified ? 'approved' : 'rejected';
        if (result.verified) {
          kyc.socialMedia[platform].apiFollowerCount = result.apiFollowerCount || result.apiSubscriberCount;
          kyc.socialMedia[platform].variance = result.variance;
          kyc.socialMedia[platform].verifiedAt = result.verifiedAt;
        } else {
          kyc.socialMedia[platform].error = result.error;
        }
      }
    }

    // Update overall status
    kyc.status = results.overallStatus;
    kyc.rejectionReason = results.rejectionReason;
    
    if (results.overallStatus === 'approved') {
      kyc.verifiedAt = new Date();
    }

    await kyc.save();

    console.log(`KYC verification completed for ${kycId}: ${results.overallStatus}`);

  } catch (error) {
    console.error('Async KYC verification error:', error);
    
    // Update KYC with error status
    try {
      const kyc = await KYC.findById(kycId);
      if (kyc) {
        kyc.status = 'rejected';
        kyc.rejectionReason = `Verification error: ${error.message}`;
        await kyc.save();
      }
    } catch (updateError) {
      console.error('Failed to update KYC with error:', updateError);
    }
  }
}

module.exports = router;

