import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { optimizeCloudinaryUrl } from '../lib/cloudinary';

export default function Cart() {
  const { cart, currency, language, updateQuantity, removeFromCart, applyPromo, appliedPromo, removePromo, addToast, addOrder, clearCart } = useAppStore();
  const [promoCode, setPromoCode] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const discount = appliedPromo ? (cartTotal * appliedPromo.discountPercent) / 100 : 0;
  const finalTotal = cartTotal - discount;

  const displayTotal = currency === 'USD' ? (finalTotal * 0.59).toFixed(2) : finalTotal.toFixed(2);
  const currencySymbol = currency === 'USD' ? '$' : '₼';

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (applyPromo(promoCode)) {
      addToast(language === 'AZ' ? 'Promo kod uğurla tətbiq edildi' : 'Promo code applied successfully', 'success');
      setPromoCode('');
    } else {
      addToast(language === 'AZ' ? 'Yanlış promo kod' : 'Invalid promo code', 'error');
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const order = {
      id: Math.random().toString(36).substring(2, 9),
      customerName: name,
      customerSurname: surname,
      phone,
      items: cart,
      total: finalTotal,
      date: new Date().toISOString(),
    };

    await addOrder(order);
    clearCart();
    addToast(language === 'AZ' ? 'Sifarişiniz qəbul edildi' : 'Your order has been received', 'success');
    navigate('/');
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={48} className="text-green-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {language === 'AZ' ? 'Səbətiniz boşdur' : 'Your cart is empty'}
        </h2>
        <p className="text-gray-500 mb-8 text-center max-w-md">
          {language === 'AZ' ? 'Səbətinizdə heç bir məhsul yoxdur. Məhsullarımızı kəşf etmək üçün ana səhifəyə qayıdın.' : 'There are no items in your cart. Return to the home page to explore our products.'}
        </p>
        <Link to="/" className="px-8 py-3 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-colors shadow-sm hover:shadow-md">
          {language === 'AZ' ? 'Alış-verişə başla' : 'Start shopping'}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {language === 'AZ' ? 'Səbətiniz' : 'Your Cart'}
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <ul className="divide-y divide-gray-100">
              {cart.map((item) => (
                <li key={item.product.id} className="p-6 flex flex-col sm:flex-row gap-6 items-center">
                  <img src={optimizeCloudinaryUrl(item.product.imageUrl)} alt={item.product.name} className="w-24 h-24 object-cover rounded-xl bg-gray-50" />
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.product.name}</h3>
                    <p className="text-green-600 font-bold text-xl">
                      {currency === 'USD' ? (item.product.price * 0.59).toFixed(2) : item.product.price.toFixed(2)} {currencySymbol}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4 bg-gray-50 rounded-full p-1 border border-gray-200">
                    <button 
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-600 hover:text-green-600 shadow-sm transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-medium text-gray-800">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-600 hover:text-green-600 shadow-sm transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <button 
                    onClick={() => {
                      removeFromCart(item.product.id);
                      addToast(language === 'AZ' ? 'Məhsul səbətdən silindi' : 'Product removed from cart', 'info');
                    }}
                    className="p-3 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    title={language === 'AZ' ? 'Sil' : 'Remove'}
                  >
                    <Trash2 size={20} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="w-full lg:w-96">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              {language === 'AZ' ? 'Sifarişin xülasəsi' : 'Order Summary'}
            </h2>

            <form onSubmit={handleApplyPromo} className="mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={language === 'AZ' ? 'Promo kod' : 'Promo code'}
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button type="submit" className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-medium">
                  {language === 'AZ' ? 'Tətbiq et' : 'Apply'}
                </button>
              </div>
            </form>

            <div className="space-y-3 mb-6 text-gray-600">
              <div className="flex justify-between">
                <span>{language === 'AZ' ? 'Cəmi' : 'Subtotal'}</span>
                <span className="font-medium text-gray-800">
                  {currency === 'USD' ? (cartTotal * 0.59).toFixed(2) : cartTotal.toFixed(2)} {currencySymbol}
                </span>
              </div>
              
              {appliedPromo && (
                <div className="flex justify-between text-green-600">
                  <div className="flex items-center gap-2">
                    <span>{language === 'AZ' ? 'Endirim' : 'Discount'} ({appliedPromo.discountPercent}%)</span>
                    <button onClick={removePromo} className="text-xs underline hover:text-green-800">
                      {language === 'AZ' ? 'Sil' : 'Remove'}
                    </button>
                  </div>
                  <span className="font-medium">
                    -{currency === 'USD' ? (discount * 0.59).toFixed(2) : discount.toFixed(2)} {currencySymbol}
                  </span>
                </div>
              )}
              
              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">{language === 'AZ' ? 'Yekun məbləğ' : 'Total'}</span>
                <span className="text-2xl font-bold text-green-600">{displayTotal} {currencySymbol}</span>
              </div>
            </div>

            <form onSubmit={handleCheckout} className="space-y-4">
              <h3 className="font-semibold text-gray-800 border-b border-gray-100 pb-2 mb-4">
                {language === 'AZ' ? 'Çatdırılma məlumatları' : 'Delivery Information'}
              </h3>
              <input
                type="text"
                required
                placeholder={language === 'AZ' ? 'Ad' : 'Name'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                required
                placeholder={language === 'AZ' ? 'Soyad' : 'Surname'}
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="tel"
                required
                placeholder={language === 'AZ' ? 'Əlaqə nömrəsi' : 'Phone number'}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button 
                type="submit" 
                className="w-full py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg mt-4 flex items-center justify-center gap-2"
              >
                <ShoppingBag size={20} />
                {language === 'AZ' ? 'Sifarişi tamamla' : 'Complete Order'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
