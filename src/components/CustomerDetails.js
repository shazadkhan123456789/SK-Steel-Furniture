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

  const generateOrderEmail = () => {
    const orderDetails = cartItems.map(item => 
      `• ${item.name} (${item.material}) - Qty: ${item.quantity} - ₹${item.retailPrice * item.quantity}`
    ).join('\n');

    return `
New Order Received - SK Steel And Furniture

Customer Details:
Name: ${formData.name}
Address: ${formData.address}
Pincode: ${formData.pincode}
Phone: ${formData.phone}
GST No: ${formData.gstNo || 'Not Provided'}

Order Details:
${orderDetails}

Total Amount: ₹${getCartTotal().toLocaleString()}

Order Date: ${new Date().toLocaleString()}
    `.trim();
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) return;

  setIsSubmitting(true);

  try {
    const orderData = generateOrderData();
    const orderContent = JSON.stringify(orderData, null, 2);
    const fileName = `order-${Date.now()}.json`;
    
    // GitHub repository details
    const repoOwner = 'shazadkhan123456789'; // Your GitHub username
    const repoName = 'SK-Steel-Furniture';   // Your repository name
    const filePath = `orders/pending/${fileName}`;
    
    // Create file via GitHub API
    const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${process.env.REACT_APP_GH_TOKEN || 'ghp_yourtokenhere'}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Add new order: ${formData.name}`,
        content: btoa(unescape(encodeURIComponent(orderContent))), // Base64 encode
      })
    });

    if (response.ok) {
      const result = await response.json();
      
      alert(`
✅ Order Placed Successfully!

• Order ID: ${orderData.id}
• Customer: ${formData.name}
• Total: ₹${getCartTotal().toLocaleString()}

The system will automatically send email confirmation within minutes.
      `);
      
      clearCart();
      onBack();
    } else {
      throw new Error('Failed to create order file');
    }
    
  } catch (error) {
    console.error('Error placing order:', error);
    
    // Fallback: Download file manually
    const orderData = generateOrderData();
    const orderContent = JSON.stringify(orderData, null, 2);
    const fileName = `order-${Date.now()}.json`;
    
    const blob = new Blob([orderContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert(`
✅ Order Data Generated!

Due to technical setup, please manually upload the downloaded file to:
https://github.com/shazadkhan123456789/SK-Steel-Furniture/tree/main/orders/pending

File: ${fileName}
    `);
    
    clearCart();
    onBack();
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
            {isSubmitting ? 'Placing Order...' : 'Place Order & Send Email'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerDetails;