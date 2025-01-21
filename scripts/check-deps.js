import fs from 'fs';
import path from 'path';

const checkDependencies = () => {
  const packages = ['package.json', 'client/package.json', 'server/package.json'];
  const deps = new Map();

  packages.forEach(pkg => {
    try {
      const content = JSON.parse(fs.readFileSync(pkg));
      const packageName = pkg === 'package.json' ? 'root' : pkg.split('/')[0];
      
      console.log(`\nChecking ${packageName} dependencies...`);
      
      [...Object.entries({ ...content.dependencies }), ...Object.entries({ ...content.devDependencies })]
        .forEach(([name, version]) => {
          if (deps.has(name)) {
            const existing = deps.get(name);
            if (existing.version !== version) {
              console.log(`⚠️  Version mismatch for ${name}:`);
              console.log(`   - ${existing.package}: ${existing.version}`);
              console.log(`   - ${packageName}: ${version}`);
            }
          } else {
            deps.set(name, { version, package: packageName });
          }
        });
    } catch (error) {
      console.error(`Error reading ${pkg}:`, error.message);
    }
  });
};

checkDependencies();