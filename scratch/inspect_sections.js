const puppeteer = require('puppeteer-core');
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 8142;
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
    const tmpDir = path.join(BASE_DIR, 'scratch', 'test_chrome_profile');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
    const browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      headless: 'new',
      userDataDir: tmpDir,
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

    const studioEl = await page.$('#studio');
    if (studioEl) {
      await studioEl.screenshot({ path: path.join(__dirname, 'studio_screenshot.png') });
      console.log('Saved studio_screenshot.png');
    }

    const contactEl = await page.$('#contact');
    if (contactEl) {
      await contactEl.screenshot({ path: path.join(__dirname, 'contact_screenshot.png') });
      console.log('Saved contact_screenshot.png');
    }

    const info = await page.evaluate(() => {
      const el = document.getElementById('studio');
      if (!el) return null;
      const getStyles = (elem) => {
        const s = window.getComputedStyle(elem);
        return {
          tag: elem.tagName,
          id: elem.id,
          class: elem.className,
          bg: s.backgroundColor,
          bgImg: s.backgroundImage,
          boxShadow: s.boxShadow,
          borderRadius: s.borderRadius
        };
      };
      const children = Array.from(el.querySelectorAll('*')).map(getStyles);
      return {
        studio: getStyles(el),
        children: children.filter(c => c.bg !== 'rgba(0, 0, 0, 0)' && c.bg !== 'transparent')
      };
    });
    console.log('STUDIO NON-TRANSPARENT CHILDREN:', JSON.stringify(info, null, 2));

    await browser.close();
  } catch (err) {
    console.error(err);
  } finally {
    server.close();
  }
});
