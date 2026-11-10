const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');
const os = require('os');

const viewports = [
  { name: 'mobile_320', width: 320, height: 720 },
  { name: 'mobile_375', width: 375, height: 812 },
  { name: 'mobile_430', width: 430, height: 932 },
  { name: 'tablet_768', width: 768, height: 1024 },
  { name: 'tablet_1024', width: 1024, height: 768 },
  { name: 'desktop_1440', width: 1440, height: 900 }
];

const outDir = 'C:/Users/SRINJOYEE/.gemini/antigravity/brain/4e5dc6f5-05f8-4743-8c45-e611517e4b47';

(async () => {
  const tmpProfile = path.join(__dirname, 'test_profile_' + Date.now());
  try {
    const browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      headless: 'new',
      userDataDir: tmpProfile,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--allow-file-access-from-files']
    });

    const page = await browser.newPage();
    const filePath = 'file:///' + path.resolve(__dirname, '../index.html').replace(/\\/g, '/');

    for (const vp of viewports) {
      console.log(`\n--- Testing ${vp.name} (${vp.width}x${vp.height}) ---`);
      await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 });
      await page.goto(filePath, { waitUntil: 'domcontentloaded', timeout: 15000 });

      // Dismiss preloader
      await page.evaluate(() => {
        const p = document.getElementById('preloader-root');
        if (p) p.remove();
        const overlay = document.getElementById('section-loader-overlay');
        if (overlay) overlay.remove();
        document.body.style.overflow = 'auto';
      });

      await new Promise(r => setTimeout(r, 2000));

      // Check overflow
      const overflowInfo = await page.evaluate(() => {
        const docW = document.documentElement.clientWidth;
        const scrollW = document.documentElement.scrollWidth;
        const bodyW = document.body.scrollWidth;
        const hasOverflow = scrollW > docW || bodyW > docW;

        // Find elements wider than viewport
        const offenders = [];
        document.querySelectorAll('*').forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.right > docW + 2) {
            offenders.push({
              tag: el.tagName,
              id: el.id,
              class: el.className,
              rect: { left: rect.left, right: rect.right, width: rect.width }
            });
          }
        });

        return {
          docW,
          scrollW,
          bodyW,
          hasOverflow,
          offendersCount: offenders.length,
          topOffenders: offenders.slice(0, 5)
        };
      });

      console.log(`Viewport ${vp.name}: docW=${overflowInfo.docW}, scrollW=${overflowInfo.scrollW}, hasOverflow=${overflowInfo.hasOverflow}`);
      if (overflowInfo.hasOverflow) {
        console.log('Offenders:', JSON.stringify(overflowInfo.topOffenders, null, 2));
      }

      // Capture screenshot of hero and studio
      await page.screenshot({
        path: path.join(outDir, `vp_${vp.name}_hero.png`),
        clip: { x: 0, y: 0, width: vp.width, height: Math.min(vp.height, 900) }
      });

      if (vp.width <= 768) {
        // Test hamburger menu
        const hamburgerWorks = await page.evaluate(() => {
          const btn = document.getElementById('hamburger-btn');
          const menu = document.getElementById('nav-menu');
          if (!btn || !menu) return 'Missing btn or menu';
          const btnVisible = window.getComputedStyle(btn).display !== 'none';
          btn.click();
          const menuActive = menu.classList.contains('active') && window.getComputedStyle(menu).display !== 'none';
          btn.click();
          return { btnVisible, menuActive };
        });
        console.log(`Hamburger test on ${vp.name}:`, hamburgerWorks);
      }
    }

    await browser.close();
    console.log('\nAll tests complete!');
  } catch (err) {
    console.error('Test error:', err);
  }
})();
