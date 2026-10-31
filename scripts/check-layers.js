const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

const layerRegex = /<div class="[^"]*story-layer[^"]*" id="([^"]+)"[^>]*>/g;
let m;
console.log('Story Layers:');
while ((m = layerRegex.exec(content)) !== null) {
  console.log(m[0]);
}

const locked = content.match(/featured-creations-locked/g);
console.log('Total featured-creations-locked in index.html:', locked ? locked.length : 0);
