const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const PORT = 8139;
const BASE_DIR = path.resolve(__dirname, '..');

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  const filePath = path.join(BASE_DIR, reqPath);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.statusCode = 404;
    res.end('Not found');
    return;
  }
  res.writeHead(200, { 'Access-Control-Allow-Origin': '*' });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, '127.0.0.1', async () => {
  try {
    const browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 950 });
    await page.goto(`http://127.0.0.1:${PORT}/index.html`, { waitUntil: 'load', timeout: 20000 });
    await page.evaluate(() => {
      const p = document.getElementById('preloader-root');
      if (p) p.remove();
      document.body.style.overflow = 'auto';
    });
    await new Promise(r => setTimeout(r, 3000));
    const studioSection = await page.$('#studio');
    if (studioSection) {
      await studioSection.screenshot({
        path: 'C:/Users/SRINJOYEE/.gemini/antigravity/brain/7ceb5648-8619-4774-af6f-25abfc2b147b/studio_transparent_dotted_grid.png'
      });
      console.log('CAPTURED_SUCCESSFULLY');
    }
    await browser.close();
  } catch (err) {
    console.error(err);
  } finally {
    server.close();
  }
});
