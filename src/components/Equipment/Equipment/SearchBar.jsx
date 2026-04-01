import React, { useState, useEffect } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';

const SearchBar = ({
  searchQuery,
  onSearchChange,
  onClearSearch,
  products = [],
  placeholder = 'Search cameras, lenses, and more...',
  className = ''
}) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [isFocused, setIsFocused] = useState(false);

  // Update local state when searchQuery prop changes
  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearchChange(localQuery);
    setIsFocused(false);
  };

  const handleClear = () => {
    setLocalQuery('');
    onClearSearch();
  };

  const handleSuggestionClick = (item) => {
    const query = typeof item === 'string' ? item : item.name;
    setLocalQuery(query);
    onSearchChange(query);
    setIsFocused(false);
  };

  // Filter products based on localQuery
  const filteredSuggestions = localQuery.trim() !== '' 
    ? products.filter(product => 
        (product.name && product.name.toLowerCase().includes(localQuery.toLowerCase())) ||
        (product.brand && product.brand.toLowerCase().includes(localQuery.toLowerCase())) ||
        (product.category && product.category.toLowerCase().includes(localQuery.toLowerCase())) ||
        (product.model && product.model.toLowerCase().includes(localQuery.toLowerCase())) ||
        (product.description && product.description.toLowerCase().includes(localQuery.toLowerCase())) ||
        (product.tags && Array.isArray(product.tags) && 
          product.tags.some(tag => tag.toLowerCase().includes(localQuery.toLowerCase())))
      ).slice(0, 6)
    : [];

  const popularSearches = ['Sony A7 IV', 'Canon R5', 'DJI Mavic 3', 'Sony 24-70mm', 'GoPro Hero 11'];

  return (
    <form 
      onSubmit={handleSubmit}
      className={`relative ${className}`}
    >
      <div className={`relative flex items-center ${isFocused ? 'ring-2 ring-[#1A97A9] shadow-md' : ''} bg-white rounded-full shadow-sm border border-gray-300 overflow-hidden transition-all duration-200`}>
        <div className="absolute left-4 text-gray-400">
          <FaSearch size={14} />
        </div>
        
        <input
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          className="w-full py-3.5 pl-11 pr-20 text-sm text-gray-700 placeholder-gray-400 bg-transparent border-0 focus:ring-0 focus:outline-none"
        />
        
        <div className="absolute right-0 flex items-center h-full">
          {localQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="px-2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
            >
              <FaTimes size={14} />
            </button>
          )}
          
          <button
            type="submit"
            className="h-full px-6 text-white bg-[#1A97A9] hover:bg-[#167a8a] transition-colors flex items-center justify-center font-medium"
            aria-label="Search"
          >
            <FaSearch className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Suggestions Dropdown */}
      {isFocused && (
        <>
          {/* Backdrop to close on click outside */}
          <div 
            className="fixed inset-0 z-0" 
            onClick={() => setIsFocused(false)}
          />
          
          <div className="absolute z-10 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-200 ease-out origin-top">
            {localQuery.trim() === '' ? (
              <>
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Popular Searches</h4>
                </div>
                <div className="p-2 grid grid-cols-2 gap-1">
                  {popularSearches.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleSuggestionClick(item)}
                      className="text-left px-3 py-2.5 text-xs text-gray-600 hover:bg-gray-50 rounded-lg flex items-center gap-2 transition-colors group"
                    >
                      <FaSearch className="text-gray-300 group-hover:text-[#1A97A9]" size={10} />
                      {item}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {filteredSuggestions.length > 0 ? 'Product Suggestions' : 'No matches found'}
                  </h4>
                  {filteredSuggestions.length > 0 && (
                    <span className="text-[10px] text-[#1A97A9] font-medium">{filteredSuggestions.length} items</span>
                  )}
                </div>
                <div className="p-1">
                  {filteredSuggestions.map((product) => (
                    <button
                      key={product._id}
                      type="button"
                      onClick={() => handleSuggestionClick(product)}
                      className="w-full flex items-center gap-3 p-2 text-left hover:bg-gray-50 rounded-xl transition-all group"
                    >
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-100">
                        <img 
                          src={product.imageUrl || 'https://via.placeholder.com/50x50'} 
                          alt={product.name}
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-semibold text-gray-800 truncate group-hover:text-[#1A97A9] transition-colors">
                          {product.name}
                        </h5>
                        <p className="text-[11px] text-gray-500 flex items-center gap-2">
                          <span className="font-medium text-[#1A97A9]">{product.brand}</span>
                          <span className="w-1 h-1 rounded-full bg-gray-300" />
                          <span>{product.category}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-gray-900">₹{product.price}</p>
                        <p className="text-[9px] text-gray-400 font-medium whitespace-nowrap">per day</p>
                      </div>
                    </button>
                  ))}
                  
                  {filteredSuggestions.length === 0 && (
                    <div className="p-8 text-center">
                      <p className="text-sm text-gray-500 italic">No products matching "{localQuery}"</p>
                    </div>
                  )}
                </div>
              </>
            )}
            
            <div className="bg-gray-50 p-2 border-t border-gray-100">
              <button
                type="submit"
                onClick={handleSubmit}
                className="w-full py-2 text-xs text-[#1A97A9] font-semibold hover:underline"
              >
                View all results for "{localQuery || '...'}"
              </button>
            </div>
          </div>
        </>
      )}
    </form>
  );
};

export default SearchBar;
