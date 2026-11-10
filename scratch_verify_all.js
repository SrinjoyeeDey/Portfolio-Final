const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const outDir = 'C:/Users/SRINJOYEE/.gemini/antigravity/brain/4e5dc6f5-05f8-4743-8c45-e611517e4b47';

(async () => {
  const tmpProfile = path.join(__dirname, 'scratch', 'test_prof_final_' + Date.now());
  fs.mkdirSync(tmpProfile, { recursive: true });
  try {
    const browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      headless: 'new',
      userDataDir: tmpProfile,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--allow-file-access-from-files']
    });

    const page = await browser.newPage();
    const filePath = 'file:///' + path.resolve(__dirname, 'index.html').replace(/\\/g, '/');

    await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2 });
    await page.goto(filePath, { waitUntil: 'load', timeout: 25000 });

    // Remove preloader
    await page.evaluate(() => {
      const p = document.getElementById('preloader-root');
      if (p) p.remove();
      document.body.style.overflow = 'auto';
    });
    await new Promise(r => setTimeout(r, 2000));

    // 1. Capture Studio Section (Mobile keyboard & single line legend)
    const studio = await page.$('#studio');
    if (studio) {
      await page.evaluate(() => document.getElementById('studio').scrollIntoView());
      await new Promise(r => setTimeout(r, 1200));
      await studio.screenshot({ path: path.join(outDir, 'verified_mobile_studio_keyboard.png') });
      console.log('Captured verified_mobile_studio_keyboard.png');
    }

    // 2. Capture Projects Section (No unwanted tagline/spaces)
    const projects = await page.$('#projects');
    if (projects) {
      await page.evaluate(() => document.getElementById('projects').scrollIntoView());
      await new Promise(r => setTimeout(r, 1000));
      await projects.screenshot({ path: path.join(outDir, 'verified_mobile_projects.png') });
      console.log('Captured verified_mobile_projects.png');
    }

    // 3. Test Project Detail Modal for Nobodristhi
    await page.evaluate(() => {
      // Find row for Nobodristhi or call openProjectModalById('nobodristhi')
      if (typeof window.openProjectModalById === 'function') {
        window.openProjectModalById('nobodristhi');
      } else {
        const row = document.querySelector('[data-project-id="nobodristhi"], [data-row-id="nobodristhi"], .editorial-row[data-row-id="4"]');
        if (row) {
          const btn = row.querySelector('.editorial-jump-btn, [aria-label*="Details"]');
          if (btn) btn.click();
        }
      }
    });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(outDir, 'verified_mobile_project_modal.png') });
    console.log('Captured verified_mobile_project_modal.png');

    // Close modal
    await page.evaluate(() => {
      const btn = document.getElementById('modal-close-btn');
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // 4. Capture Footer Section
    const footer = await page.$('#story-layer-contact');
    if (footer) {
      await page.evaluate(() => document.getElementById('story-layer-contact').scrollIntoView());
      await new Promise(r => setTimeout(r, 1500));
      await footer.screenshot({ path: path.join(outDir, 'verified_mobile_footer.png') });
      console.log('Captured verified_mobile_footer.png');
    }

    await browser.close();
    console.log('ALL SCREENSHOTS CAPTURED SUCCESSFULLY!');
  } catch (err) {
    console.error('Error during verification:', err);
  } finally {
    try { fs.rmSync(tmpProfile, { recursive: true, force: true }); } catch (e) {}
  }
})();

