const fs = require('fs');
const text = fs.readFileSync('scratch_sling_prompt.txt', 'utf8');

const regex = /```([a-zA-Z]*)\r?\n([\s\S]*?)```/g;
let match;
let i = 0;
while ((match = regex.exec(text)) !== null) {
  const lang = match[1];
  const content = match[2];
  console.log(`Block ${i}: lang=${lang}, length=${content.length}, preview=${content.slice(0, 100).replace(/\r?\n/g, ' ')}`);
  
  if (content.includes('export default function SlingButton') || content.includes('const SlingButton =') || content.includes('function SlingButton')) {
    fs.writeFileSync('src/SlingButton.jsx', content.trim() + '\n', 'utf8');
    console.log('-> Wrote src/SlingButton.jsx');
  } else if (content.includes('.sling-button') || content.includes('--sl-')) {
    fs.writeFileSync('src/SlingButton.css', content.trim() + '\n', 'utf8');
    console.log('-> Wrote src/SlingButton.css');
  }
  i++;
}
