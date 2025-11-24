import React from 'react';
import './ProductCard.css';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [imageError, setImageError] = React.useState(false);
  const profitMargin = product.retailPrice - product.costPrice;
  const marginPercentage = ((profitMargin / product.costPrice) * 100).toFixed(1);

  const placeholderImage = 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=300&fit=crop';

  const handleImageError = (e) => {
    setImageError(true);
    e.target.src = placeholderImage;
  };

  const handleAddToCart = () => {
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img 
          src={imageError ? placeholderImage : product.image} 
          alt={product.name}
          onError={handleImageError}
          loading="lazy"
        />
        <div className="product-material">{product.material}</div>
        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          🛒 Add to Cart
        </button>
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        
        <div className="price-section">
          <div className="price-row">
            <span className="price-label">Cost Price:</span>
            <span className="cost-price">₹{product.costPrice.toLocaleString()}</span>
          </div>
          
          <div className="price-row">
            <span className="price-label">Retail Price:</span>
            <span className="retail-price">₹{product.retailPrice.toLocaleString()}</span>
          </div>
          
          
        </div>
        
        
      </div>
    </div>
  );
};

export default ProductCard;