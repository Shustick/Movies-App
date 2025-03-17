import React, { useState } from 'react';
import './App.css';
import { Row, Layout } from 'antd';

import Header from '../header';
import SearchPanel from '../searchPanel';
import Cards from '../card';

const { Content } = Layout;

export default function App() {
  const [searchedFilms, setFilms] = useState([]);

  const handleOnSetFilms = (result) => {
    setFilms(result);
  };

  return (
    <div>
      <Header />
      <Content className="content">
        <Row gutter={[16, 24]} justify="space-evenly">
          <SearchPanel handleOnSetFilms={handleOnSetFilms} />
          <Cards searchedFilms={searchedFilms} />
        </Row>
      </Content>
      <footer></footer>
    </div>
  );
}
