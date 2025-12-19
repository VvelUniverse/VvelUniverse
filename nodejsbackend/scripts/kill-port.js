/**
 * Kill process on a specific port
 * Usage: node scripts/kill-port.js [port]
 */

const { exec } = require('child_process');
const port = process.argv[2] || '3000';

console.log(`Looking for process on port ${port}...`);

// Windows command to find process using the port
const command = `netstat -ano | findstr :${port}`;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.log(`No process found on port ${port}`);
    process.exit(0);
  }

  const lines = stdout.trim().split('\n');
  const listeningLines = lines.filter(line => line.includes('LISTENING'));

  if (listeningLines.length === 0) {
    console.log(`No process listening on port ${port}`);
    process.exit(0);
  }

  // Extract process IDs
  const pids = new Set();
  listeningLines.forEach(line => {
    const parts = line.trim().split(/\s+/);
    const pid = parts[parts.length - 1];
    if (pid && pid !== '0') {
      pids.add(pid);
    }
  });

  if (pids.size === 0) {
    console.log(`No process found on port ${port}`);
    process.exit(0);
  }

  console.log(`Found ${pids.size} process(es) on port ${port}: ${Array.from(pids).join(', ')}`);
  console.log('Killing process(es)...');

  // Kill each process
  pids.forEach(pid => {
    exec(`taskkill /F /PID ${pid}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Failed to kill process ${pid}: ${error.message}`);
      } else {
        console.log(`✓ Killed process ${pid}`);
      }
    });
  });

  setTimeout(() => {
    console.log('Done! Port should be free now.');
    process.exit(0);
  }, 1000);
});





