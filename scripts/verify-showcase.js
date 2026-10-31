const puppeteer = require('puppeteer-core');
const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

async function verify() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://localhost:3000/?nocache=' + Date.now(), { waitUntil: 'networkidle2' });
  // Wait for the 3.5s initial loader to fade away
  await new Promise(r => setTimeout(r, 4500));

  // Scroll showcase into view
  await page.evaluate(() => {
    const el = document.getElementById('projects-showcase-container');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 800));

  // 1. Check if #projects-showcase-container exists
  const container = await page.$('#projects-showcase-container');
  console.log('Showcase container exists:', !!container);

  // 2. Check total slides
  const slides = await page.$$('.showcase-slide');
  console.log('Total slides rendered:', slides.length);

  // 3. Test sound toggle
  const initialText = await page.evaluate(() => {
    const btn = document.querySelector('.showcase-sound-toggle-btn');
    return btn ? btn.innerText.trim() : null;
  });
  console.log('Initial sound button text:', initialText);

  await page.evaluate(() => {
    const btn = document.querySelector('.showcase-sound-toggle-btn');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 300));

  const clickedText = await page.evaluate(() => {
    const btn = document.querySelector('.showcase-sound-toggle-btn');
    return btn ? btn.innerText.trim() : null;
  });
  console.log('Clicked sound button text:', clickedText);

  // 4. Test modal opening via button click
  const viewDetailsBtn = await page.$('.showcase-btn-primary');
  console.log('View details button found:', !!viewDetailsBtn);
  await viewDetailsBtn.click();
  await new Promise(r => setTimeout(r, 500));

  const modalActive = await page.evaluate(() => {
    const modal = document.getElementById('project-modal');
    return modal ? modal.classList.contains('active') : false;
  });
  console.log('Project modal active after clicking View details:', modalActive);

  // Close modal if open
  await page.evaluate(() => {
    const modal = document.getElementById('project-modal');
    if (modal) modal.classList.remove('active');
  });

  // 5. Test next navigation arrow
  const nextBtn = await page.$('button[aria-label="Next Project"]');
  console.log('Next button found:', !!nextBtn);
  await nextBtn.click();
  await new Promise(r => setTimeout(r, 600));

  const activeSlideTitle = await page.evaluate(() => {
    const active = document.querySelector('.showcase-slide.active-slide .showcase-project-title span');
    return active ? active.innerText : null;
  });
  console.log('Active slide title after Next click:', activeSlideTitle);

  // 6. Navigate to slide 6 (Punarchakra)
  for (let i = 0; i < 5; i++) {
    await page.evaluate(() => {
      const btn = document.querySelector('button[aria-label="Next Project"]');
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 600));
  }

  const slide6Title = await page.evaluate(() => {
    const active = document.querySelector('.showcase-slide.active-slide .showcase-project-title span');
    return active ? active.innerText : null;
  });
  console.log('Active slide title on slide 6:', slide6Title);

  const canvasExists = await page.evaluate(() => {
    const canvas = document.querySelector('.showcase-slide.active-slide canvas');
    return !!canvas;
  });
  console.log('Ballpit canvas exists in slide 6:', canvasExists);

  // 7. Verify bottom edge scattered balls canvas
  const bottomBallsCanvas = await page.evaluate(() => {
    const canvas = document.querySelector('.showcase-bottom-balls-stage canvas');
    return !!canvas;
  });
  console.log('Shared bottom edge scattered balls canvas exists:', bottomBallsCanvas);

  // Return to slide 1 to capture the scattered balls along the bottom edge
  await page.evaluate(() => {
    const track = document.querySelector('.showcase-horizontal-track');
    if (track) track.scrollTo({ left: 0, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ path: 'bottom_scattered_balls_slide1.png' });
  console.log('Screenshot saved: bottom_scattered_balls_slide1.png');

  // 8. Verify Hero and About are untouched
  const heroExists = await page.evaluate(() => !!document.getElementById('hero'));
  const aboutExists = await page.evaluate(() => !!document.getElementById('about'));
  console.log('Hero intact:', heroExists, '| About intact:', aboutExists);

  await browser.close();
}

verify().catch(console.error);
