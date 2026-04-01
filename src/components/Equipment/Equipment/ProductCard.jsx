import React from 'react';
import { FaMapMarkerAlt, FaCheckCircle, FaWhatsapp } from 'react-icons/fa';

const ProductCard = ({ 
  product, 
  rentalDays, 
  onRentClick, 
  getRandomLocation,
  isMobile = false
}) => {
  const priceNum = Number(product.price) || 0;
  const total = rentalDays > 0 ? priceNum * rentalDays : priceNum;
  const discountedTotal = rentalDays >= 3 ? Math.floor(total * 0.85) : total;

  return (
    <div 
      className={`bg-white rounded-3xl shadow-lg p-4 flex flex-col h-full border border-gray-100 transition-all hover:shadow-xl ${
        isMobile ? 'w-full' : 'w-full max-w-sm'
      }`}
    >

      {/* Top Bar */}
      <div className="flex justify-between items-center mb-2">

        {/* Availability */}
        <span className="bg-[#2FA4AB] text-white text-[11px] font-semibold px-3 py-[4px] rounded-full flex items-center gap-1">
          <FaCheckCircle className="w-3 h-3" />
          {product.isAvailable === false ? 'Rented' : 'Available'}
        </span>

        {/* Location */}
        <div className="flex items-center gap-1 text-[11px] text-gray-500">
          <FaMapMarkerAlt className="text-[#2FA4AB]" size={12} />
          {product.location || getRandomLocation()}
        </div>
      </div>

      {/* Image */}
      <div className="bg-gray-50 rounded-2xl p-4 mb-3 flex items-center justify-center">
        <img 
          src={product.imageUrl || 'https://via.placeholder.com/300x200'} 
          alt={product.name}
          className="h-28 object-contain"
        />
      </div>

      {/* Category */}
      <span className="bg-gray-100 text-[#2FA4AB] text-[11px] font-semibold px-2 py-[3px] rounded-full w-max mb-2">
        {product.category || 'Camera'}
      </span>

      {/* Name */}
      <h3 className="font-semibold text-sm mb-1 line-clamp-2">
        {product.name}
      </h3>

      {/* Price */}
      <div className="text-xl text-right font-bold text-[#2FA4AB] mb-2">
        ₹{rentalDays > 0 ? discountedTotal : priceNum}
        <span className="text-xs text-gray-500 font-medium ml-1">/total</span>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mb-3">
        

        <button 
          className="flex-1 bg-[#2FA4AB] text-white py-2 rounded-lg text-xs font-semibold hover:bg-[#238b91] transition"
          onClick={() => onRentClick(product)}
          disabled={product.isAvailable === false}
        >
          {product.isAvailable === false ? 'Rented' : 'Rent Now'}
        </button>
      </div>

      {/* WhatsApp */}
      <a
        href={`https://wa.me/919940423791?text=${encodeURIComponent(
          `Hi, I want to book: ${product.name} (${product.category}) for ${
            rentalDays > 0 ? rentalDays : 1
          } day(s). Price: ₹${rentalDays > 0 ? discountedTotal : priceNum}`
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-2 rounded-lg text-xs font-semibold hover:bg-green-600 transition"
      >
        <FaWhatsapp className="text-sm" />
        Book via WhatsApp
      </a>

    </div>
  );
};

export default ProductCard;