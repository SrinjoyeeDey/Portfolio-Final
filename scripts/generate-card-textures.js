const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

async function generateTextures() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Read hero portrait as base64 for embedding in the card
  const portraitPath = path.resolve(__dirname, '../images/hero-portrait.png');
  const portraitBase64 = fs.existsSync(portraitPath) 
    ? `data:image/png;base64,${fs.readFileSync(portraitPath).toString('base64')}`
    : '';

  // 1. Generate Front Card (1024 x 1440)
  await page.setViewport({ width: 1024, height: 1440, deviceScaleFactor: 1 });
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&family=Fredoka:wght@600;700&family=Space+Mono:wght@700&display=swap" rel="stylesheet">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          width: 1024px;
          height: 1440px;
          background: #0f1013;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #f4f4f5;
          overflow: hidden;
          position: relative;
        }
        /* Top clip hole area guide */
        .slot-hole {
          position: absolute;
          top: 36px;
          left: 50%;
          transform: translateX(-50%);
          width: 220px;
          height: 48px;
          border-radius: 24px;
          background: rgba(0, 0, 0, 0.45);
          border: 2px dashed rgba(255, 189, 18, 0.4);
        }
        .card-inner {
          padding: 100px 60px 60px 60px;
          height: 100%;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        /* Tech Grid Background Overlay */
        .grid-bg {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(255, 189, 18, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 189, 18, 0.05) 1px, transparent 1px);
          background-size: 32px 32px;
          pointer-events: none;
        }
        .glow-orb {
          position: absolute;
          top: -100px;
          right: -100px;
          width: 450px;
          height: 450px;
          background: radial-gradient(circle, rgba(255, 189, 18, 0.22) 0%, transparent 70%);
          pointer-events: none;
        }
        /* Header Bar */
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          position: relative;
          z-index: 2;
        }
        .header-logo {
          font-family: 'Fredoka', sans-serif;
          font-size: 44px;
          font-weight: 700;
          color: #fff;
          letter-spacing: -1px;
        }
        .header-logo span { color: #FFBD12; }
        .access-badge {
          background: #FFBD12;
          color: #111114;
          font-weight: 900;
          font-size: 20px;
          padding: 8px 24px;
          border-radius: 999px;
          letter-spacing: 2px;
          text-transform: uppercase;
          box-shadow: 0 4px 18px rgba(255, 189, 18, 0.4);
        }
        /* Smart Chip & RFID */
        .chip-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 36px;
          position: relative;
          z-index: 2;
        }
        .gold-chip {
          width: 96px;
          height: 74px;
          background: linear-gradient(135deg, #fce075 0%, #d49f2b 50%, #f7d668 100%);
          border-radius: 14px;
          border: 2px solid #b8861e;
          position: relative;
          box-shadow: 0 6px 14px rgba(0,0,0,0.4);
        }
        .gold-chip::before {
          content: "";
          position: absolute;
          inset: 8px;
          border: 1.5px solid #8c6310;
          border-radius: 8px;
        }
        .gold-chip::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1.5px;
          background: #8c6310;
        }
        .rfid-icon {
          font-family: 'Space Mono', monospace;
          font-size: 20px;
          color: rgba(255, 255, 255, 0.6);
          letter-spacing: 1.5px;
        }
        /* Portrait Area */
        .portrait-frame {
          width: 100%;
          height: 480px;
          border-radius: 28px;
          background: #18191e;
          border: 3px solid #27272a;
          overflow: hidden;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 20px 40px rgba(0,0,0,0.5), inset 0 0 40px rgba(0,0,0,0.6);
          margin-bottom: 40px;
        }
        .portrait-frame img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 15%;
        }
        .portrait-tag {
          position: absolute;
          bottom: 18px;
          left: 20px;
          background: rgba(15, 16, 19, 0.85);
          backdrop-filter: blur(12px);
          border: 1.5px solid rgba(255, 189, 18, 0.4);
          padding: 8px 18px;
          border-radius: 12px;
          font-family: 'Space Mono', monospace;
          font-size: 16px;
          color: #FFBD12;
          font-weight: 700;
        }
        /* Identity Info */
        .identity-block {
          position: relative;
          z-index: 2;
          margin-bottom: auto;
        }
        .person-name {
          font-size: 56px;
          font-weight: 900;
          letter-spacing: -1.5px;
          line-height: 1.05;
          color: #ffffff;
          margin-bottom: 10px;
          text-transform: uppercase;
        }
        .person-role {
          font-size: 24px;
          font-weight: 700;
          color: #FFBD12;
          letter-spacing: 0.5px;
          margin-bottom: 14px;
        }
        .specs-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          background: rgba(24, 25, 30, 0.8);
          border: 1.5px solid #27272a;
          border-radius: 18px;
          padding: 18px 24px;
        }
        .spec-item {
          display: flex;
          flex-direction: column;
        }
        .spec-label {
          font-family: 'Space Mono', monospace;
          font-size: 13px;
          color: #71717a;
          letter-spacing: 1px;
          margin-bottom: 4px;
        }
        .spec-val {
          font-size: 18px;
          font-weight: 700;
          color: #e4e4e7;
        }
        /* Footer Barcode */
        .card-footer {
          margin-top: 30px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1.5px solid #27272a;
          padding-top: 24px;
          position: relative;
          z-index: 2;
        }
        .barcode-wrap {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .barcode-lines {
          display: flex;
          gap: 4px;
          height: 48px;
          align-items: stretch;
        }
        .b-line {
          background: #f4f4f5;
          border-radius: 1px;
        }
        .barcode-text {
          font-family: 'Space Mono', monospace;
          font-size: 13px;
          letter-spacing: 4px;
          color: #71717a;
        }
        .hologram-seal {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: conic-gradient(from 180deg, #FFBD12, #ff7b00, #a855f7, #3b82f6, #10b981, #FFBD12);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 16px rgba(0,0,0,0.5);
          position: relative;
        }
        .hologram-seal::before {
          content: "PORTO";
          font-family: 'Fredoka', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #111114;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 50%;
          width: 58px;
          height: 58px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      </style>
    </head>
    <body>
      <div class="grid-bg"></div>
      <div class="glow-orb"></div>
      <div class="slot-hole"></div>
      
      <div class="card-inner">
        <div class="card-header">
          <div class="header-logo">PORTO<span>.</span></div>
          <div class="access-badge">ALL ACCESS</div>
        </div>

        <div class="chip-row">
          <div class="gold-chip"></div>
          <div class="rfid-icon">NFC /// RFID ACTIVE</div>
        </div>

        <div class="portrait-frame">
          ${portraitBase64 ? `<img src="${portraitBase64}" alt="Portrait">` : ''}
          <div class="portrait-tag">SEC_ID // 2026_09</div>
        </div>

        <div class="identity-block">
          <div class="person-name">SRINJOYEE DEY</div>
          <div class="person-role">Creative Technologist & AI Developer</div>
          <div class="specs-grid">
            <div class="spec-item">
              <span class="spec-label">BADGE ID</span>
              <span class="spec-val">SD-2026-VIP</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">DEPARTMENT</span>
              <span class="spec-val">Creative Intelligence</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">STATUS</span>
              <span class="spec-val">ACTIVE COLLAB</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">CLEARANCE</span>
              <span class="spec-val">LEVEL 05 (PRO)</span>
            </div>
          </div>
        </div>

        <div class="card-footer">
          <div class="barcode-wrap">
            <div class="barcode-lines">
              <div class="b-line" style="width: 5px;"></div>
              <div class="b-line" style="width: 2px;"></div>
              <div class="b-line" style="width: 7px;"></div>
              <div class="b-line" style="width: 3px;"></div>
              <div class="b-line" style="width: 1px;"></div>
              <div class="b-line" style="width: 6px;"></div>
              <div class="b-line" style="width: 2px;"></div>
              <div class="b-line" style="width: 8px;"></div>
              <div class="b-line" style="width: 3px;"></div>
              <div class="b-line" style="width: 2px;"></div>
              <div class="b-line" style="width: 5px;"></div>
              <div class="b-line" style="width: 9px;"></div>
              <div class="b-line" style="width: 2px;"></div>
              <div class="b-line" style="width: 4px;"></div>
              <div class="b-line" style="width: 7px;"></div>
              <div class="b-line" style="width: 2px;"></div>
              <div class="b-line" style="width: 5px;"></div>
              <div class="b-line" style="width: 3px;"></div>
              <div class="b-line" style="width: 6px;"></div>
            </div>
            <div class="barcode-text">0924 8839 2026 SD</div>
          </div>
          <div class="hologram-seal"></div>
        </div>
      </div>
    </body>
    </html>
  `);

  const frontBuffer = await page.screenshot({ type: 'png' });
  const frontDest = path.resolve(__dirname, '../images/card-front.png');
  fs.writeFileSync(frontDest, frontBuffer);
  console.log('Generated images/card-front.png');

  // 2. Generate Back Card (1024 x 1440)
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&family=Fredoka:wght@600;700&family=Space+Mono:wght@700&family=Caveat:wght@700&display=swap" rel="stylesheet">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          width: 1024px;
          height: 1440px;
          background: #111216;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #f4f4f5;
          overflow: hidden;
          position: relative;
        }
        .mag-stripe {
          position: absolute;
          top: 110px;
          left: 0;
          right: 0;
          height: 140px;
          background: #090a0c;
          border-top: 2px solid #27272a;
          border-bottom: 2px solid #27272a;
        }
        .holo-strip {
          position: absolute;
          top: 290px;
          left: 60px;
          right: 60px;
          height: 38px;
          border-radius: 8px;
          background: linear-gradient(90deg, 
            rgba(255, 189, 18, 0.6) 0%, 
            rgba(236, 72, 153, 0.6) 25%, 
            rgba(59, 130, 246, 0.6) 50%, 
            rgba(16, 185, 129, 0.6) 75%, 
            rgba(255, 189, 18, 0.6) 100%
          );
          opacity: 0.85;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        .card-inner {
          padding: 370px 60px 60px 60px;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .terms-box {
          background: rgba(24, 25, 30, 0.7);
          border: 1.5px solid #27272a;
          border-radius: 20px;
          padding: 30px 32px;
          margin-bottom: 40px;
          font-size: 17px;
          line-height: 1.6;
          color: #a1a1aa;
        }
        .terms-box strong { color: #FFBD12; }
        .sig-row {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 50px;
        }
        .sig-box {
          flex: 1;
          height: 110px;
          background: #fafaf9;
          border-radius: 16px;
          padding: 12px 24px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border: 2px solid #e4e4e7;
        }
        .sig-label {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          color: #71717a;
          letter-spacing: 1px;
        }
        .signature {
          font-family: 'Caveat', cursive;
          font-size: 52px;
          color: #18181b;
          font-weight: 700;
          line-height: 1;
        }
        .stamp-box {
          width: 130px;
          height: 110px;
          border: 2px dashed #FFBD12;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #FFBD12;
          font-family: 'Space Mono', monospace;
          font-size: 14px;
          font-weight: 700;
          text-align: center;
          padding: 8px;
        }
        .contact-card {
          margin-top: auto;
          background: #18191e;
          border: 1.5px solid #27272a;
          border-radius: 20px;
          padding: 26px 32px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .contact-item {
          display: flex;
          justify-content: space-between;
          font-size: 18px;
        }
        .contact-item span:first-child { color: #71717a; font-family: 'Space Mono', monospace; font-size: 14px; }
        .contact-item span:last-child { color: #f4f4f5; font-weight: 700; }
        .brand-big {
          text-align: center;
          margin-top: 36px;
          font-family: 'Fredoka', sans-serif;
          font-size: 32px;
          font-weight: 700;
          letter-spacing: 6px;
          color: rgba(255, 255, 255, 0.25);
        }
      </style>
    </head>
    <body>
      <div class="mag-stripe"></div>
      <div class="holo-strip"></div>

      <div class="card-inner">
        <div class="terms-box">
          <strong>OFFICIAL PASS // SRINJOYEE DEY</strong><br>
          This credential certifies verified clearance to creative engineering, AI agents, full-stack systems, and design laboratories. If found, please return via contact channels below or invite for high-impact collaborations.
        </div>

        <div class="sig-row">
          <div class="sig-box">
            <span class="sig-label">AUTHORIZED HOLDER SIGNATURE</span>
            <span class="signature">Srinjoyee Dey</span>
          </div>
          <div class="stamp-box">
            <span>VERIFIED</span>
            <span style="font-size: 20px; margin-top: 4px;">★ 2026 ★</span>
          </div>
        </div>

        <div class="contact-card">
          <div class="contact-item">
            <span>DIRECT MAIL</span>
            <span>deysrinjoyee28@gmail.com</span>
          </div>
          <div class="contact-item">
            <span>GITHUB</span>
            <span>github.com/SrinjoyeeDey</span>
          </div>
          <div class="contact-item">
            <span>PORTFOLIO</span>
            <span>porto.dev/srinjoyee</span>
          </div>
        </div>

        <div class="brand-big">PORTO CREATIVE SYSTEM</div>
      </div>
    </body>
    </html>
  `);

  const backBuffer = await page.screenshot({ type: 'png' });
  const backDest = path.resolve(__dirname, '../images/card-back.png');
  fs.writeFileSync(backDest, backBuffer);
  console.log('Generated images/card-back.png');

  // 3. Generate Strap Band Texture (1024 x 192 - Wide image as required by React Bits)
  await page.setViewport({ width: 1024, height: 192, deviceScaleFactor: 1 });
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@700&family=Fredoka:wght@700&display=swap" rel="stylesheet">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          width: 1024px;
          height: 192px;
          background: #111114;
          overflow: hidden;
          position: relative;
          border-top: 10px solid #FFBD12;
          border-bottom: 10px solid #FFBD12;
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding: 0 20px;
        }
        .band-text {
          font-family: 'Space Mono', monospace;
          color: #ffffff;
          font-size: 34px;
          font-weight: 700;
          letter-spacing: 5px;
          display: flex;
          align-items: center;
          gap: 24px;
          white-space: nowrap;
        }
        .band-star {
          color: #FFBD12;
          font-size: 36px;
        }
      </style>
    </head>
    <body>
      <div class="band-text">
        <span class="band-star">★</span>
        <span>SRINJOYEE DEY</span>
        <span class="band-star">★</span>
        <span style="color:#FFBD12">PORTO CREATIVE</span>
        <span class="band-star">★</span>
        <span>AI & TECH</span>
        <span class="band-star">★</span>
        <span>SRINJOYEE</span>
        <span class="band-star">★</span>
      </div>
    </body>
    </html>
  `);

  const bandBuffer = await page.screenshot({ type: 'png' });
  const bandDest = path.resolve(__dirname, '../images/card-band.png');
  fs.writeFileSync(bandDest, bandBuffer);
  console.log('Generated images/card-band.png (horizontal 1024x192)');

  await browser.close();
  console.log('All lanyard badge textures successfully generated!');
}

generateTextures().catch(console.error);
