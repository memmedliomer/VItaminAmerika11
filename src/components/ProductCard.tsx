import React, { useState } from 'react';
import { Heart, ShoppingCart, Info, X } from 'lucide-react';
import { Product, useAppStore } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import { optimizeCloudinaryUrl } from '../lib/cloudinary';

interface ProductCardProps {
  key?: string | number;
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { currency, language, favorites, toggleFavorite, addToCart, addToast } = useAppStore();
  const [showDesc, setShowDesc] = useState(false);

  const isFavorite = favorites.includes(product.id);
  const displayPrice = currency === 'USD' ? (product.price * 0.59).toFixed(2) : product.price.toFixed(2);
  const currencySymbol = currency === 'USD' ? '$' : '₼';
  const optimizedImageUrl = optimizeCloudinaryUrl(product.imageUrl);

  const handleAddToCart = () => {
    addToCart(product);
    addToast(language === 'AZ' 
      ? `Məhsul səbətə əlavə edildi. Qiymət: ${displayPrice} ${currencySymbol}` 
      : `Product added to cart. Price: ${displayPrice} ${currencySymbol}`, 'success');
  };

  const handleToggleFavorite = () => {
    toggleFavorite(product.id);
    if (!isFavorite) {
      addToast(language === 'AZ' ? 'Seçilmişlərə əlavə edildi' : 'Added to selected', 'success');
    }
  };

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-green-50 hover:shadow-md transition-shadow group relative flex flex-col h-full ${showDesc ? 'z-50' : 'z-10'}`}>
      <div 
        className="relative aspect-square overflow-hidden rounded-t-2xl bg-white p-6 cursor-pointer"
        onClick={() => setShowDesc(!showDesc)}
      >
        <img 
          src={optimizedImageUrl} 
          alt={product.name} 
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
        />
        <button 
          onClick={(e) => {
            e.stopPropagation();
            handleToggleFavorite();
          }}
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
        >
          <Heart size={20} className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
        </button>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 
          className="font-semibold text-gray-800 text-base mb-1 line-clamp-2 cursor-pointer hover:text-green-700 transition-colors"
          onClick={() => setShowDesc(!showDesc)}
        >
          {product.name}
        </h3>
        <p className="text-green-600 font-bold text-lg mb-3 mt-auto">
          {displayPrice} {currencySymbol}
        </p>

        <div className="flex flex-col gap-2 mt-auto">
          <button 
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
          >
            <ShoppingCart size={18} />
            {language === 'AZ' ? 'Səbətə əlavə et' : 'Add to cart'}
          </button>

          <button 
            onClick={() => setShowDesc(!showDesc)}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-xs font-medium"
          >
            <Info size={14} />
            {language === 'AZ' ? 'Məlumat' : 'Info'}
          </button>
        </div>

        <AnimatePresence>
          {showDesc && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-[calc(100%+8px)] left-0 right-0 z-50 bg-white p-4 rounded-xl shadow-xl border border-green-100 text-sm text-gray-700 leading-relaxed max-h-60 overflow-y-auto"
            >
              {product.description}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
