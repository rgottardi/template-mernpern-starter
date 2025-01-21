import { existsSync, copyFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Define environment file pairs (source -> destination)
const envFiles = [
  {
    example: join(rootDir, '.env.example'),
    target: join(rootDir, '.env')
  },
  {
    example: join(rootDir, 'client', '.env.example'),
    target: join(rootDir, 'client', '.env')
  },
  {
    example: join(rootDir, 'server', '.env.example'),
    target: join(rootDir, 'server', '.env')
  }
];

// Create scripts directory if it doesn't exist
if (!existsSync(join(rootDir, 'scripts'))) {
  mkdirSync(join(rootDir, 'scripts'), { recursive: true });
}

// Copy each example file to its target if it doesn't exist
envFiles.forEach(({ example, target }) => {
  try {
    if (!existsSync(target) && existsSync(example)) {
      copyFileSync(example, target);
      console.log(`✅ Created ${target} from example file`);
    } else if (!existsSync(example)) {
      console.warn(`⚠️  Warning: Example file ${example} not found`);
    } else {
      console.log(`ℹ️  ${target} already exists, skipping`);
    }
  } catch (error) {
    console.error(`❌ Error creating ${target}:`, error.message);
  }
});

console.log('🎉 Environment setup complete!');