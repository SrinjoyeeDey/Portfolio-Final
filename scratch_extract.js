const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: fs.createReadStream('C:/Users/SRINJOYEE/.gemini/antigravity/brain/4e5dc6f5-05f8-4743-8c45-e611517e4b47/.system_generated/logs/transcript_full.jsonl'),
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  if (line.includes('"step_index":3482') || line.includes('"step_index": 3482')) {
    const data = JSON.parse(line);
    fs.writeFileSync('scratch_sling_prompt.txt', data.content, 'utf8');
    console.log('Successfully wrote scratch_sling_prompt.txt, bytes:', data.content.length);
    process.exit(0);
  }
});
