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
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
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

// Instagram OAuth Strategy
passport.use(
  new InstagramStrategy(
    {
      clientID: process.env.INSTAGRAM_CLIENT_ID,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
      callbackURL: '/api/auth/instagram/callback',
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

module.exports = passport;

