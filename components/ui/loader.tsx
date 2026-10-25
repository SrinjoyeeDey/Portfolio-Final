import React from 'react';

interface LoaderProps {
  percentage?: number;
  statusText?: string;
}

export const Loader: React.FC<LoaderProps> = ({ 
  percentage, 
  statusText = 'INITIALIZING STUDIO...' 
}) => {
  return (
    <div className="boxes-loader-wrapper flex flex-col items-center gap-4">
      <div className="boxes">
        <div className="box">
          <div />
          <div />
          <div />
          <div />
        </div>
        <div className="box">
          <div />
          <div />
          <div />
          <div />
        </div>
        <div className="box">
          <div />
          <div />
          <div />
          <div />
        </div>
        <div className="box">
          <div />
          <div />
          <div />
          <div />
        </div>
      </div>
      
      {percentage !== undefined && (
        <div className="loader-status-container flex flex-col items-center gap-2 mt-4">
          <div className="loader-percentage-display text-3xl font-black text-neutral-800">
            <span className="loader-percentage-num">{Math.min(100, Math.max(0, percentage))}</span>
            <span className="loader-percentage-symbol text-[#E5A80A] text-lg">%</span>
          </div>
          <div className="loader-progress-track w-56 h-2 bg-neutral-200 border border-neutral-800 rounded-full overflow-hidden">
            <div 
              className="loader-progress-bar h-full bg-gradient-to-r from-[#FFBD12] to-[#FFAA00] transition-all duration-150"
              style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
            />
          </div>
          <span className="loader-section-tag text-xs font-bold bg-[#FFBD12] px-3 py-1 rounded-full border border-neutral-800 text-neutral-800 uppercase tracking-wider">
            {statusText}
          </span>
        </div>
      )}
    </div>
  );
};

export default Loader;
