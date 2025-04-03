import React from 'react';
import { Col, Pagination, ConfigProvider } from 'antd';

import './PaginationPanel.css';

const PaginationPanel = ({
  activeTab,
  currentPageRatedFilms,
  current,
  onChangeRatedFilmsPage,
  onChangePage,
  totalRatedFilms,
  totalResults,
}) => {
  return (
    <Col span={24} className="pagination-container">
      <ConfigProvider
        theme={{
          components: {
            Pagination: {
              itemActiveBg: '#1890FF',
              colorPrimary: '#ffffff',
            },
          },
        }}
      >
        <Pagination
          current={activeTab === 'rated' ? currentPageRatedFilms : current}
          onChange={activeTab === 'rated' ? onChangeRatedFilmsPage : onChangePage}
          defaultCurrent={1}
          total={activeTab === 'rated' ? totalRatedFilms : totalResults}
          pageSize={20}
          showSizeChanger={false}
        />
      </ConfigProvider>
    </Col>
  );
};
export default PaginationPanel;
