const puppeteer = require('puppeteer-core');
const path = require('path');

const outDir = 'C:/Users/SRINJOYEE/.gemini/antigravity/brain/4e5dc6f5-05f8-4743-8c45-e611517e4b47';

(async () => {
  const tmpProfile = path.join(__dirname, 'test_profile_about_proj_' + Date.now());
  try {
    const browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      headless: 'new',
      userDataDir: tmpProfile,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--allow-file-access-from-files']
    });

    const page = await browser.newPage();
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

    // 1. Capture About section
    const aboutSec = await page.$('#about');
    if (aboutSec) {
      await aboutSec.screenshot({
        path: path.join(outDir, 'verified_mobile375_about_complete.png')
      });
      console.log('Saved verified_mobile375_about_complete.png');
    }

    // 2. Click to expand first project (VAni)
    const firstRow = await page.$('.editorial-row');
    if (firstRow) {
      await firstRow.click();
      console.log('Clicked first project row to expand');
      await new Promise(r => setTimeout(r, 800));

      // Check overflow when expanded
      const overflow = await page.evaluate(() => {
        return {
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
        };
      });
      console.log('Overflow when Project expanded:', overflow);

      // Screenshot expanded project row
      await firstRow.screenshot({
        path: path.join(outDir, 'verified_mobile375_project_expanded.png')
      });
      console.log('Saved verified_mobile375_project_expanded.png');
    }

    await browser.close();
    console.log('Verification done!');
  } catch (err) {
    console.error('Error during verification:', err);
  }
})();

