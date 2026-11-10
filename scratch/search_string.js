const fs = require('fs');
const path = require('path');

function searchDir(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    if (f === 'node_modules' || f === '.git' || f === '.next') continue;
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      searchDir(full);
    } else {
      try {
        const content = fs.readFileSync(full, 'utf8');
        if (content.includes('Click to type') || content.includes('bones of any') || content.includes('The bones')) {
          console.log('FOUND IN:', full);
        }
      } catch(e) {}
    }
  }
}

searchDir('.');

