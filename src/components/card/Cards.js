import React, { useState, useEffect } from 'react';
import './Cards.css';
import { Card, Col, Flex } from 'antd';
import { format } from 'date-fns';

import poster from '../../assets/noPoster.png';

const Cards = ({ searchedFilms }) => {
  const [films, setFilms] = useState([]);
  const [expandedFilms, setExpandedFilms] = useState({});

  async function getPopularFilms() {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMjg1ZjE2YTE0NjI2NGFmNzc4MzhiMjY5MDQ2NjU3ZCIsIm5iZiI6MTc0MTg2MjUzMy41MTcsInN1YiI6IjY3ZDJiNjg1YTk3YzY0NmNiNTgxMWZiYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.7-BBckPCTVMd_KbMUvnFiCIynLwvvwPfuPCfcLaavqk',
      },
    };
    const res = await fetch('https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1', options);
    const result = await res.json();
    setFilms(result.results);
  }

  useEffect(() => {
    getPopularFilms();
  }, []);

  useEffect(() => {
    if (searchedFilms.length) {
      setFilms(searchedFilms);
    }
  }, [searchedFilms]);

  function truncateText(text, maxLength = 170) {
    if (!text) return { truncated: '', isTruncated: false };
    if (text.length <= maxLength) return { truncated: text, isTruncated: false };

    let truncated = text.slice(0, maxLength);
    let lastSpace = truncated.lastIndexOf(' ');
    truncated = lastSpace !== -1 ? truncated.slice(0, lastSpace) : truncated;

    return { truncated, isTruncated: true };
  }

  function toggleExpand(id) {
    setExpandedFilms((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  return films.map((film) => {
    const { truncated, isTruncated } = truncateText(film.overview);
    // console.log(format(new Date(film.release_date), 'MMMM d, yyyy'));

    return (
      <Col key={film.id} span={11} style={{ padding: 0, maxWidth: 450 }}>
        <Card className="card" styles={{ body: { padding: 0 } }}>
          <Flex>
            <img
              className="image"
              alt={film.title}
              src={film.poster_path ? `https://image.tmdb.org/t/p/w500${film.poster_path}` : poster}
            />

            <Flex className="descriptions">
              <h1 className="title">{film.title}</h1>
              <p className="date">
                {film.release_date ? format(new Date(film.release_date), 'MMMM d, yyyy') : 'Unknown release date'}
              </p>
              <div className="genres">
                <span className="genre">Action</span>
                <span className="genre">Drama</span>
              </div>
              <p>
                {expandedFilms[film.id] ? film.overview : truncated}
                {isTruncated && (
                  <button className="showMoreBtn" onClick={() => toggleExpand(film.id)}>
                    {expandedFilms[film.id] ? 'hide' : ' ...'}
                  </button>
                )}
              </p>
            </Flex>
          </Flex>
        </Card>
      </Col>
    );
  });
};

export default Cards;
