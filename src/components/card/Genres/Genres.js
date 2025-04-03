import React, { useState, useEffect } from 'react';
import './Genres.css';

import { getGenres } from '../../../api/moviesApi';

const Genres = ({ currentGenres }) => {
  const [AllGenres, setGenres] = useState([]);

  useEffect(() => {
    async function getGenreNames() {
      const res = await getGenres();
      setGenres(res.genres);
    }
    getGenreNames();
  }, []);

  if (!AllGenres.length) return <div>Loading genres...</div>;

  const genresElements = currentGenres.map((genre) => {
    const foundGenre = AllGenres.find((rightGenre) => rightGenre.id === genre);
    return (
      <span className="genre" key={genre}>
        {foundGenre ? foundGenre.name : 'Unknown'}
      </span>
    );
  });

  return <div className="genres">{genresElements}</div>;
};

export default Genres;
