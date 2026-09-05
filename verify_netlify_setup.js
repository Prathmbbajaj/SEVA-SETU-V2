const fs = require('fs');

console.log('--- Verifying Netlify Configuration Files ---');
const requiredFiles = [
  'netlify.toml',
  'frontend/_redirects',
  'frontend/_headers',
  'frontend/index.html',
  'frontend/app.js',
  'frontend/style.css',
  '_redirects',
  'index.html',
  'package.json',
  'NETLIFY_DEPLOYMENT.md'
];

let allExist = true;
for (const file of requiredFiles) {
  const exists = fs.existsSync(file);
  console.log((exists ? '✓' : '✗') + ' ' + file);
  if (!exists) allExist = false;
}

if (!allExist) {
  console.error('Some required files are missing!');
  process.exit(1);
}

console.log('\n--- Verifying netlify.toml Content ---');
const toml = fs.readFileSync('netlify.toml', 'utf8');
if (!toml.includes('publish = "frontend"')) throw new Error('Missing publish = frontend');
if (!toml.includes('from = "/*"')) throw new Error('Missing SPA redirect');
console.log('✓ netlify.toml contains publish = "frontend" and SPA redirects');

console.log('\n--- Verifying package.json Content ---');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
if (!pkg.scripts || !pkg.scripts.build) throw new Error('Missing build script');
console.log('✓ package.json scripts: ' + Object.keys(pkg.scripts).join(', '));

console.log('\n--- Verifying app.js Base URL logic ---');
const appJs = fs.readFileSync('frontend/app.js', 'utf8');
if (!appJs.includes('resolveApiBaseUrl')) throw new Error('Missing resolveApiBaseUrl in app.js');
if (!appJs.includes('setBackendUrl')) throw new Error('Missing setBackendUrl in app.js');
console.log('✓ frontend/app.js contains environment-aware URL resolver and setBackendUrl');

console.log('\nAll Netlify preparation checks passed successfully! 🚀');
