const fs = require('fs');
const readline = require('readline');
const file = 'C:/Users/SRINJOYEE/.gemini/antigravity/brain/7ceb5648-8619-4774-af6f-25abfc2b147b/.system_generated/logs/transcript.jsonl';
const rl = readline.createInterface({ input: fs.createReadStream(file) });
const uploads = [];
rl.on('line', (line) => {
  try {
    const data = JSON.parse(line);
    if (data.media && data.media.length > 0) {
      uploads.push({ step: data.step_index, source: data.source, media: data.media.map(m => m.uri) });
    }
  } catch(e) {}
});
rl.on('close', () => {
  console.log(JSON.stringify(uploads.slice(-10), null, 2));
});

