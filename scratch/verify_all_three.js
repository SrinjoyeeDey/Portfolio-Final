const puppeteer = require('puppeteer-core');
const path = require('path');
const os = require('os');
const fs = require('fs');

const outDir = 'C:/Users/SRINJOYEE/.gemini/antigravity/brain/4e5dc6f5-05f8-4743-8c45-e611517e4b47';

(async () => {
  const tmpProfile = fs.mkdtempSync(path.join(os.tmpdir(), 'edge_test_'));
  try {
    const browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      headless: 'new',
      userDataDir: tmpProfile,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--allow-file-access-from-files']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', err => {
      errors.push(err.toString());
    });

    const filePath = 'file:///' + path.resolve(__dirname, '../index.html').replace(/\\/g, '/');
    console.log('Navigating to', filePath);
    await page.goto(filePath, { waitUntil: 'load', timeout: 30000 });

    // Wait for preloader to finish
    await page.evaluate(() => {
      const preloader = document.getElementById('preloader-root');
      if (preloader) preloader.remove();
      const o = document.getElementById('section-loader-overlay');
      if (o) o.remove();
      document.body.style.overflow = 'auto';
    });
    await new Promise(r => setTimeout(r, 2000));

    // 1. Verify Gooey Nav
    const navBar = await page.$('.portfolio-gooey-nav');
    if (navBar) {
      await navBar.screenshot({ path: path.join(outDir, 'verified_gooey_nav_bright_yellow.png') });
      console.log('Captured verified_gooey_nav_bright_yellow.png');
    } else {
      console.log('Gooey nav element not found');
    }

    // 2. Verify Memory Wall VANI Victory card
    const vaniCard = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.photo-print-card'));
      for (const card of cards) {
        if (card.textContent.includes('VANI Victory')) {
          card.scrollIntoView({ block: 'center' });
          const rect = card.getBoundingClientRect();
          return { found: true, rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height } };
        }
      }
      return { found: false };
    });

    await new Promise(r => setTimeout(r, 1000));
    if (vaniCard.found) {
      const cardEl = await page.evaluateHandle(() => {
        return Array.from(document.querySelectorAll('.photo-print-card')).find(c => c.textContent.includes('VANI Victory'));
      });
      if (cardEl) {
        await cardEl.screenshot({ path: path.join(outDir, 'verified_vani_card_no_space.png') });
        console.log('Captured verified_vani_card_no_space.png');
      }
    } else {
      console.log('Vani card not found');
    }

    // 3. Verify SlingButton in CTA
    const ctaSection = await page.evaluate(() => {
      const cta = document.getElementById('lets-work-root') || document.querySelector('.studio-lets-work-wrapper');
      if (cta) {
        cta.scrollIntoView({ block: 'center' });
        return true;
      }
      return false;
    });

    await new Promise(r => setTimeout(r, 1200));

    const slingBtn = await page.$('.sling-button');
    if (slingBtn) {
      const ctaRoot = await page.$('#lets-work-root');
      if (ctaRoot) {
        await ctaRoot.screenshot({ path: path.join(outDir, 'verified_cta_sling_button.png') });
        console.log('Captured verified_cta_sling_button.png');
      }
    } else {
      console.log('SlingButton not found in DOM!');
    }

    console.log('Errors logged:', errors);
    await browser.close();
  } catch (err) {
    console.error('Test error:', err);
  }
})();
