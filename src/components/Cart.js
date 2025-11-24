    import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import CustomerDetails from './CustomerDetails';
import './Cart.css';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const [showCustomerForm, setShowCustomerForm] = useState(false);

  const handleQuantityChange = (productId, newQuantity) => {
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    setShowCustomerForm(true);
  };

  const handleBackToCart = () => {
    setShowCustomerForm(false);
  };

  if (showCustomerForm) {
    return <CustomerDetails onBack={handleBackToCart} />;
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <div className="cart-header">
          <h2>Shopping Cart</h2>
        </div>
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add some products to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2>Shopping Cart ({cartItems.length} items)</h2>
        <button className="clear-cart-btn" onClick={clearCart}>
          Clear Cart
        </button>
      </div>

      <div className="cart-items">
        {cartItems.map(item => (
          <div key={item.id} className="cart-item">
            <div className="item-image">
              <img src={item.image} alt={item.name} />
            </div>
            
            <div className="item-details">
              <h3 className="item-name">{item.name}</h3>
              <p className="item-material">{item.material}</p>
              <p className="item-price">₹{item.retailPrice.toLocaleString()}</p>
            </div>

            <div className="quantity-controls">
              <button 
                className="quantity-btn"
                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
              >
                -
              </button>
              <span className="quantity-display">{item.quantity}</span>
              <button 
                className="quantity-btn"
                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
              >
                +
              </button>
            </div>

            <div className="item-total">
              ₹{(item.retailPrice * item.quantity).toLocaleString()}
            </div>

            <button 
              className="remove-item-btn"
              onClick={() => handleRemoveItem(item.id)}
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="total-section">
          <h3>Total: ₹{getCartTotal().toLocaleString()}</h3>
        </div>
        
        <div className="cart-actions">
          <button className="continue-shopping-btn" onClick={() => window.history.back()}>
            Continue Shopping
          </button>
          <button className="checkout-btn" onClick={handleProceedToCheckout}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;