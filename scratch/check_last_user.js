const fs = require('fs');
const readline = require('readline');
const file = 'C:/Users/SRINJOYEE/.gemini/antigravity/brain/7ceb5648-8619-4774-af6f-25abfc2b147b/.system_generated/logs/transcript.jsonl';
const rl = readline.createInterface({ input: fs.createReadStream(file) });
const userInputs = [];
rl.on('line', (line) => {
  try {
    const data = JSON.parse(line);
    if (data.type === 'USER_INPUT') {
      userInputs.push(data);
    }
  } catch(e) {}
});
rl.on('close', () => {
  console.log('Total user inputs:', userInputs.length);
  const last = userInputs[userInputs.length - 1];
  console.log('LAST STEP INDEX:', last?.step_index);
  console.log('LAST CONTENT:', last?.content);
  console.log('LAST MEDIA COUNT:', last?.media?.length);
  if (last?.media) {
    last.media.forEach((m, idx) => console.log(`Media ${idx}:`, m.uri));
  }
});
