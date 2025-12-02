/**
 * Admin Configuration
 * Admin accounts that should have access to the admin panel
 */

module.exports = {
  accounts: [
    {
      email: 'admin@vveluniverse.com',
      password: 'Admin@123',
      name: 'Vvel Super Admin',
      permissions: ['all'],
      super: true
    }
  ]
};






