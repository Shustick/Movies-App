import React from 'react';
import './SearchPanel.css';
import { Col, Input } from 'antd';

const SearchPanel = ({ handleOnSetFilms }) => {
  async function getFilms(query) {
    if (!query.trim()) return;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMjg1ZjE2YTE0NjI2NGFmNzc4MzhiMjY5MDQ2NjU3ZCIsIm5iZiI6MTc0MTg2MjUzMy41MTcsInN1YiI6IjY3ZDJiNjg1YTk3YzY0NmNiNTgxMWZiYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.7-BBckPCTVMd_KbMUvnFiCIynLwvvwPfuPCfcLaavqk',
      },
    };
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`,
      options
    );
    const result = await res.json();
    handleOnSetFilms(result.results);
  }

  const debounce = (fn, debounceTime) => {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), debounceTime);
    };
  };

  const debouncedSearch = debounce(getFilms, 400);

  const onSearch = (ev) => {
    const value = ev.target.value;
    debouncedSearch(value);
  };

  return (
    <Col span={23} style={{ padding: 0, maxWidth: 938 }}>
      <Input placeholder="Type to search..." className="input" onChange={onSearch} onPressEnter={onSearch} />
    </Col>
  );
};

export default SearchPanel;
