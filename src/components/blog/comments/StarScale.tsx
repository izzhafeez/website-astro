import React from 'react';

// star scale from 1 to 5 that the user can click to rate
type StarScaleProps = {
  value: number;
  hook: (value: number) => void;
};
const StarScale = ({ value, hook }: StarScaleProps) => {
  const stars = [1, 2, 3, 4, 5];
  const fullStar = '★';
  const emptyStar = '☆';
  return (
    <div>
      {stars.map((star) => {
        const icon = star <= value ? fullStar : emptyStar;
        return (
          <span
            key={star}
            onClick={() => hook(star)}
            className='cursor-pointer hover:text-ew-500'
          >
            {icon}
          </span>
        );
      })}
    </div>
  );
}

export default StarScale;