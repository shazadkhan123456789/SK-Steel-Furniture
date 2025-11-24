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
    const emailContent = generateOrderEmail();
    const subject = `New Order - ${formData.name}`;
    
    // Create mailto link
    const mailtoLink = `mailto:shazadkhan143614361436@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailContent)}`;
    
    window.location.href = mailtoLink;
    
    alert('Order placed successfully! Your email client will open to send the order details.');
    clearCart();
    onBack();
    
  } catch (error) {
    console.error('Error placing order:', error);
    alert('Error placing order. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};