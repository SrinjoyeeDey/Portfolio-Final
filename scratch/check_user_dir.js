const fs = require('fs');
const path = require('path');

const dir = 'C:/Users/SRINJOYEE/.gemini/antigravity/brain/7ceb5648-8619-4774-af6f-25abfc2b147b/.user_uploaded';
fs.readdirSync(dir).forEach(f => {
  const stat = fs.statSync(path.join(dir, f));
  console.log(f, stat.size, stat.mtime);
});

