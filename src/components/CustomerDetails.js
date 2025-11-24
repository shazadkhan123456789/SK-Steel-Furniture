import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import './CustomerDetails.css';

const CustomerDetails = ({ onBack }) => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    pincode: '',
    phone: '',
    gstNo: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // GitHub configuration - UPDATE owner and repo only!
  const GITHUB_CONFIG = {
    owner: 'shazadkhan123456789', // Your GitHub username
    repo: 'SK-Steel-Furniture',   // Your repository name
    branch: 'main'                // Your default branch
    // Token will be used from environment variable
  };

  const generateOrderData = () => {
    return {
      id: `order-${Date.now()}`,
      customer: formData,
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        material: item.material,
        quantity: item.quantity,
        unitPrice: item.retailPrice,
        totalPrice: item.retailPrice * item.quantity
      })),
      summary: {
        totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        totalAmount: getCartTotal(),
        orderDate: new Date().toISOString()
      }
    };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      alert('Please enter customer name');
      return false;
    }
    if (!formData.address.trim()) {
      alert('Please enter address');
      return false;
    }
    if (!formData.pincode.trim() || !/^\d{6}$/.test(formData.pincode)) {
      alert('Please enter a valid 6-digit pincode');
      return false;
    }
    if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone)) {
      alert('Please enter a valid 10-digit phone number');
      return false;
    }
    return true;
  };

  const createFileInGitHub = async (fileName, content) => {
    // Get token from environment variable (set in GitHub Pages build)
    const token = process.env.REACT_APP_GH_TOKEN;
    
    if (!token) {
      throw new Error('GitHub token not configured');
    }

    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/orders/pending/${fileName}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({
          message: `📦 New order: ${formData.name} - ${formData.phone}`,
          content: btoa(unescape(encodeURIComponent(content))),
          branch: GITHUB_CONFIG.branch
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `GitHub API error: ${response.status}`);
    }

    return await response.json();
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) return;

  setIsSubmitting(true);

  try {
    const orderData = generateOrderData();
    const orderContent = JSON.stringify(orderData, null, 2);
    const fileName = `order-${Date.now()}.json`;

    console.log('Creating order file in GitHub...');
    
    // GitHub API configuration
    const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/orders/pending/${fileName}`;
    
    // Create file in GitHub using GitHub Actions secret (this will work in the deployed app)
    const response = await fetch(GITHUB_API_URL, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${process.env.REACT_APP_GH_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify({
        message: `📦 New order: ${formData.name} - ${formData.phone}`,
        content: btoa(unescape(encodeURIComponent(orderContent))),
        branch: GITHUB_CONFIG.branch
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `GitHub API error: ${response.status}`);
    }

    const result = await response.json();
    console.log('GitHub API response:', result);
    
    alert(`🎉 ORDER PLACED SUCCESSFULLY!

✅ Order automatically created in system: ${orderData.id}
✅ Email will be sent within 2 minutes
✅ No manual steps required

Order Details:
• Order ID: ${orderData.id}
• Customer: ${formData.name}
• Phone: ${formData.phone}
• Total: ₹${getCartTotal().toLocaleString()}
• Items: ${cartItems.length} product(s)

📧 Email notification is being sent automatically...
The system will process your order within 2 minutes.
    `);
    
    // Clear cart and go back
    clearCart();
    onBack();
    
  } catch (error) {
    console.error('GitHub API Error:', error);
    
    // Enhanced error handling with specific messages
    let errorMessage = 'Failed to create order automatically. ';
    
    if (error.message.includes('401') || error.message.includes('Bad credentials')) {
      errorMessage += 'Authentication failed. Please check GitHub token configuration.';
    } else if (error.message.includes('404')) {
      errorMessage += 'Repository not found. Check owner and repo name.';
    } else if (error.message.includes('token not configured')) {
      errorMessage += 'GitHub token is not configured in environment variables.';
    } else {
      errorMessage += error.message;
    }
    
    alert(`❌ ${errorMessage}
    
Please contact support or try again later.`);
    
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="customer-details-container">
      <div className="customer-header">
        <button className="back-btn" onClick={onBack}>
          ← Back to Cart
        </button>
        <h2>Customer Details</h2>
      </div>

      <div className="customer-form-container">
        <form onSubmit={handleSubmit} className="customer-form">

          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Enter customer full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Delivery Address *</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              placeholder="Enter complete delivery address"
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="pincode">Pincode *</label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                required
                placeholder="6-digit pincode"
                maxLength="6"
                pattern="\d{6}"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                placeholder="10-digit phone number"
                maxLength="10"
                pattern="\d{10}"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="gstNo">GST Number (Optional)</label>
            <input
              type="text"
              id="gstNo"
              name="gstNo"
              value={formData.gstNo}
              onChange={handleInputChange}
              placeholder="Enter GST number if available"
            />
          </div>

          <div className="order-summary">
            <h3>Order Summary</h3>
            {cartItems.map(item => (
              <div key={item.id} className="order-item">
                <span>{item.name} x {item.quantity}</span>
                <span>₹{(item.retailPrice * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div className="order-total">
              <strong>Total: ₹{getCartTotal().toLocaleString()}</strong>
            </div>
          </div>

          <button 
            type="submit" 
            className="place-order-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Order Automatically...' : 'Place Order'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerDetails;