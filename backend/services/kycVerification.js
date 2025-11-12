/**
 * Complete KYC Verification Service
 * Orchestrates ID and Social Media verification
 */

const idVerification = require('./idVerification');
const socialVerification = require('./socialVerification');
const path = require('path');

class KYCVerificationService {
  /**
   * Verify complete KYC submission
   */
  async verifyKYC(kycData) {
    const results = {
      idVerification: null,
      socialVerification: {},
      overallStatus: 'pending',
      errors: []
    };

    // 1. Verify ID Proof
    try {
      if (kycData.idFrontPath) {
        // Validate document first
        const validation = await idVerification.validateDocument(kycData.idFrontPath);
        
        if (!validation.valid) {
          results.idVerification = {
            verified: false,
            error: validation.error
          };
        } else {
          // Perform ID verification
          results.idVerification = await idVerification.verifyID(
            kycData.idType,
            kycData.idNumber,
            kycData.idFrontPath
          );
        }
      } else {
        results.idVerification = {
          verified: false,
          error: 'ID front image is required'
        };
      }
    } catch (error) {
      console.error('ID verification error:', error);
      results.idVerification = {
        verified: false,
        error: error.message
      };
      results.errors.push(`ID verification failed: ${error.message}`);
    }

    // 2. Verify Social Media Accounts
    const socialPlatforms = ['instagram', 'youtube', 'twitter', 'facebook', 'tiktok'];
    
    for (const platform of socialPlatforms) {
      const socialData = kycData.socialMedia?.[platform];
      
      if (socialData && socialData.url) {
        try {
          const userCount = socialData.followers || socialData.subscribers;
          
          if (!userCount) {
            results.socialVerification[platform] = {
              verified: false,
              error: 'Follower/subscriber count is required'
            };
            continue;
          }

          // Call appropriate verification method
          let verificationResult;
          switch (platform) {
            case 'youtube':
              verificationResult = await socialVerification.verifyYouTube(
                socialData.url,
                userCount
              );
              break;
            case 'instagram':
              verificationResult = await socialVerification.verifyInstagram(
                socialData.url,
                userCount
              );
              break;
            case 'twitter':
              verificationResult = await socialVerification.verifyTwitter(
                socialData.url,
                userCount
              );
              break;
            case 'tiktok':
              verificationResult = await socialVerification.verifyTikTok(
                socialData.url,
                userCount
              );
              break;
            case 'facebook':
              verificationResult = await socialVerification.verifyFacebook(
                socialData.url,
                userCount
              );
              break;
            default:
              verificationResult = {
                verified: false,
                error: 'Platform not supported'
              };
          }

          results.socialVerification[platform] = verificationResult;

          if (!verificationResult.verified && verificationResult.error) {
            results.errors.push(`${platform} verification failed: ${verificationResult.error}`);
          }
        } catch (error) {
          console.error(`${platform} verification error:`, error);
          results.socialVerification[platform] = {
            verified: false,
            error: error.message
          };
          results.errors.push(`${platform} verification error: ${error.message}`);
        }
      }
    }

    // 3. Determine overall status
    const idVerified = results.idVerification?.verified === true;
    const hasVerifiedSocial = Object.values(results.socialVerification).some(
      result => result.verified === true
    );

    if (idVerified && hasVerifiedSocial) {
      results.overallStatus = 'approved';
    } else if (idVerified || hasVerifiedSocial) {
      results.overallStatus = 'rejected';
      results.rejectionReason = idVerified 
        ? 'Social media verification failed'
        : 'ID verification failed';
    } else {
      results.overallStatus = 'rejected';
      results.rejectionReason = 'Both ID and social media verification failed';
    }

    return results;
  }

  /**
   * Check if at least one social media account is provided
   */
  hasSocialMediaAccount(socialMedia) {
    if (!socialMedia) return false;

    return Object.values(socialMedia).some(
      account => account && account.url && account.url.trim() !== ''
    );
  }
}

module.exports = new KYCVerificationService();

