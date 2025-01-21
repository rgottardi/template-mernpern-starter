import { existsSync, copyFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const copyEnvFiles = () => {
  const envFiles = [
    { src: '.env.example', dest: '.env' },
    { src: 'client/.env.example', dest: 'client/.env' },
    { src: 'server/.env.example', dest: 'server/.env' }
  ];

  envFiles.forEach(({ src, dest }) => {
    const srcPath = join(rootDir, src);
    const destPath = join(rootDir, dest);

    if (!existsSync(srcPath)) {
      console.error(`Missing ${src} file!`);
      return;
    }

    const destDir = dirname(destPath);
    if (!existsSync(destDir)) {
      mkdirSync(destDir, { recursive: true });
    }

    if (!existsSync(destPath)) {
      copyFileSync(srcPath, destPath);
      console.log(`✓ Created ${dest} from ${src}`);
    } else {
      console.log(`⚠ ${dest} already exists, skipping...`);
    }
  });
};

try {
  console.log('Setting up environment files...');
  copyEnvFiles();
  console.log('\nEnvironment setup complete! 🚀');
} catch (error) {
  console.error('\n❌ Error setting up environment:', error.message);
  process.exit(1);
}