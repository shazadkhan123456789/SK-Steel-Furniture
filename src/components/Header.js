import React from 'react';
import './Header.css';
import { useCart } from '../context/CartContext';

const Header = ({ company, searchTerm, onSearchChange }) => {
  const { getCartItemsCount } = useCart();

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-section">
          <h1 className="company-name">{company.name}</h1>
          <p className="company-tagline">{company.tagline}</p>
          <p className="company-description">{company.description}</p>
        </div>
        
        <div className="header-right">
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
          
          <div className="cart-section">
            <a href="#cart" className="cart-link">
              <span className="cart-icon" >🛒</span>
              {getCartItemsCount() > 0 && (
                <span className="cart-count">{getCartItemsCount()}</span>
              )}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;