import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import CategoryFilter from './components/CategoryFilter';
import ProductGrid from './components/ProductGrid';
import furnitureData from './data/furnitureData.json';

function App() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Prepare categories for filter
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
    // Category filter
    const categoryMatch = selectedCategory === 'all' || 
                         product.categoryId === selectedCategory;
    
    // Search filter
    const searchMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return categoryMatch && searchMatch;
  });

  return (
    <div className="App">
      <Header 
        company={furnitureData.company}
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} 
      />
      
      <div className="container">
        <div className="app-header">
          <h1>Partner Price List</h1>
          <p>View cost prices and retail prices for all products</p>
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
      </div>
    </div>
  );
}

export default App;