import { readFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const checkEnvFile = (path, requiredVars) => {
  if (!existsSync(path)) {
    console.error(`❌ Missing ${path.split('/').pop()} file!`);
    return false;
  }

  const content = readFileSync(path, 'utf8');
  const variables = content
    .split('\n')
    .filter(line => line.trim() && !line.startsWith('#'))
    .map(line => line.split('=')[0].trim());

  const missing = requiredVars.filter(v => !variables.includes(v));
  const hasAllRequired = missing.length === 0;

  if (!hasAllRequired) {
    console.error(`\n❌ Missing required variables in ${path.split('/').pop()}:`);
    missing.forEach(v => console.error(`   - ${v}`));
  } else {
    console.log(`✓ ${path.split('/').pop()} has all required variables`);
  }

  return hasAllRequired;
};

const checkEnvironment = () => {
  console.log('Checking environment files...\n');
  
  const rootEnv = checkEnvFile(join(rootDir, '.env'), [
    'NODE_ENV'
  ]);

  const clientEnv = checkEnvFile(join(rootDir, 'client/.env'), [
    'VITE_API_URL'
  ]);

  const serverEnv = checkEnvFile(join(rootDir, 'server/.env'), [
    'PORT',
    'MONGODB_URI',
    'JWT_SECRET'
  ]);

  const allValid = rootEnv && clientEnv && serverEnv;

  console.log('\n' + (allValid 
    ? '✨ All environment files are properly configured!'
    : '⚠ Some environment variables are missing. Please check the errors above.'));

  return allValid;
};

try {
  const isValid = checkEnvironment();
  process.exit(isValid ? 0 : 1);
} catch (error) {
  console.error('\n❌ Error checking environment:', error.message);
  process.exit(1);
}