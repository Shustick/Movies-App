import React from 'react';
import './Header.css';

const Header = ({ activeTab, handleActiveTab, onCloseTitleNotExist, handleHasError }) => {
  const changeActiveTab = (ev) => {
    const btnClassList = ev.target.classList;
    handleHasError(false);
    onCloseTitleNotExist();
    if (btnClassList.contains('search-btn') && activeTab !== 'search') {
      handleActiveTab('search');
    } else if (btnClassList.contains('rated-btn') && activeTab !== 'rated') {
      handleActiveTab('rated');
    }
  };

  return (
    <nav className="header">
      <div className="nav-btns" onClick={changeActiveTab}>
        <button className={`nav-btn search-btn ${activeTab === 'search' ? 'selected-btn' : null}`}>Search</button>
        <button className={`nav-btn rated-btn ${activeTab === 'rated' ? 'selected-btn' : null}`}>Rated</button>
      </div>
    </nav>
  );
};

export default Header;
