import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const profitMargin = product.retailPrice - product.costPrice;
  const marginPercentage = ((profitMargin / product.costPrice) * 100).toFixed(1);

  // Handle image error
  const handleImageError = (e) => {
    e.target.src = '/images/placeholder.jpg';
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img 
          src={product.image} 
          alt={product.name}
          onError={handleImageError}
        />
        <div className="product-material">{product.material}</div>
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        
        <div className="price-section">
          <div className="price-row">
            <span className="price-label">Without GST:</span>
            <span className="cost-price">₹{product.costPrice.toLocaleString()}</span>
          </div>
          
          <div className="price-row">
            <span className="price-label">With GST:</span>
            <span className="retail-price">₹{product.retailPrice.toLocaleString()}</span>
          </div>
        </div>
        
        
      </div>
    </div>
  );
};

export default ProductCard;