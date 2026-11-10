const puppeteer = require('puppeteer-core');
const path = require('path');

const outDir = 'C:/Users/SRINJOYEE/.gemini/antigravity/brain/4e5dc6f5-05f8-4743-8c45-e611517e4b47';

(async () => {
  const tmpProfile = path.join(__dirname, 'test_profile_bg_' + Date.now());
  try {
    const browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      headless: 'new',
      userDataDir: tmpProfile,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--allow-file-access-from-files']
    });

    const page = await browser.newPage();
    const filePath = 'file:///' + path.resolve(__dirname, '../index.html').replace(/\\/g, '/');

    // 1. Mobile 375px
    await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 1 });
    await page.goto(filePath, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.evaluate(() => {
      const p = document.getElementById('preloader-root');
      if (p) p.remove();
      const o = document.getElementById('section-loader-overlay');
      if (o) o.remove();
      document.body.style.overflow = 'auto';
    });
    await new Promise(r => setTimeout(r, 2000));
    const mobileHero = await page.$('#hero');
    if (mobileHero) {
      await mobileHero.screenshot({
        path: path.join(outDir, 'mobile375_hero_grid_only.png')
      });
      console.log('Captured mobile375_hero_grid_only.png');
    }

    // 2. Tablet 768px (should still have the 3D room perspective wireframe grid)
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
    const tabletHero = await page.$('#hero');
    if (tabletHero) {
      await tabletHero.screenshot({
        path: path.join(outDir, 'tablet768_hero_perspective_preserved.png')
      });
      console.log('Captured tablet768_hero_perspective_preserved.png');
    }

    await browser.close();
    console.log('Background verification screenshots complete!');
  } catch (err) {
    console.error('BG capture error:', err);
  }
})();

