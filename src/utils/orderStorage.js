// Utility to store orders in a JSON file (simulated)
export const saveOrderToFile = async (orderData) => {
  const order = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    status: 'pending',
    ...orderData
  };

  // In a real implementation, this would write to a file
  // For now, we'll store in localStorage and trigger via GitHub
  const orders = JSON.parse(localStorage.getItem('pending_orders') || '[]');
  orders.push(order);
  localStorage.setItem('pending_orders', JSON.stringify(orders));
  
  return order;
};

export const getPendingOrders = () => {
  return JSON.parse(localStorage.getItem('pending_orders') || '[]');
};

export const clearPendingOrders = () => {
  localStorage.removeItem('pending_orders');
};