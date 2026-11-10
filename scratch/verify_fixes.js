const puppeteer = require('puppeteer-core');
const path = require('path');

const outDir = 'C:/Users/SRINJOYEE/.gemini/antigravity/brain/4e5dc6f5-05f8-4743-8c45-e611517e4b47';

(async () => {
  const tmpProfile = path.join(__dirname, 'test_profile_pill_' + Date.now());
  try {
    const browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      headless: 'new',
      userDataDir: tmpProfile,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--allow-file-access-from-files']
    });

    const page = await browser.newPage();
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    page.on('pageerror', err => {
      consoleErrors.push(err.message);
    });

    await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 1 });
    const filePath = 'file:///' + path.resolve(__dirname, '../index.html').replace(/\\/g, '/');
    await page.goto(filePath, { waitUntil: 'domcontentloaded', timeout: 15000 });

    // Dismiss preloader
    await page.evaluate(() => {
      const p = document.getElementById('preloader-root');
      if (p) p.remove();
      const o = document.getElementById('section-loader-overlay');
      if (o) o.remove();
      document.body.style.overflow = 'auto';
    });

    await new Promise(r => setTimeout(r, 2000));

    // Scroll to trigger IntersectionObserver
    await page.evaluate(() => {
      window.scrollTo(0, 500);
    });
    await new Promise(r => setTimeout(r, 500));

    await page.evaluate(() => {
      window.scrollTo(0, 1500);
    });
    await new Promise(r => setTimeout(r, 500));

    // Check console errors
    console.log('Console Errors caught:', consoleErrors.length ? consoleErrors : 'None! (0 errors)');

    // Screenshot the hero role pill
    const pill = await page.$('.hero-badge-interaction-row');
    if (pill) {
      await pill.screenshot({
        path: path.join(outDir, 'verified_hero_role_pill_mobile.png')
      });
      console.log('Saved verified_hero_role_pill_mobile.png');
    }

    await browser.close();
    console.log('Verification finished successfully!');
  } catch (err) {
    console.error('Verification error:', err);
  }
})();

