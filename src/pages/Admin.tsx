import React, { useState } from 'react';
import { useAppStore, Product, Category, PromoCode } from '../store';
import { Package, Tag, Ticket, ShoppingBag, Plus, Trash2, LogOut, Image as ImageIcon } from 'lucide-react';
import { optimizeCloudinaryUrl } from '../lib/cloudinary';
import logo from '../components/logo.jpg';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'promos' | 'orders'>('products');

  const { language, products, categories, promoCodes, orders, addProduct, deleteProduct, addCategory, deleteCategory, addPromoCode, deletePromoCode, updateOrderStatus } = useAppStore();

  // Product Form
  const [newProduct, setNewProduct] = useState<Partial<Product>>({ name: '', price: 0, description: '', categoryId: '', imageUrl: '' });
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  
  // Category Form
  const [newCategoryName, setNewCategoryName] = useState('');
  
  // Promo Form
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoDiscount, setNewPromoDiscount] = useState(0);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'amerika2828@' && password === 'a3737#') {
      setIsAuthenticated(true);
    } else {
      alert(language === 'AZ' ? 'Yanlış məlumatlar' : 'Invalid credentials');
    }
  };

  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'storeamerika');

    try {
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'db73vmlvo';
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      // The user requested to store the URL in the product's imageUrl field.
      // We also apply Cloudinary transformations: q_auto (quality), f_auto (format)
      const optimizedUrl = data.secure_url.replace('/upload/', '/upload/q_auto,f_auto/');
      setNewProduct({ ...newProduct, imageUrl: optimizedUrl });
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      alert(language === 'AZ' ? 'Şəkil yüklənmədi' : 'Image upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const { updateProduct } = useAppStore();

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newProduct.name && newProduct.price && newProduct.categoryId && newProduct.imageUrl) {
      if (editingProductId) {
        await updateProduct(editingProductId, {
          name: newProduct.name,
          price: Number(newProduct.price),
          description: newProduct.description || '',
          categoryId: newProduct.categoryId,
          imageUrl: newProduct.imageUrl,
        });
        setEditingProductId(null);
      } else {
        await addProduct({
          id: Math.random().toString(36).substring(2, 9),
          name: newProduct.name,
          price: Number(newProduct.price),
          description: newProduct.description || '',
          categoryId: newProduct.categoryId,
          imageUrl: newProduct.imageUrl,
        });
      }
      setNewProduct({ name: '', price: 0, description: '', categoryId: '', imageUrl: '' });
      // Reset file input if possible, or just let it be
    }
  };

  const startEditing = (product: Product) => {
    setNewProduct({
      name: product.name,
      price: product.price,
      description: product.description,
      categoryId: product.categoryId,
      imageUrl: product.imageUrl,
    });
    setEditingProductId(product.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditing = () => {
    setEditingProductId(null);
    setNewProduct({ name: '', price: 0, description: '', categoryId: '', imageUrl: '' });
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName) {
      await addCategory({ id: Math.random().toString(36).substring(2, 9), name: newCategoryName });
      setNewCategoryName('');
    }
  };

  const handleAddPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPromoCode && newPromoDiscount > 0) {
      await addPromoCode({ code: newPromoCode, discountPercent: Number(newPromoDiscount) });
      setNewPromoCode('');
      setNewPromoDiscount(0);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Admin Login</h2>
            <p className="text-gray-500 mt-2">{language === 'AZ' ? 'İdarəetmə panelinə daxil olun' : 'Please sign in to access the dashboard'}</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{language === 'AZ' ? 'İstifadəçi adı' : 'Username'}</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{language === 'AZ' ? 'Şifrə' : 'Password'}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
            <button type="submit" className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
              {language === 'AZ' ? 'Daxil ol' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-8 text-green-700">
          <img src={logo} alt="Vitamin Amerika Logo" className="w-10 h-10 object-contain rounded-full" />
          <span className="font-bold text-xl">Admin Panel</span>
        </div>

        <nav className="space-y-2 flex-1">
          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'products' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Package size={20} /> {language === 'AZ' ? 'Məhsullar' : 'Products'}
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'categories' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Tag size={20} /> {language === 'AZ' ? 'Kateqoriyalar' : 'Categories'}
          </button>
          <button
            onClick={() => setActiveTab('promos')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'promos' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Ticket size={20} /> {language === 'AZ' ? 'Promo Kodlar' : 'Promo Codes'}
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'orders' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <ShoppingBag size={20} /> {language === 'AZ' ? 'Sifarişlər' : 'Orders'}
          </button>
        </nav>

        <button onClick={() => setIsAuthenticated(false)} className="mt-auto flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors">
          <LogOut size={20} /> {language === 'AZ' ? 'Çıxış' : 'Logout'}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {activeTab === 'products' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{language === 'AZ' ? 'Məhsulları İdarə Et' : 'Manage Products'}</h2>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                {editingProductId ? <Tag size={20} /> : <Plus size={20} />} 
                {editingProductId 
                  ? (language === 'AZ' ? 'Məhsulu Düzəlt' : 'Edit Product') 
                  : (language === 'AZ' ? 'Yeni Məhsul Əlavə Et' : 'Add New Product')}
              </h3>
              <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder={language === 'AZ' ? 'Məhsulun Adı' : 'Product Name'} value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="px-4 py-2 border rounded-lg" required />
                <input type="number" placeholder={language === 'AZ' ? 'Qiymət (AZN)' : 'Price (AZN)'} value={newProduct.price || ''} onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})} className="px-4 py-2 border rounded-lg" required />
                <select value={newProduct.categoryId} onChange={e => setNewProduct({...newProduct, categoryId: e.target.value})} className="px-4 py-2 border rounded-lg" required>
                  <option value="">{language === 'AZ' ? 'Kateqoriya Seçin' : 'Select Category'}</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                
                <div className="flex items-center gap-2 border rounded-lg px-4 py-2 bg-white">
                  <ImageIcon className={isUploading ? "text-green-500 animate-pulse" : "text-gray-400"} size={20} />
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 disabled:opacity-50" 
                    required={!editingProductId} 
                    disabled={isUploading}
                  />
                  {isUploading && <span className="text-xs text-green-600 font-medium animate-pulse">{language === 'AZ' ? 'Yüklənir...' : 'Uploading...'}</span>}
                </div>
                
                <textarea placeholder={language === 'AZ' ? 'Açıqlama' : 'Description'} value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="px-4 py-2 border rounded-lg md:col-span-2" rows={3} required />
                
                <div className="md:col-span-2 flex gap-3">
                  <button type="submit" className="flex-1 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
                    {editingProductId 
                      ? (language === 'AZ' ? 'Yadda Saxla' : 'Save Changes') 
                      : (language === 'AZ' ? 'Məhsul Əlavə Et' : 'Add Product')}
                  </button>
                  {editingProductId && (
                    <button 
                      type="button" 
                      onClick={cancelEditing}
                      className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    >
                      {language === 'AZ' ? 'Ləğv Et' : 'Cancel'}
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="p-4 font-medium text-gray-600">{language === 'AZ' ? 'Şəkil' : 'Image'}</th>
                    <th className="p-4 font-medium text-gray-600">{language === 'AZ' ? 'Ad' : 'Name'}</th>
                    <th className="p-4 font-medium text-gray-600">{language === 'AZ' ? 'Qiymət' : 'Price'}</th>
                    <th className="p-4 font-medium text-gray-600">{language === 'AZ' ? 'Kateqoriya' : 'Category'}</th>
                    <th className="p-4 font-medium text-gray-600">{language === 'AZ' ? 'Əməliyyatlar' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="p-4"><img src={optimizeCloudinaryUrl(p.imageUrl)} alt={p.name} className="w-12 h-12 object-contain rounded-md bg-white border border-gray-100" /></td>
                      <td className="p-4 font-medium">{p.name}</td>
                      <td className="p-4">{p.price} AZN</td>
                      <td className="p-4">{categories.find(c => c.id === p.categoryId)?.name}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => startEditing(p)} 
                            className="text-blue-500 hover:bg-blue-50 p-2 rounded-md transition-colors"
                            title={language === 'AZ' ? 'Düzəlt' : 'Edit'}
                          >
                            <Tag size={18} />
                          </button>
                          <button 
                            onClick={async () => await deleteProduct(p.id)} 
                            className="text-red-500 hover:bg-red-50 p-2 rounded-md transition-colors"
                            title={language === 'AZ' ? 'Sil' : 'Delete'}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{language === 'AZ' ? 'Kateqoriyaları İdarə Et' : 'Manage Categories'}</h2>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Plus size={20} /> {language === 'AZ' ? 'Yeni Kateqoriya Əlavə Et' : 'Add New Category'}</h3>
              <form onSubmit={handleAddCategory} className="flex gap-4">
                <input type="text" placeholder={language === 'AZ' ? 'Kateqoriya Adı' : 'Category Name'} value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} className="flex-1 px-4 py-2 border rounded-lg" required />
                <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700">{language === 'AZ' ? 'Əlavə Et' : 'Add'}</button>
              </form>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <ul className="divide-y divide-gray-100">
                {categories.map(c => (
                  <li key={c.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                    <span className="font-medium">{c.name}</span>
                    <button onClick={async () => await deleteCategory(c.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-md"><Trash2 size={18} /></button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'promos' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{language === 'AZ' ? 'Promo Kodları İdarə Et' : 'Manage Promo Codes'}</h2>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Plus size={20} /> {language === 'AZ' ? 'Yeni Promo Kod Əlavə Et' : 'Add New Promo Code'}</h3>
              <form onSubmit={handleAddPromo} className="flex gap-4">
                <input type="text" placeholder={language === 'AZ' ? 'Kod (məs. SUMMER20)' : 'Code (e.g. SUMMER20)'} value={newPromoCode} onChange={e => setNewPromoCode(e.target.value.toUpperCase())} className="flex-1 px-4 py-2 border rounded-lg" required />
                <input type="number" placeholder={language === 'AZ' ? 'Endirim %' : 'Discount %'} value={newPromoDiscount || ''} onChange={e => setNewPromoDiscount(Number(e.target.value))} className="w-32 px-4 py-2 border rounded-lg" required min="1" max="100" />
                <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700">{language === 'AZ' ? 'Əlavə Et' : 'Add'}</button>
              </form>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <ul className="divide-y divide-gray-100">
                {promoCodes.map(pc => (
                  <li key={pc.code} className="p-4 flex justify-between items-center hover:bg-gray-50">
                    <div>
                      <span className="font-bold text-lg">{pc.code}</span>
                      <span className="ml-4 text-green-600 font-medium">{pc.discountPercent}% {language === 'AZ' ? 'ENDİRİM' : 'OFF'}</span>
                    </div>
                    <button onClick={async () => await deletePromoCode(pc.code)} className="text-red-500 hover:bg-red-50 p-2 rounded-md"><Trash2 size={18} /></button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{language === 'AZ' ? 'Son Sifarişlər' : 'Recent Orders'}</h2>
            
            <div className="space-y-4">
              {orders.length === 0 ? (
                <p className="text-gray-500 bg-white p-8 rounded-xl text-center border border-gray-100">{language === 'AZ' ? 'Hələ sifariş yoxdur.' : 'No orders yet.'}</p>
              ) : (
                orders.map(order => (
                  <div key={order.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-4">
                      <div>
                        <h3 className="font-bold text-lg">{language === 'AZ' ? 'Sifariş' : 'Order'} #{order.id}</h3>
                        <p className="text-gray-500 text-sm">{new Date(order.date).toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-xl text-green-600">{order.total.toFixed(2)} AZN</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-700 mb-2">{language === 'AZ' ? 'Müştəri Məlumatları:' : 'Customer Details:'}</h4>
                      <p className="text-gray-600">{order.customerName} {order.customerSurname}</p>
                      <p className="text-gray-600">{order.phone}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">{language === 'AZ' ? 'Məhsullar:' : 'Items:'}</h4>
                      <ul className="space-y-2">
                        {order.items.map((item, idx) => (
                          <li key={idx} className="flex justify-between text-sm">
                            <span>{item.quantity}x {item.product.name}</span>
                            <span className="font-medium">{(item.product.price * item.quantity).toFixed(2)} AZN</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-500">{language === 'AZ' ? 'Status:' : 'Status:'}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          order.status === 'approved' ? 'bg-green-100 text-green-700' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.status === 'approved' ? (language === 'AZ' ? 'Təsdiqləndi' : 'Approved') :
                           order.status === 'cancelled' ? (language === 'AZ' ? 'Ləğv Edildi' : 'Cancelled') :
                           (language === 'AZ' ? 'Gözləyir' : 'Pending')}
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        {order.status !== 'approved' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'approved')}
                            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                          >
                            {language === 'AZ' ? 'Təsdiqlə' : 'Approve'}
                          </button>
                        )}
                        {order.status !== 'cancelled' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'cancelled')}
                            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                          >
                            {language === 'AZ' ? 'Ləğv Et' : 'Cancel'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
