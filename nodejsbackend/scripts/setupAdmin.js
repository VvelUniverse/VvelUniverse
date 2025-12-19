/**
 * Setup Admin User Script
 * This script ensures the admin user from admin-config.js has admin permissions
 * Run this script once after setting up the database
 * 
 * Usage: node backend/scripts/setupAdmin.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const adminConfig = require('../config/admin');
const connectDB = require('../config/database');

async function setupAdmin() {
  try {
    // Connect to database
    await connectDB();
    console.log('✓ Connected to database');

    // Process each admin account from config
    for (const adminAccount of adminConfig.accounts) {
      const email = adminAccount.email.toLowerCase().trim();
      
      // Find or create admin user
      let user = await User.findOne({ email });

      if (!user) {
        // Create new admin user
        console.log(`Creating new admin user: ${email}`);
        user = new User({
          name: adminAccount.name || email.split('@')[0],
          email: email,
          password: adminAccount.password,
          provider: 'local',
          accountType: 'user',
          isAdmin: true,
          adminPermissions: adminAccount.permissions || ['all']
        });
        await user.save();
        console.log(`✓ Created admin user: ${email}`);
      } else {
        // Update existing user to be admin
        let updated = false;
        
        if (!user.isAdmin) {
          user.isAdmin = true;
          updated = true;
        }
        
        if (!user.adminPermissions || user.adminPermissions.length === 0) {
          user.adminPermissions = adminAccount.permissions || ['all'];
          updated = true;
        }
        
        // Update password if provided and different
        if (adminAccount.password) {
          const isPasswordValid = await user.comparePassword(adminAccount.password);
          if (!isPasswordValid) {
            user.password = adminAccount.password; // Will be hashed by pre-save hook
            updated = true;
          }
        }
        
        if (updated) {
          await user.save();
          console.log(`✓ Updated admin user: ${email}`);
        } else {
          console.log(`✓ Admin user already configured: ${email}`);
        }
      }
    }

    console.log('\n✅ Admin setup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up admin:', error);
    process.exit(1);
  }
}

// Run the script
setupAdmin();





