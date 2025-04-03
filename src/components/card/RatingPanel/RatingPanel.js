import React, { useState } from 'react';
import './RatingPanel.css';
import { Rate, ConfigProvider } from 'antd';

import { setRatedMovieApi, deleteRatedMovie } from '../../../api/moviesApi';

const RatingPanel = ({ movieId }) => {
  const [rating, setRating] = useState(() => {
    return JSON.parse(localStorage.getItem(movieId)) || 0;
  });

  const rateMovie = (value) => {
    localStorage.setItem(movieId, JSON.stringify(value));
    setRating(localStorage.getItem(movieId));

    if (value === 0) {
      deleteRatedMovie(String(movieId));
      localStorage.removeItem(String(movieId));
    } else {
      setRatedMovieApi(value, String(movieId));
    }
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Rate: {
            starSize: 15,
          },
        },
      }}
    >
      <Rate className="rate" count={10} allowClear allowHalf onChange={rateMovie} value={Number(rating) || 0} />
    </ConfigProvider>
  );
};

export default RatingPanel;
