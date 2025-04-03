import React, { useState, useEffect } from 'react';
import './App.css';
import { Row, Layout, Alert } from 'antd';

import Header from '../header';
import SearchPanel from '../searchPanel';
import Cards from '../card';
import PaginationPanel from '../paginationPanel';
import { setGuestSession } from '../../api/moviesApi';

const { Content } = Layout;

export default function App() {
  const [activeTab, setActiveTab] = useState('search');
  const [searchedFilms, setFilms] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [titleNotExist, setTitleNotExist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);
  const [current, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(10000);
  const [currentPageRatedFilms, setCurrentPageRatedFilms] = useState(1);
  const [totalRatedFilms, setTotalRatedFilms] = useState(0);

  useEffect(() => {
    setGuestSession();
  }, []);

  const handleTitleNotExist = (value) => {
    setTitleNotExist(value);
  };

  const onCloseTitleNotExist = () => {
    handleTitleNotExist(false);
    setSearchValue('');
  };

  const handleActiveTab = (value) => {
    setActiveTab(value);
  };

  const handleOnSetFilms = (result) => {
    setFilms(result);
  };

  const handleIsLoading = (value) => {
    setIsLoading(value);
  };

  function handleHasError(value) {
    setHasError(value);
  }

  const handleOnline = () => {
    setIsOnline(true);
  };

  const handleOffline = () => {
    setIsOnline(false);
  };

  useEffect(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const onChangePage = (page) => {
    setCurrentPage(page);
  };

  const handleTotalResults = (filmsCount) => {
    setTotalResults(filmsCount);
  };

  const onChangeRatedFilmsPage = (page) => {
    setCurrentPageRatedFilms(page);
  };

  const handleTotalRatedFilms = (filmsCount) => {
    setTotalRatedFilms(filmsCount);
  };

  return (
    <div>
      {isOnline ? (
        <>
          <Header
            activeTab={activeTab}
            handleActiveTab={handleActiveTab}
            onCloseTitleNotExist={onCloseTitleNotExist}
            handleHasError={handleHasError}
          />
          <Content className="content">
            <Row gutter={[16, 24]} justify="space-evenly">
              {activeTab === 'search' ? (
                <SearchPanel
                  searchValue={searchValue}
                  setSearchValue={setSearchValue}
                  handleOnSetFilms={handleOnSetFilms}
                  handleIsLoading={handleIsLoading}
                  handleHasError={handleHasError}
                  currentPage={current}
                  onChangePage={onChangePage}
                  handleTotalResults={handleTotalResults}
                  handleTitleNotExist={handleTitleNotExist}
                />
              ) : null}
              {hasError || titleNotExist ? null : (
                <Cards
                  activeTab={activeTab}
                  searchedFilms={searchedFilms}
                  isLoading={isLoading}
                  handleIsLoading={handleIsLoading}
                  hasError={hasError}
                  handleHasError={handleHasError}
                  currentPage={current}
                  onChangePage={onChangePage}
                  handleTotalRatedFilms={handleTotalRatedFilms}
                  currentPageRatedFilms={currentPageRatedFilms}
                />
              )}

              {hasError ? <Alert message="Error" description={hasError} type="error" showIcon /> : null}
              {titleNotExist ? (
                <Alert
                  message="Warning"
                  description={`The title of the movie "${titleNotExist}" you are searching for does not exist.`}
                  type="warning"
                  showIcon
                  closable
                  onClose={onCloseTitleNotExist}
                />
              ) : null}
              {isLoading || hasError || titleNotExist ? null : (
                <PaginationPanel
                  activeTab={activeTab}
                  currentPageRatedFilms={currentPageRatedFilms}
                  current={current}
                  onChangeRatedFilmsPage={onChangeRatedFilmsPage}
                  onChangePage={onChangePage}
                  totalRatedFilms={totalRatedFilms}
                  totalResults={totalResults}
                />
              )}
            </Row>
          </Content>
        </>
      ) : (
        <h1 className="offline">You are offline</h1>
      )}
    </div>
  );
}
