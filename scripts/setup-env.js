import fs from 'fs';
import path from 'path';

const copyEnvFiles = () => {
  const envFiles = [
    { src: '.env.example', dest: '.env' },
    { src: 'client/.env.example', dest: 'client/.env' },
    { src: 'server/.env.example', dest: 'server/.env' }
  ];

  envFiles.forEach(({ src, dest }) => {
    if (!fs.existsSync(dest)) {
      fs.copyFileSync(src, dest);
      console.log(`Created ${dest} from ${src}`);
    } else {
      console.log(`${dest} already exists, skipping...`);
    }
  });
};

copyEnvFiles();