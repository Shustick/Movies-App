import React, { useState } from 'react';
import './Description.css';

const Description = ({ film }) => {
  const [expandedFilms, setExpandedFilms] = useState({});
  const { truncated, isTruncated } = truncateText(film.overview);

  function toggleExpand(id) {
    setExpandedFilms((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  function truncateText(text, maxLength = 150) {
    if (!text) return { truncated: '', isTruncated: false };
    if (text.length <= maxLength) return { truncated: text, isTruncated: false };

    let truncated = text.slice(0, maxLength);
    let lastSpace = truncated.lastIndexOf(' ');
    truncated = lastSpace !== -1 ? truncated.slice(0, lastSpace) : truncated;

    return { truncated, isTruncated: true };
  }
  return (
    <p>
      {expandedFilms[film.id] ? film.overview : truncated}
      {isTruncated && (
        <button className="showMoreBtn" onClick={() => toggleExpand(film.id)}>
          {expandedFilms[film.id] ? 'hide' : ' ...'}
        </button>
      )}
    </p>
  );
};

export default Description;
