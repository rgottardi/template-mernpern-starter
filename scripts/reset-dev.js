import { execSync } from 'child_process';
import fs from 'fs';

const reset = () => {
  try {
    console.log('🧹 Cleaning up development environment...');
    
    console.log('\n1. Removing node_modules...');
    execSync('npm run clean:all');

    console.log('\n2. Cleaning Docker environment...');
    execSync('npm run docker:clean');

    console.log('\n3. Reinstalling dependencies...');
    execSync('npm run install:all');

    console.log('\n4. Resetting environment files...');
    execSync('npm run env:setup');

    console.log('\n✨ Development environment reset complete!');
    console.log('\nNext steps:');
    console.log('1. Start the development environment: npm run dev');
    console.log('2. Start Docker services: npm run docker:up');
  } catch (error) {
    console.error('\n❌ Error during reset:', error.message);
    process.exit(1);
  }
};

reset();