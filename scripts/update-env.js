const fs = require('fs');
const path = require('path');

const envFiles = [
  { src: '.env.example', dest: '.env' },
  { src: 'client/.env.example', dest: 'client/.env' },
  { src: 'server/.env.example', dest: 'server/.env' }
];

envFiles.forEach(({ src, dest }) => {
  const srcPath = path.join(__dirname, '..', src);
  const destPath = path.join(__dirname, '..', dest);

  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${src} to ${dest}`);
  } else {
    console.error(`Source file not found: ${src}`);
  }
});
