/**
 * MongoDB Database Connection Configuration
 * Uses environment variable for connection string
 */

const mongoose = require('mongoose');

/**
 * URL-encode special characters in MongoDB connection string
 * Handles passwords with special characters like @, #, %, &, etc.
 */
const encodeMongoURI = (uri) => {
  try {
    // Check if URI contains credentials (username:password@)
    // Pattern: mongodb:// or mongodb+srv:// followed by username:password@
    const urlPattern = /^(mongodb(\+srv)?:\/\/)([^:]+):([^@]+)@(.+)$/;
    const match = uri.match(urlPattern);
    
    if (match) {
      const protocol = match[1]; // mongodb:// or mongodb+srv://
      const username = match[3];
      let password = match[4];
      const rest = match[5];
      
      // Check if password is already URL-encoded (contains %XX pattern)
      // If not encoded, encode it to handle special characters
      const isAlreadyEncoded = /%[0-9A-Fa-f]{2}/.test(password);
      
      if (!isAlreadyEncoded) {
        // Password is not encoded, encode it to handle special characters
        password = encodeURIComponent(password);
      }
      // If already encoded, use as is (to avoid double-encoding)
      
      // Construct the properly encoded connection string
      return `${protocol}${username}:${password}@${rest}`;
    }
    
    // If it doesn't match the pattern (local MongoDB without auth, or already encoded), return as is
    return uri;
  } catch (error) {
    // If encoding fails, return original URI
    console.warn('Warning: Could not encode MongoDB URI, using original:', error.message);
    return uri;
  }
};

/**
 * Connect to MongoDB database
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    // Validate MONGO_URI is set
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables. Please check your .env file.');
    }

    // Encode password if connection string contains special characters
    const mongoURI = encodeMongoURI(process.env.MONGO_URI);

    const conn = await mongoose.connect(mongoURI, {
      // Use new URL parser and unified topology (default in newer versions)
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    
    // Provide helpful error messages
    if (error.message.includes('password') || error.message.includes('unescaped')) {
      console.error('\n💡 Tip: If your MongoDB password contains special characters (@, #, %, &, etc.),');
      console.error('   make sure they are URL-encoded in your MONGO_URI.');
      console.error('   Example: If password is "p@ss#word", use "p%40ss%23word"');
      console.error('   Or use the connection string builder from MongoDB Atlas.');
    } else if (error.message.includes('authentication')) {
      console.error('\n💡 Tip: Check your MongoDB username and password in the MONGO_URI.');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
      console.error('\n💡 Tip: Check if MongoDB is running or if the connection string is correct.');
    }
    
    // Exit process if database connection fails
    process.exit(1);
  }
};

module.exports = connectDB;

