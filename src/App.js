import React, { useState } from 'react';
import { CartProvider } from './context/CartContext';
import './App.css';
import Header from './components/Header';
import CategoryFilter from './components/CategoryFilter';
import ProductGrid from './components/ProductGrid';
import Cart from './components/Cart';
import furnitureData from './data/furnitureData.json';

function App() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentView, setCurrentView] = useState('products'); // 'products' or 'cart'

  const categories = [
    { id: 'all', name: 'All Products' },
    ...furnitureData.categories.map(cat => ({ 
      id: cat.id.toString(), 
      name: cat.name 
    }))
  ];

  // Get all products flattened
  const allProducts = furnitureData.categories.flatMap(category => 
    category.items.map(item => ({
      ...item,
      categoryId: category.id.toString(),
      categoryName: category.name
    }))
  );

  // Filter products
  const filteredProducts = allProducts.filter(product => {
    const categoryMatch = selectedCategory === 'all' || 
                         product.categoryId === selectedCategory;
    const searchMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && searchMatch;
  });

  // Handle cart link click
  const handleCartClick = (e) => {
    if (e.target.closest('a[href="#cart"]')) {
      e.preventDefault();
      setCurrentView('cart');
    }
  };

  // Handle navigation
  const handleNavigation = (view) => {
    setCurrentView(view);
  };

  React.useEffect(() => {
    document.addEventListener('click', handleCartClick);
    return () => document.removeEventListener('click', handleCartClick);
  }, []);

  return (
    <CartProvider>
      <div className="App">
        <Header 
          company={furnitureData.company}
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm} 
        />
        
        <div className="container">
          {currentView === 'products' ? (
            <>
              <div className="app-header">
                <h1>Partner Price List</h1>
                <p>View cost prices and retail prices for all products</p>
                <div className="navigation">
                  <button 
                    className="nav-btn active"
                    onClick={() => setCurrentView('products')}
                  >
                    Products
                  </button>
                  <button 
                    className="nav-btn"
                    onClick={() => setCurrentView('cart')}
                  >
                    View Cart
                  </button>
                </div>
              </div>
              
              <CategoryFilter 
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
              
              <div className="results-info">
                <p>
                  Showing {filteredProducts.length} products 
                  {selectedCategory !== 'all' && 
                    ` in ${categories.find(cat => cat.id === selectedCategory)?.name}`
                  }
                  {searchTerm && ` matching "${searchTerm}"`}
                </p>
              </div>
              
              <ProductGrid products={filteredProducts} />
            </>
          ) : (
            <>
              <div className="app-header">
                <div className="navigation">
                  <button 
                    className="nav-btn"
                    onClick={() => setCurrentView('products')}
                  >
                    ← Back to Products
                  </button>
                  <button 
                    className="nav-btn active"
                    onClick={() => setCurrentView('cart')}
                  >
                    Shopping Cart
                  </button>
                </div>
              </div>
              <Cart onNavigate={handleNavigation} />
            </>
          )}
        </div>
      </div>
    </CartProvider>
  );
}

export default App;