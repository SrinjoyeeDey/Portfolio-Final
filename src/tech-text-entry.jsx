import React from 'react';
import { createRoot } from 'react-dom/client';
import TechText from './TechText';

export function TechTextHackathon() {
  return (
    <div style={{ width: '220px', height: '46px', position: 'relative' }}>
      <TechText
        text="HACKATHON"
        fontFamily="'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"
        fontWeight={900}
        fontSize={30}
        letterSpacing={0.06}
        color="#ffffff"
        accentColor="#ffffff"
        align="center"
        reveal="letter"
        dashLength={4}
        dashGap={2}
        strokeWidth={1.5}
        specks={14}
        selection={true}
        labels={true}
        draggable={true}
        clickKick={true}
        intro="none"
        sweep={true}
        speed={0.8}
        reach={100}
      />
    </div>
  );
}

export function TechTextLeftDesc() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', width: '100%' }}>
      <div style={{ width: '100%', height: '24px', position: 'relative' }}>
        <TechText
          text="This day is often considered the peak"
          fontFamily="'Plus Jakarta Sans', sans-serif"
          fontWeight={800}
          fontSize={15}
          color="#ffffff"
          accentColor="#ffffff"
          align="left"
          reveal="letter"
          specks={6}
          selection={true}
          labels={false}
          draggable={true}
          clickKick={true}
          sweep={false}
          reach={80}
        />
      </div>
      <div style={{ width: '100%', height: '24px', position: 'relative' }}>
        <TechText
          text="of the build sprint which brings a"
          fontFamily="'Plus Jakarta Sans', sans-serif"
          fontWeight={800}
          fontSize={15}
          color="#ffffff"
          accentColor="#ffffff"
          align="left"
          reveal="letter"
          specks={6}
          selection={true}
          labels={false}
          draggable={true}
          clickKick={true}
          sweep={false}
          reach={80}
        />
      </div>
      <div style={{ width: '100%', height: '24px', position: 'relative' }}>
        <TechText
          text="hyper-focused atmosphere."
          fontFamily="'Plus Jakarta Sans', sans-serif"
          fontWeight={800}
          fontSize={15}
          color="#ffffff"
          accentColor="#ffffff"
          align="left"
          reveal="letter"
          specks={6}
          selection={true}
          labels={false}
          draggable={true}
          clickKick={true}
          sweep={false}
          reach={80}
        />
      </div>
    </div>
  );
}

export function TechTextSrinjoyee() {
  return (
    <div style={{ width: '100%', height: '56px', position: 'relative' }}>
      <TechText
        text="SRINJOYEE"
        fontFamily="'Plus Jakarta Sans', 'Syne', sans-serif"
        fontWeight={900}
        fontSize={46}
        letterSpacing={0.01}
        color="#ffffff"
        accentColor="#FFBD12"
        align="left"
        reveal="letter"
        dashLength={4}
        dashGap={2}
        strokeWidth={1.5}
        specks={16}
        selection={true}
        labels={true}
        draggable={true}
        clickKick={true}
        intro="none"
        sweep={true}
        speed={0.7}
        reach={130}
      />
    </div>
  );
}

export function TechTextRightQuote() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', width: '100%' }}>
      <div style={{ width: '100%', height: '24px', position: 'relative' }}>
        <TechText
          text="Don't think about heavy"
          fontFamily="'Plus Jakarta Sans', sans-serif"
          fontWeight={800}
          fontSize={16}
          color="#ffffff"
          accentColor="#ffffff"
          align="left"
          reveal="letter"
          specks={6}
          selection={true}
          labels={false}
          draggable={true}
          clickKick={true}
          sweep={false}
          reach={80}
        />
      </div>
      <div style={{ width: '100%', height: '24px', position: 'relative' }}>
        <TechText
          text="things, just follow your"
          fontFamily="'Plus Jakarta Sans', sans-serif"
          fontWeight={800}
          fontSize={16}
          color="#ffffff"
          accentColor="#ffffff"
          align="left"
          reveal="letter"
          specks={6}
          selection={true}
          labels={false}
          draggable={true}
          clickKick={true}
          sweep={false}
          reach={80}
        />
      </div>
      <div style={{ width: '100%', height: '24px', position: 'relative' }}>
        <TechText
          text="predetermined path."
          fontFamily="'Plus Jakarta Sans', sans-serif"
          fontWeight={800}
          fontSize={16}
          color="#ffffff"
          accentColor="#ffffff"
          align="left"
          reveal="letter"
          specks={6}
          selection={true}
          labels={false}
          draggable={true}
          clickKick={true}
          sweep={false}
          reach={80}
        />
      </div>
    </div>
  );
}

export function initTechText() {
  const mount = (id, Component) => {
    const el = document.getElementById(id);
    if (el) {
      const root = createRoot(el);
      root.render(<Component />);
    }
  };

  mount('tech-text-hackathon', TechTextHackathon);
  mount('tech-text-left-desc', TechTextLeftDesc);
  mount('tech-text-srinjoyee', TechTextSrinjoyee);
  mount('tech-text-right-quote', TechTextRightQuote);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTechText);
} else {
  initTechText();
}
