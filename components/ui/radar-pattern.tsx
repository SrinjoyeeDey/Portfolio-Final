import React from 'react';

export interface RadarPatternProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  themeColor?: string;
}

export const RadarPattern: React.FC<RadarPatternProps> = ({
  className = '',
  themeColor = '#FFBD12',
  ...props
}) => {
  return (
    <div className={`radar-pattern-wrapper ${className}`} {...props}>
      <div className="radar-pattern">
        <div className="radar-crosshair-x" />
        <div className="radar-crosshair-y" />
        <div className="radar-center" />
        <div className="radar-blip blip-1" />
        <div className="radar-blip blip-2" />
        <div className="radar-blip blip-3" />
        <div className="radar-hud-tag-tl">SCAN: SECTOR-07 [ACTIVE]</div>
        <div className="radar-hud-tag-tr">AZ: 360° // 9.4 GHz</div>
      </div>
      <style>{`
        .radar-pattern-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background-color: #08080A;
          border-radius: 20px;
        }

        .radar-pattern {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          background-color: #08080A;
          background-image: 
            linear-gradient(rgba(255, 189, 18, 0.16) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 189, 18, 0.16) 1px, transparent 1px);
          background-size: 3em 3em;
          background-position: center center;
          overflow: hidden;
          pointer-events: none;
        }

        .radar-pattern::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 150vw;
          height: 150vh;
          transform: translate(-50%, -50%);
          background: repeating-radial-gradient(
            circle at 50% 50%,
            transparent 0,
            transparent 2.85em,
            rgba(255, 189, 18, 0.28) 2.9em,
            rgba(255, 220, 80, 0.55) 2.95em,
            transparent 3.05em
          );
          z-index: 1;
        }

        .radar-pattern::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 52em;
          height: 52em;
          margin-top: -26em;
          margin-left: -26em;
          border-radius: 50%;
          background: conic-gradient(
            from 0deg,
            transparent 65%,
            rgba(255, 189, 18, 0.08) 75%,
            rgba(255, 189, 18, 0.25) 88%,
            rgba(255, 189, 18, 0.55) 96%,
            rgba(255, 245, 160, 0.95) 100%
          );
          animation: radar-spin 4s linear infinite;
          z-index: 2;
          filter: drop-shadow(0 0 14px rgba(255, 189, 18, 0.65));
        }

        .radar-crosshair-x {
          position: absolute;
          top: 50%;
          left: 0;
          width: 100%;
          height: 1px;
          background: repeating-linear-gradient(90deg, rgba(255, 189, 18, 0.45) 0, rgba(255, 189, 18, 0.45) 4px, transparent 4px, transparent 8px);
          z-index: 1;
        }

        .radar-crosshair-y {
          position: absolute;
          top: 0;
          left: 50%;
          width: 1px;
          height: 100%;
          background: repeating-linear-gradient(0deg, rgba(255, 189, 18, 0.45) 0, rgba(255, 189, 18, 0.45) 4px, transparent 4px, transparent 8px);
          z-index: 1;
        }

        .radar-center {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 12px;
          height: 12px;
          transform: translate(-50%, -50%);
          background-color: ${themeColor};
          border: 2px solid #FFFFFF;
          border-radius: 50%;
          z-index: 3;
          animation: pulse-dot 2s ease-in-out infinite;
        }

        .radar-blip {
          position: absolute;
          width: 9px;
          height: 9px;
          border-radius: 50%;
          z-index: 3;
          animation: radar-blip-pulse 4s ease-out infinite;
        }

        .radar-blip.blip-1 {
          top: 32%;
          left: 68%;
          background: #22C55E;
          box-shadow: 0 0 10px #22C55E;
          animation-delay: 0.5s;
        }

        .radar-blip.blip-2 {
          top: 66%;
          left: 35%;
          background: ${themeColor};
          box-shadow: 0 0 10px rgba(255, 189, 18, 0.9);
          animation-delay: 2.3s;
        }

        .radar-blip.blip-3 {
          top: 42%;
          left: 22%;
          background: #38BDF8;
          box-shadow: 0 0 10px #38BDF8;
          animation-delay: 3.1s;
        }

        .radar-hud-tag-tl,
        .radar-hud-tag-tr {
          position: absolute;
          font-family: monospace;
          font-size: 0.68rem;
          font-weight: 800;
          color: rgba(255, 189, 18, 0.85);
          letter-spacing: 0.8px;
          z-index: 3;
        }

        .radar-hud-tag-tl { top: 8px; left: 16px; }
        .radar-hud-tag-tr { top: 8px; right: 16px; }

        @keyframes radar-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes pulse-dot {
          0%, 100% {
            box-shadow: 0 0 0.8em 0.3em rgba(255, 189, 18, 0.85);
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            box-shadow: 0 0 2em 0.8em rgba(255, 220, 80, 1);
            transform: translate(-50%, -50%) scale(1.3);
          }
        }

        @keyframes radar-blip-pulse {
          0%, 65% { opacity: 0.15; transform: scale(0.85); }
          75% { opacity: 1; transform: scale(1.6); }
          85% { opacity: 0.9; transform: scale(1.1); }
          100% { opacity: 0.2; transform: scale(0.9); }
        }
      `}</style>
    </div>
  );
};

export default RadarPattern;
