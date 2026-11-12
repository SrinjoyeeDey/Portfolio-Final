const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function copyFileSafe(srcPath, destPath) {
  if (fs.existsSync(srcPath)) {
    ensureDir(path.dirname(destPath));
    fs.copyFileSync(srcPath, destPath);
  }
}

function copyDirRecursive(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return;
  ensureDir(destDir);
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcEntry = path.join(srcDir, entry.name);
    const destEntry = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcEntry, destEntry);
    } else {
      fs.copyFileSync(srcEntry, destEntry);
    }
  }
}

console.log('Assembling production dist/ directory...');

// 1. Clean and recreate dist/
if (fs.existsSync(DIST_DIR)) {
  fs.rmSync(DIST_DIR, { recursive: true, force: true });
}
ensureDir(DIST_DIR);

// 2. Copy root index.html
copyFileSafe(path.join(ROOT_DIR, 'index.html'), path.join(DIST_DIR, 'index.html'));

// 3. Copy compiled bundles (*-bundle.js, *-bundle.css, tailwind-bundle.css) and minified core assets (*.min.css, *.min.js)
const rootEntries = fs.readdirSync(ROOT_DIR, { withFileTypes: true });
for (const entry of rootEntries) {
  if (!entry.isFile()) continue;
  const name = entry.name;
  if (
    name.endsWith('-bundle.js') ||
    name.endsWith('-bundle.css') ||
    name === 'tailwind-bundle.css' ||
    name.endsWith('.min.css') ||
    name.endsWith('.min.js') ||
    name === 'character_model.glb' ||
    name === '3d character model.glb' ||
    name === 'helvetiker_bold.typeface.json' ||
    name === 'space_grotesk_bold.typeface.json' ||
    name === 'tech-preview-cropped.mp4'
  ) {
    copyFileSafe(path.join(ROOT_DIR, name), path.join(DIST_DIR, name));
  }
}

// 4. Copy asset directories
copyDirRecursive(path.join(ROOT_DIR, 'images'), path.join(DIST_DIR, 'images'));
copyDirRecursive(path.join(ROOT_DIR, 'lib'), path.join(DIST_DIR, 'lib'));
copyDirRecursive(path.join(ROOT_DIR, 'sounds'), path.join(DIST_DIR, 'sounds'));
copyDirRecursive(path.join(ROOT_DIR, 'tech-logos'), path.join(DIST_DIR, 'tech-logos'));
if (fs.existsSync(path.join(ROOT_DIR, 'fonts'))) {
  copyDirRecursive(path.join(ROOT_DIR, 'fonts'), path.join(DIST_DIR, 'fonts'));
}

// 5. Copy 3D assets located under src/ (e.g. card.glb for Three/Rapier island)
if (fs.existsSync(path.join(ROOT_DIR, 'src', 'card.glb'))) {
  copyFileSafe(path.join(ROOT_DIR, 'src', 'card.glb'), path.join(DIST_DIR, 'src', 'card.glb'));
}

console.log('Production dist/ assembled successfully!');

