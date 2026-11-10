const fs = require('fs');
const css = fs.readFileSync('src/PhotographicMemoryWall.css', 'utf8');

const s1 = css.indexOf('.photo-print-card.format-hackathon-portrait');
console.log(css.substring(s1 - 40, s1 + 600));
