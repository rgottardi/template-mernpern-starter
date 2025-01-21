import fs from 'fs';
import path from 'path';

const checkEnv = () => {
  const envFiles = [
    { path: '.env', example: '.env.example' },
    { path: 'client/.env', example: 'client/.env.example' },
    { path: 'server/.env', example: 'server/.env.example' }
  ];

  let hasErrors = false;

  envFiles.forEach(({ path: envPath, example }) => {
    try {
      if (!fs.existsSync(example)) {
        console.error(`❌ ${example} not found`);
        hasErrors = true;
        return;
      }

      if (!fs.existsSync(envPath)) {
        console.error(`❌ ${envPath} not found`);
        hasErrors = true;
        return;
      }

      const exampleVars = new Set(
        fs.readFileSync(example, 'utf8')
          .split('\n')
          .filter(line => line.trim() && !line.startsWith('#'))
          .map(line => line.split('=')[0])
      );

      const envVars = new Set(
        fs.readFileSync(envPath, 'utf8')
          .split('\n')
          .filter(line => line.trim() && !line.startsWith('#'))
          .map(line => line.split('=')[0])
      );

      console.log(`\nChecking ${envPath}...`);
      
      // Check for missing variables
      exampleVars.forEach(variable => {
        if (!envVars.has(variable)) {
          console.log(`⚠️  Missing variable: ${variable}`);
          hasErrors = true;
        }
      });

      // Check for extra variables
      envVars.forEach(variable => {
        if (!exampleVars.has(variable)) {
          console.log(`ℹ️  Extra variable found: ${variable}`);
        }
      });

      if (!hasErrors) {
        console.log('✅ All required variables are present');
      }
    } catch (error) {
      console.error(`Error checking ${envPath}:`, error.message);
      hasErrors = true;
    }
  });

  if (hasErrors) {
    process.exit(1);
  }
};

checkEnv();