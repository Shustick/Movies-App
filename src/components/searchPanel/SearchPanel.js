import React, { useEffect } from 'react';
import './SearchPanel.css';
import { Col, Input } from 'antd';

import { debouncedGetFilms } from '../../api/moviesApi';

const SearchPanel = ({
  searchValue,
  setSearchValue,
  handleOnSetFilms,
  handleIsLoading,
  handleHasError,
  currentPage,
  onChangePage,
  handleTotalResults,
  handleTitleNotExist,
}) => {
  const onSearch = async (ev) => {
    const value = ev.target.value;
    handleTitleNotExist(false);
    handleIsLoading(true);
    setSearchValue(value);
    onChangePage(1);

    try {
      const data = await debouncedGetFilms(searchValue, currentPage);
      if (data.total_results === 0) {
        handleIsLoading(false);
        handleTitleNotExist(value);
      } else {
        handleTotalResults(data.total_results);
        handleOnSetFilms(data.results);
      }
    } catch (err) {
      handleHasError(err.message);
    }
  };

  useEffect(() => {
    const searchFilmsOnPage = async () => {
      handleIsLoading(true);
      try {
        const data = await debouncedGetFilms(searchValue, currentPage);
        if (!data.results) {
          handleIsLoading(false);
          handleHasError(`Status: ${data.status} `);
          throw new Error(`No results found on this page. Status: ${data.status}`);
        } else {
          handleIsLoading(false);
          handleTotalResults(data.total_results);
          handleOnSetFilms(data.results);
        }
      } catch (err) {
        handleIsLoading(false);
        handleHasError(err.message);
      }
    };
    if (searchValue) {
      searchFilmsOnPage();
    }
  }, [currentPage]);

  return (
    <Col span={23} style={{ padding: 0, maxWidth: 938 }}>
      <Input
        placeholder="Type to search..."
        className="input"
        value={searchValue}
        onChange={onSearch}
        onPressEnter={onSearch}
      />
    </Col>
  );
};

export default SearchPanel;
