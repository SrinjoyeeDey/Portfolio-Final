import React from 'react';

interface CardProps {
  title?: string;
  description?: string;
  date?: string;
  month?: string;
  category?: string;
  onSeeMore?: () => void;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  title = '3D Card',
  description = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
  date = '29',
  month = 'JUNE',
  onSeeMore,
  className = '',
}) => {
  return (
    <div className={`card-3d-parent ${className}`}>
      <div className="card-3d">
        <div className="card-3d-content-box">
          <span className="card-3d-title">{title}</span>
          <p className="card-3d-content">{description}</p>
          <button 
            type="button" 
            className="card-3d-see-more"
            onClick={onSeeMore}
          >
            See More
          </button>
        </div>
        <div className="card-3d-date-box">
          <span className="card-3d-month">{month}</span>
          <span className="card-3d-date">{date}</span>
        </div>
      </div>
    </div>
  );
};

export default Card;
