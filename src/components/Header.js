import React from 'react';
import './Header.css';

const Header = ({ company, searchTerm, onSearchChange }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-section">
          <h1 className="company-name">{company.name}</h1>
          <p className="company-tagline">{company.tagline}</p>
          <p className="company-description">{company.description}</p>
        </div>
        
        <div className="search-section">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search products by name..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;