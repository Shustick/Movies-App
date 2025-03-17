import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <nav className="header">
      <div className="nav-btns">
        <button className="nav-btn selected-btn">Search</button>
        <button className="nav-btn">Rated</button>
      </div>
    </nav>
  );
};

export default Header;
