const { execSync } = require('child_process');
const fs = require('fs');

console.log('Starting custom build process...');

try {
  // Install dependencies
  console.log('Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // Ensure Vite binary has execute permissions
  console.log('Setting up Vite...');
  try {
    execSync('chmod +x node_modules/.bin/vite', { stdio: 'inherit' });
  } catch (error) {
    console.log('Warning: Could not set Vite permissions, continuing...');
  }

  // Run build
  console.log('Running build...');
  execSync('npx vite build', { stdio: 'inherit' });

  console.log('Build completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
