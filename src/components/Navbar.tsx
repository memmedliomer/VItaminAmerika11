import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, ShoppingCart, Search, Heart, X, User } from 'lucide-react';
import { useAppStore } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import logo from './logo.jpg';

export default function Navbar() {
  const { cart, language, currency, setLanguage, setCurrency, categories } = useAppStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const displayTotal = currency === 'USD' ? (cartTotal * 0.59).toFixed(2) : cartTotal.toFixed(2);
  const currencySymbol = currency === 'USD' ? '$' : '₼';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white shadow-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsMenuOpen(true)} className="p-2 rounded-md text-green-700 hover:bg-green-50 focus:outline-none">
                <Menu size={24} />
              </button>
              <Link to="/" className="flex items-center gap-2">
                <img src={logo} alt="Vitamin Amerika Logo" className="w-10 h-10 object-contain rounded-full" />
                <span className="font-bold text-xl text-green-800 hidden sm:block">Vitamin Amerika</span>
              </Link>
            </div>

            <div className="flex-1 max-w-lg mx-8 hidden md:block">
              <form onSubmit={handleSearch} className="relative group">
                <input
                  type="text"
                  placeholder={language === 'AZ' ? 'Məhsul axtar...' : 'Search products...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-28 py-2.5 rounded-full border-2 border-green-100 bg-green-50/30 focus:bg-white focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all duration-200 text-gray-700 placeholder:text-gray-400"
                />
                <Search className="absolute left-4 top-3 text-green-600 group-focus-within:text-green-700 transition-colors" size={20} />
                <div className="absolute right-1.5 top-1.5 bottom-1.5 flex items-center gap-1">
                  {searchQuery && (
                    <button 
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  )}
                  <button 
                    type="submit"
                    className="px-4 py-1.5 bg-green-600 text-white rounded-full text-sm font-semibold hover:bg-green-700 transition-colors shadow-sm"
                  >
                    {language === 'AZ' ? 'Axtar' : 'Search'}
                  </button>
                </div>
              </form>
            </div>

            <div className="flex items-center gap-3 sm:gap-6">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'AZ' | 'EN')}
                  className="bg-transparent border-none focus:ring-0 cursor-pointer"
                >
                  <option value="AZ">AZ</option>
                  <option value="EN">EN</option>
                </select>
                <span className="text-gray-300">|</span>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as 'AZN' | 'USD')}
                  className="bg-transparent border-none focus:ring-0 cursor-pointer"
                >
                  <option value="AZN">AZN</option>
                  <option value="USD">USD</option>
                </select>
              </div>

              <Link to="/cart" className="flex items-center gap-2 text-green-700 hover:text-green-800">
                <div className="relative">
                  <ShoppingCart size={24} />
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  )}
                </div>
                <span className="font-semibold hidden sm:block">{displayTotal} {currencySymbol}</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Search */}
      <div className="md:hidden p-4 bg-white border-b border-green-100">
        <form onSubmit={handleSearch} className="relative group">
          <input
            type="text"
            placeholder={language === 'AZ' ? 'Məhsul axtar...' : 'Search products...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-28 py-2.5 rounded-full border-2 border-green-100 bg-green-50/30 focus:bg-white focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all duration-200 text-gray-700"
          />
          <Search className="absolute left-4 top-3 text-green-600" size={20} />
          <div className="absolute right-1.5 top-1.5 bottom-1.5 flex items-center gap-1">
            {searchQuery && (
              <button 
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={18} />
              </button>
            )}
            <button 
              type="submit"
              className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-green-600 text-white rounded-full text-sm font-semibold hover:bg-green-700 transition-colors shadow-sm"
            >
              {language === 'AZ' ? 'Axtar' : 'Search'}
            </button>
          </div>
        </form>
      </div>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl z-50 flex flex-col"
            >
              <div className="p-4 border-b border-green-100 flex justify-between items-center bg-green-50">
                <span className="font-bold text-lg text-green-800">Menu</span>
                <button onClick={() => setIsMenuOpen(false)} className="p-1 rounded-md text-green-700 hover:bg-green-100">
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1">
                  <li>
                    <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center px-6 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 font-medium">
                      {language === 'AZ' ? 'Ana Səhifə' : 'Home'}
                    </Link>
                  </li>
                  <li>
                    <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="flex items-center px-6 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 font-medium">
                      <ShoppingCart size={20} className="mr-3" />
                      {language === 'AZ' ? 'Səbət' : 'Cart'}
                    </Link>
                  </li>
                  <li>
                    <Link to="/favorites" onClick={() => setIsMenuOpen(false)} className="flex items-center px-6 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 font-medium">
                      <Heart size={20} className="mr-3" />
                      {language === 'AZ' ? 'Seçilmişlər' : 'Selected'}
                    </Link>
                  </li>
                  
                  <li className="pt-4 pb-2 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {language === 'AZ' ? 'Kateqoriyalar' : 'Categories'}
                  </li>
                  {categories.map(cat => (
                    <li key={cat.id}>
                      <Link to={`/?category=${cat.id}`} onClick={() => setIsMenuOpen(false)} className="flex items-center px-6 py-2 text-gray-600 hover:bg-green-50 hover:text-green-700">
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
