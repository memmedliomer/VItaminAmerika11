import { useAppStore } from '../store';
import ProductCard from '../components/ProductCard';
import Marquee from '../components/Marquee';
import { useSearchParams } from 'react-router-dom';

export default function Home() {
  const { products, language, categories } = useAppStore();
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category');
  const searchQuery = searchParams.get('search');

  let filteredProducts = products;

  if (categoryId) {
    filteredProducts = filteredProducts.filter(p => p.categoryId === categoryId);
  }

  if (searchQuery) {
    const lowerQuery = searchQuery.toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) || 
      p.description.toLowerCase().includes(lowerQuery)
    );
  }

  // Show latest products first
  filteredProducts = [...filteredProducts].reverse();

  const categoryName = categoryId 
    ? categories.find(c => c.id === categoryId)?.name 
    : language === 'AZ' ? 'Bütün Məhsullar' : 'All Products';

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Marquee />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900">
            {searchQuery 
              ? (language === 'AZ' ? `Axtarış nəticələri: "${searchQuery}"` : `Search results: "${searchQuery}"`)
              : categoryName
            }
          </h1>
          <span className="text-gray-500 font-medium bg-white px-4 py-1.5 rounded-full shadow-sm border border-gray-100">
            {filteredProducts.length} {language === 'AZ' ? 'məhsul' : 'products'}
          </span>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-lg">
              {language === 'AZ' ? 'Heç bir məhsul tapılmadı.' : 'No products found.'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
