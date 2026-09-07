const fs = require('fs');

console.log('--- 1. Verifying Netlify & Deployment Configuration Files ---');
const requiredFiles = [
  'netlify.toml',
  '.gitignore',
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

console.log('\n--- 2. Verifying netlify.toml Content ---');
const toml = fs.readFileSync('netlify.toml', 'utf8');
if (!toml.includes('publish = "frontend"')) throw new Error('Missing publish = "frontend" in netlify.toml');
if (!toml.includes('from = "/*"')) throw new Error('Missing SPA redirect in netlify.toml');
if (!toml.includes('NODE_VERSION = "20"')) throw new Error('Missing NODE_VERSION in netlify.toml');
console.log('✓ netlify.toml contains publish = "frontend", Node 20 LTS, and SPA redirects');

console.log('\n--- 3. Verifying .gitignore Protections ---');
const gitignore = fs.readFileSync('.gitignore', 'utf8');
if (!gitignore.includes('*.mp4')) throw new Error('.gitignore missing *.mp4 protection');
if (!gitignore.includes('node_modules/')) throw new Error('.gitignore missing node_modules/ ignore');
if (!gitignore.includes('__pycache__/')) throw new Error('.gitignore missing __pycache__/ ignore');
console.log('✓ .gitignore blocks large video binaries (>100MB), node_modules, and python caches');

console.log('\n--- 4. Verifying package.json Content ---');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
if (!pkg.scripts || !pkg.scripts.build) throw new Error('Missing build script');
console.log('✓ package.json scripts: ' + Object.keys(pkg.scripts).join(', '));

console.log('\n--- 5. Verifying app.js Base URL Logic ---');
const appJs = fs.readFileSync('frontend/app.js', 'utf8');
if (!appJs.includes('resolveApiBaseUrl')) throw new Error('Missing resolveApiBaseUrl in app.js');
if (!appJs.includes('setBackendUrl')) throw new Error('Missing setBackendUrl in app.js');
console.log('✓ frontend/app.js contains environment-aware URL resolver and setBackendUrl');

console.log('\n--- 6. Verifying SPA Routing Redirects ---');
const frontendRedirects = fs.readFileSync('frontend/_redirects', 'utf8');
if (!frontendRedirects.includes('/index.html   200')) throw new Error('frontend/_redirects missing SPA rewrite rule');
const rootRedirects = fs.readFileSync('_redirects', 'utf8');
if (!rootRedirects.includes('/frontend/index.html   200')) throw new Error('_redirects missing fallback rewrite rule');
console.log('✓ Both frontend/_redirects and root _redirects configured for seamless SPA fallback');

console.log('\nAll Netlify preparation checks passed successfully! 🚀');
