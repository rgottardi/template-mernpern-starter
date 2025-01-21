import { execSync } from 'child_process';

const cleanup = () => {
  try {
    console.log('Stopping containers...');
    execSync('docker compose down');

    console.log('\nRemoving volumes...');
    execSync('docker volume prune -f');

    console.log('\nRemoving unused images...');
    execSync('docker image prune -f');

    console.log('\nCleanup complete! 🧹');
  } catch (error) {
    console.error('Error during cleanup:', error.message);
    process.exit(1);
  }
};

cleanup();