const puppeteer = require('puppeteer-core');
const path = require('path');

(async () => {
  try {
    const browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--allow-file-access-from-files']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 950, deviceScaleFactor: 1 });

    const filePath = 'file:///' + path.resolve(__dirname, '../index.html').replace(/\\/g, '/');
    console.log('Navigating to', filePath);
    await page.goto(filePath, { waitUntil: 'domcontentloaded', timeout: 15000 });

    // Dismiss preloader immediately for test
    await page.evaluate(() => {
      const p = document.getElementById('preloader-root');
      if (p) p.remove();
      document.body.style.overflow = 'auto';
    });

    // Wait 3.5s for 3D keyboard & elastic mesh
    await new Promise(r => setTimeout(r, 3500));

    // Capture Studio Section
    const studioSection = await page.$('#studio');
    if (studioSection) {
      await studioSection.screenshot({
        path: 'C:/Users/SRINJOYEE/.gemini/antigravity/brain/7ceb5648-8619-4774-af6f-25abfc2b147b/studio_transparent_dotted_grid.png'
      });
      console.log('Saved studio_transparent_dotted_grid.png');
    }

    await browser.close();
    console.log('Done!');
  } catch (err) {
    console.error('Capture error:', err);
  }
})();
