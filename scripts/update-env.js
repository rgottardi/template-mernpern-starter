import { readFileSync, writeFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const updateEnvFile = (path, examplePath) => {
  if (!existsSync(examplePath)) {
    console.error(`❌ Missing ${examplePath.split('/').pop()} file!`);
    return false;
  }

  const exampleContent = readFileSync(examplePath, 'utf8');
  const currentContent = existsSync(path) ? readFileSync(path, 'utf8') : '';

  // Parse both files
  const exampleVars = new Map();
  const currentVars = new Map();

  exampleContent.split('\n').forEach(line => {
    if (line.trim() && !line.startsWith('#')) {
      const [key] = line.split('=');
      exampleVars.set(key.trim(), line);
    }
  });

  currentContent.split('\n').forEach(line => {
    if (line.trim() && !line.startsWith('#')) {
      const [key] = line.split('=');
      currentVars.set(key.trim(), line);
    }
  });

  // Build updated content
  let updatedContent = '';
  let added = 0;
  let updated = 0;

  exampleContent.split('\n').forEach(line => {
    if (line.trim() && !line.startsWith('#')) {
      const [key] = line.split('=');
      const trimmedKey = key.trim();
      
      if (currentVars.has(trimmedKey)) {
        updatedContent += currentVars.get(trimmedKey) + '\n';
      } else {
        updatedContent += line + '\n';
        added++;
      }
    } else {
      updatedContent += line + '\n';
    }
  });

  // Write the updated content
  writeFileSync(path, updatedContent.trim() + '\n');

  console.log(`✓ Updated ${path.split('/').pop()}:`);
  if (added > 0) console.log(`  Added ${added} new variables`);
  if (updated > 0) console.log(`  Updated ${updated} existing variables`);

  return true;
};

const updateEnvironment = () => {
  console.log('Updating environment files...\n');

  const rootEnv = updateEnvFile(
    join(rootDir, '.env'),
    join(rootDir, '.env.example')
  );

  const clientEnv = updateEnvFile(
    join(rootDir, 'client/.env'),
    join(rootDir, 'client/.env.example')
  );

  const serverEnv = updateEnvFile(
    join(rootDir, 'server/.env'),
    join(rootDir, 'server/.env.example')
  );

  const allUpdated = rootEnv && clientEnv && serverEnv;

  console.log('\n' + (allUpdated
    ? '✨ All environment files have been updated!'
    : '⚠ Some environment files could not be updated. Please check the errors above.'));

  return allUpdated;
};

try {
  const isUpdated = updateEnvironment();
  process.exit(isUpdated ? 0 : 1);
} catch (error) {
  console.error('\n❌ Error updating environment:', error.message);
  process.exit(1);
}