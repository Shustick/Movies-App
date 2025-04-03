import React from 'react';
import './Rating.css';

const Rating = ({ currentRating }) => {
  const truncatedRating = currentRating.toFixed(1);
  let ratingColor = '';

  switch (true) {
    case truncatedRating < 3:
      ratingColor = 'red-rating';
      break;
    case truncatedRating >= 3 && truncatedRating < 5:
      ratingColor = 'orange-rating';
      break;
    case truncatedRating >= 5 && truncatedRating < 7:
      ratingColor = 'yellow-rating';
      break;
    case truncatedRating >= 7:
      ratingColor = 'green-rating';
      break;
    default:
      ratingColor = '';
  }

  return (
    <div className={`current-rating ${ratingColor}`}>
      <span>{truncatedRating}</span>
    </div>
  );
};

export default Rating;
