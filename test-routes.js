// Quick test script to verify routes are working
const http = require('http');

const routes = [
  '/',
  '/register',
  '/login',
  '/categories',
  '/api/health'
];

console.log('🧪 Testing routes...\n');

routes.forEach((route) => {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: route,
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    const status = res.statusCode === 200 ? '✅' : '❌';
    console.log(`${status} ${route} - Status: ${res.statusCode}`);
  });

  req.on('error', (error) => {
    console.log(`❌ ${route} - Error: ${error.message}`);
  });

  req.end();
});

console.log('\n📝 Check server terminal for detailed logs');

