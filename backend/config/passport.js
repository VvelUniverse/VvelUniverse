/**
 * Passport Configuration for OAuth Authentication
 * Configures Google and Instagram OAuth strategies
 */

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const InstagramStrategy = require('passport-instagram').Strategy;
const User = require('../models/User');

// Serialize user for session
passport.serializeUser((user, done) => {
  try {
    // Ensure we store the user ID as a string
    const userId = user._id ? user._id.toString() : (user.id ? user.id.toString() : null);
    
    if (!userId) {
      console.error('❌ Serialization error: No user ID found', user);
      return done(new Error('User ID not found'), null);
    }
    
    // Only log in development mode or when DEBUG is enabled
    if (process.env.NODE_ENV === 'development' && process.env.DEBUG_PASSPORT === 'true') {
      console.log('✓ Serializing user:', user.email || user.name || 'Unknown', 'ID:', userId);
    }
    
    // Store the user ID in the session
    done(null, userId);
  } catch (error) {
    console.error('❌ Serialization error:', error);
    done(error, null);
  }
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    if (!id) {
      // Only log in debug mode
      if (process.env.NODE_ENV === 'development' && process.env.DEBUG_PASSPORT === 'true') {
        console.log('⚠️ No user ID provided for deserialization');
      }
      return done(null, false);
    }
    
    // Handle both string and ObjectId
    const user = await User.findById(id);
    if (!user) {
      // Only log errors, not normal "not found" cases (session might be expired)
      if (process.env.NODE_ENV === 'development' && process.env.DEBUG_PASSPORT === 'true') {
        console.log('⚠️ User not found for ID:', id);
      }
      return done(null, false);
    }
    
    // Only log in debug mode - deserialization happens on every request
    if (process.env.NODE_ENV === 'development' && process.env.DEBUG_PASSPORT === 'true') {
      console.log('✓ Deserialized user:', user.email);
    }
    
    // Return the user object - this will be attached to req.user
    done(null, user);
  } catch (error) {
    console.error('❌ Deserialize error:', error);
    // On error, return false to indicate authentication failed
    done(null, false);
  }
});

// Google OAuth Strategy
// Construct callback URL dynamically based on environment
const getGoogleCallbackURL = () => {
  // In production, use the full domain from environment variable
  if (process.env.NODE_ENV === 'production') {
    const baseURL = process.env.RAILWAY_PUBLIC_DOMAIN 
      ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` 
      : (process.env.FRONTEND_URL || 'https://yourdomain.com');
    return `${baseURL}/api/auth/google/callback`;
  }
  // In development, use localhost with the port from environment
  const port = process.env.PORT || 3000;
  return `http://localhost:${port}/api/auth/google/callback`;
};

// Only configure Google OAuth if credentials are provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: getGoogleCallbackURL(),
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user exists with this Google ID or email
          let user = await User.findOne({
            $or: [
              { providerId: profile.id, provider: 'google' },
              { email: profile.emails[0].value }
            ]
          });

          if (user) {
            // Update provider ID if not set
            if (!user.providerId) {
              user.providerId = profile.id;
              user.provider = 'google';
              await user.save();
            }
            return done(null, user);
          }

          // Create new user for Google OAuth
          user = new User({
            name: profile.displayName || profile.name?.givenName + ' ' + profile.name?.familyName,
            email: profile.emails[0].value,
            provider: 'google',
            providerId: profile.id,
          });

          await user.save();
          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
  console.log('✓ Google OAuth configured');
} else {
  console.log('⚠️  Google OAuth not configured (credentials missing)');
}

// Instagram OAuth Strategy
// Construct callback URL dynamically based on environment
const getInstagramCallbackURL = () => {
  // In production, use the full domain from environment variable
  if (process.env.NODE_ENV === 'production') {
    const baseURL = process.env.RAILWAY_PUBLIC_DOMAIN 
      ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` 
      : (process.env.FRONTEND_URL || 'https://yourdomain.com');
    return `${baseURL}/api/auth/instagram/callback`;
  }
  // In development, use localhost with the port from environment
  const port = process.env.PORT || 3000;
  return `http://localhost:${port}/api/auth/instagram/callback`;
};

// Only configure Instagram OAuth if credentials are provided
if (process.env.INSTAGRAM_CLIENT_ID && process.env.INSTAGRAM_CLIENT_SECRET) {
  passport.use(
    new InstagramStrategy(
      {
        clientID: process.env.INSTAGRAM_CLIENT_ID,
        clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
        callbackURL: getInstagramCallbackURL(),
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user exists with this Instagram ID or username
          let user = await User.findOne({
            $or: [
              { providerId: profile.id, provider: 'instagram' },
              // Instagram may not always provide email, so we check by username
              { name: profile.username }
            ]
          });

          if (user) {
            // Update provider ID if not set
            if (!user.providerId) {
              user.providerId = profile.id;
              user.provider = 'instagram';
              await user.save();
            }
            return done(null, user);
          }

          // Create new user for Instagram OAuth
          // Note: Instagram Basic Display API may not provide email
          // Generate a unique email if not provided
          const instagramEmail = profile.emails?.[0]?.value || `${profile.username}_${profile.id}@instagram.local`;
          
          user = new User({
            name: profile.displayName || profile.username,
            email: instagramEmail.toLowerCase(),
            provider: 'instagram',
            providerId: profile.id,
          });

          await user.save();
          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
  console.log('✓ Instagram OAuth configured');
} else {
  console.log('⚠️  Instagram OAuth not configured (credentials missing)');
}

module.exports = passport;

