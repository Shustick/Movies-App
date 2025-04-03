import React, { useState, useEffect } from 'react';
import './Cards.css';
import { Card, Col, Flex, Spin } from 'antd';
import { format } from 'date-fns';

import { debouncedGetPopularFilms, debouncedGetRatedMovie } from '../../api/moviesApi';
import poster from '../../assets/noPoster.png';

import Rating from './Rating';
import Genres from './Genres';
import RatingPanel from './RatingPanel';
import Description from './Description';

const Cards = ({
  activeTab,
  searchedFilms,
  isLoading,
  handleIsLoading,
  hasError,
  handleHasError,
  currentPage,
  handleTotalRatedFilms,
  currentPageRatedFilms,
}) => {
  const [films, setFilms] = useState([]);
  const [popularFilms, setPopularFilms] = useState([]);
  const [loadingImages, setLoadingImages] = useState({});

  function handleImageLoad(id) {
    setLoadingImages((prev) => ({ ...prev, [id]: false }));
  }

  useEffect(() => {
    async function fetchPopularFilms() {
      try {
        handleIsLoading(true);

        const data = await debouncedGetPopularFilms(currentPage);
        if (!data.results) {
          handleHasError(`Status: ${data.status} `);
          setPopularFilms([]);
          throw new Error(`No results found. Status: ${data.status}`);
        } else {
          setPopularFilms(data.results);

          const initialLoadingState = data.results.reduce((acc, film) => {
            acc[film.id] = true;
            return acc;
          }, {});
          setLoadingImages(initialLoadingState);

          handleIsLoading(false);
        }
      } catch (err) {
        handleHasError(err.message);
      }
    }
    if (searchedFilms.length) return;

    fetchPopularFilms();
  }, [currentPage]);

  useEffect(() => {
    async function fetchRatedFilms() {
      handleIsLoading(true);

      const data = await debouncedGetRatedMovie(currentPageRatedFilms);

      if (!data.results) {
        handleHasError(`Rated movies not found. You probably haven't rated any movie yet. Status: ${data.status} `);
      } else {
        handleHasError(false);
        handleIsLoading(false);
        handleTotalRatedFilms(data.total_results);
        setFilms(data.results);
      }
    }
    if (activeTab === 'rated') {
      handleHasError(false);
      fetchRatedFilms();
    } else if (activeTab === 'search' && popularFilms.length && !searchedFilms.length) {
      handleHasError(false);
      handleIsLoading(false);
      setFilms(popularFilms);
    } else if (activeTab === 'search' && searchedFilms.length) {
      handleHasError(false);
      handleIsLoading(false);
      setFilms(searchedFilms);
    }
  }, [activeTab, popularFilms, currentPageRatedFilms]);

  useEffect(() => {
    if (searchedFilms.length) {
      setFilms(searchedFilms);
      handleIsLoading(false);

      const initialLoadingState = searchedFilms.reduce((acc, film) => {
        acc[film.id] = true;
        return acc;
      }, {});
      setLoadingImages(initialLoadingState);
    }
  }, [searchedFilms]);

  if (!isLoading) {
    return films.map((film) => {
      return (
        <Col key={film.id} span={11} style={{ padding: 0, maxWidth: 450 }}>
          <Card className="card" styles={{ body: { padding: 0 } }}>
            <Flex>
              {loadingImages[film.id] && (
                <div className="image-spin-container">
                  <Spin size="small" className="image-spin" />
                </div>
              )}
              <img
                className="image"
                onLoad={() => handleImageLoad(film.id)}
                alt={film.title}
                src={film.poster_path ? `https://image.tmdb.org/t/p/w500${film.poster_path}` : poster}
              />

              <Flex className="descriptions">
                <Flex className="container-title">
                  <h1 className="title">{film.title}</h1>
                  <Rating currentRating={film.vote_average} />
                </Flex>
                <p className="date">
                  {film.release_date ? format(new Date(film.release_date), 'MMMM d, yyyy') : 'Unknown release date'}
                </p>
                <Genres currentGenres={film.genre_ids} />
                <Description film={film} />
                <RatingPanel movieId={film.id} isLoading={isLoading} />
              </Flex>
            </Flex>
          </Card>
        </Col>
      );
    });
  } else if (isLoading && !hasError) {
    return (
      <Col span={24} className="spin-container">
        <Spin size="large" className="spin" />
      </Col>
    );
  }
};

export default Cards;
