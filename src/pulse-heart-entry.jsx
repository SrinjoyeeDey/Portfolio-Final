import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import PulseHeart from './PulseHeart';

const INITIAL_COUNT = 0;
const STORAGE_KEY_LIKED = 'sd_pulse_heart_liked_v2';
const STORAGE_KEY_COUNT = 'sd_pulse_heart_count_v2';

function PulseHeartWidget() {
  const [liked, setLiked] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_LIKED) === 'true';
    } catch {
      return false;
    }
  });

  const [count, setCount] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_COUNT);
      if (stored === null) return INITIAL_COUNT;
      const parsed = Number.parseInt(stored, 10);
      return Number.isFinite(parsed) && parsed >= 0 ? parsed : INITIAL_COUNT;
    } catch {
      return INITIAL_COUNT;
    }
  });

  const handleChange = (nextLiked, nextCount) => {
    const safeCount = Math.max(0, nextCount);
    setLiked(nextLiked);
    setCount(safeCount);
    try {
      localStorage.setItem(STORAGE_KEY_LIKED, String(nextLiked));
      localStorage.setItem(STORAGE_KEY_COUNT, String(safeCount));
    } catch {}
  };

  return (
    <PulseHeart
      count={count}
      liked={liked}
      onChange={handleChange}
      showCount={true}
      icon="heart"
      idleOutline={true}
      size={20}
      corner={32}
      likedColor="#ff4d6d"
      idleColor="#64748b"
      pillColor="rgba(255, 255, 255, 0.92)"
      textColor="#222428"
      duration={560}
      dotSize={0.3}
      overshoot={1.7}
      beat={3}
      rollDuration={350}
      label="Likes"
      className="nav-pulse-heart-btn"
    />
  );
}

function initPulseHeart() {
  const mountPoint = document.getElementById('nav-pulse-heart-root');
  if (!mountPoint) return;
  const root = ReactDOM.createRoot(mountPoint);
  root.render(<PulseHeartWidget />);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPulseHeart);
} else {
  initPulseHeart();
}

