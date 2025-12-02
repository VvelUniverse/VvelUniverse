/**
 * Create .env file from template
 * This script helps set up the environment file
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const rootDir = path.join(__dirname, '../..');
const envPath = path.join(rootDir, '.env');
const examplePath = path.join(__dirname, '../env.example.txt');

// Generate a random session secret
const generateSessionSecret = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Check if .env already exists
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env file already exists!');
  console.log('   If you want to recreate it, delete the existing .env file first.');
  process.exit(0);
}

// Read the example file
let envContent = '';
if (fs.existsSync(examplePath)) {
  envContent = fs.readFileSync(examplePath, 'utf8');
} else {
  // Create default content
  envContent = `# MongoDB Connection
# For local MongoDB:
MONGO_URI=mongodb://localhost:27017/vvel_universe

# For MongoDB Atlas (replace username, password, and cluster):
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/vvel_universe?retryWrites=true&w=majority

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Instagram OAuth Credentials
INSTAGRAM_CLIENT_ID=your_instagram_client_id_here
INSTAGRAM_CLIENT_SECRET=your_instagram_client_secret_here

# Session Secret (auto-generated)
SESSION_SECRET=${generateSessionSecret()}

# Server Port
PORT=3000

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Node Environment
NODE_ENV=development
`;
}

// Replace placeholder session secret if it exists
envContent = envContent.replace(
  /SESSION_SECRET=your_random_session_secret_here/g,
  `SESSION_SECRET=${generateSessionSecret()}`
);

// Write .env file
try {
  fs.writeFileSync(envPath, envContent, 'utf8');
  console.log('✅ .env file created successfully!');
  console.log('');
  console.log('📝 Next steps:');
  console.log('   1. Edit .env file and set your MONGO_URI');
  console.log('      - For local MongoDB: mongodb://localhost:27017/vvel_universe');
  console.log('      - For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/vvel_universe');
  console.log('   2. (Optional) Add your OAuth credentials for Google/Instagram');
  console.log('   3. Run: node backend/scripts/setupAdmin.js');
  console.log('');
} catch (error) {
  console.error('❌ Error creating .env file:', error.message);
  console.log('');
  console.log('💡 Manual setup:');
  console.log('   1. Copy backend/env.example.txt to .env in the root directory');
  console.log('   2. Edit .env and set MONGO_URI=mongodb://localhost:27017/vvel_universe');
  console.log('   3. Generate session secret: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
  process.exit(1);
}




