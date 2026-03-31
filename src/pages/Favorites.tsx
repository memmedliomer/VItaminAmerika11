import { useAppStore } from '../store';
import ProductCard from '../components/ProductCard';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Favorites() {
  const { favorites, products, language } = useAppStore();

  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  if (favoriteProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <Heart size={48} className="text-red-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {language === 'AZ' ? 'Seçilmişləriniz boşdur' : 'Your selected items are empty'}
        </h2>
        <p className="text-gray-500 mb-8 text-center max-w-md">
          {language === 'AZ' ? 'Bəyəndiyiniz məhsulları seçilmişlərə əlavə edərək daha sonra asanlıqla tapa bilərsiniz.' : 'Add products you like to selected to easily find them later.'}
        </p>
        <Link to="/" className="px-8 py-3 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-colors shadow-sm hover:shadow-md">
          {language === 'AZ' ? 'Məhsullara bax' : 'View products'}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="mb-8 flex items-center gap-3">
        <Heart size={32} className="text-red-500 fill-red-500" />
        <h1 className="text-3xl font-bold text-gray-900">
          {language === 'AZ' ? 'Seçilmişlərim' : 'My Selected Items'}
        </h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {favoriteProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
