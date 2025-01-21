const fs = require('fs');
const path = require('path');

const requiredEnvVars = [
  '.env',
  'client/.env',
  'server/.env'
];

requiredEnvVars.forEach((envFile) => {
  const envFilePath = path.join(__dirname, '..', envFile);
  if (!fs.existsSync(envFilePath)) {
    console.error(`Missing required environment file: ${envFile}`);
    process.exit(1);
  }
});

console.log('All required environment files are present.');
