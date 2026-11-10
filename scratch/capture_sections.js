const puppeteer = require('puppeteer-core');
const path = require('path');

const outDir = 'C:/Users/SRINJOYEE/.gemini/antigravity/brain/4e5dc6f5-05f8-4743-8c45-e611517e4b47';
const sections = ['#hero', '#about', '#projects', '#skills', '#studio', '#contact'];

(async () => {
  const tmpProfile = path.join(__dirname, 'test_profile_sections_' + Date.now());
  try {
    const browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      headless: 'new',
      userDataDir: tmpProfile,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--allow-file-access-from-files']
    });

    const page = await browser.newPage();
    const filePath = 'file:///' + path.resolve(__dirname, '../index.html').replace(/\\/g, '/');

    // 1. Mobile 375
    await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 1 });
    await page.goto(filePath, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.evaluate(() => {
      const p = document.getElementById('preloader-root');
      if (p) p.remove();
      const o = document.getElementById('section-loader-overlay');
      if (o) o.remove();
      document.body.style.overflow = 'auto';
    });
    await new Promise(r => setTimeout(r, 2500));

    for (const secId of sections) {
      const el = await page.$(secId);
      if (el) {
        await el.screenshot({
          path: path.join(outDir, `mobile375_${secId.replace('#', '')}.png`)
        });
        console.log(`Captured mobile 375 ${secId}`);
      }
    }

    // 2. Tablet 768
    await page.setViewport({ width: 768, height: 1024, deviceScaleFactor: 1 });
    await page.goto(filePath, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.evaluate(() => {
      const p = document.getElementById('preloader-root');
      if (p) p.remove();
      const o = document.getElementById('section-loader-overlay');
      if (o) o.remove();
      document.body.style.overflow = 'auto';
    });
    await new Promise(r => setTimeout(r, 2000));

    for (const secId of ['#hero', '#about', '#studio']) {
      const el = await page.$(secId);
      if (el) {
        await el.screenshot({
          path: path.join(outDir, `tablet768_${secId.replace('#', '')}.png`)
        });
        console.log(`Captured tablet 768 ${secId}`);
      }
    }

    await browser.close();
    console.log('Section screenshots complete!');
  } catch (err) {
    console.error('Section capture error:', err);
  }
})();

