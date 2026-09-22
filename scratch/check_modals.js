const fs = require('fs');
const content = fs.readFileSync('frontend/index.html', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('id="modal-')) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
