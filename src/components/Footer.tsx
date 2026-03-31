import { useState } from 'react';
import { Instagram, Phone } from 'lucide-react';
import { useAppStore } from '../store';
import { motion, AnimatePresence } from 'motion/react';

export default function Footer() {
  const { language } = useAppStore();
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  return (
    <>
      <footer className="bg-green-800 text-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-center md:items-start">
            <span className="font-bold text-xl mb-2">Vitamin Amerika</span>
            <button 
              onClick={() => setIsAboutOpen(true)}
              className="text-green-200 hover:text-white transition-colors underline"
            >
              {language === 'AZ' ? 'Haqqımızda' : 'About Us'}
            </button>
          </div>
          
          <div className="flex gap-6">
            <a href="#" className="flex items-center gap-2 text-green-200 hover:text-white transition-colors">
              <Instagram size={24} />
              <span>@vitamin_amerika</span>
            </a>
            <a href="#" className="flex items-center gap-2 text-green-200 hover:text-white transition-colors">
              <Phone size={24} />
              <span>+1 234 567 8900</span>
            </a>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {isAboutOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setIsAboutOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
              <h2 className="text-2xl font-bold text-green-800 mb-4">
                {language === 'AZ' ? 'Haqqımızda' : 'About Us'}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {language === 'AZ' 
                  ? "Vitamin Amerika olaraq məqsədimiz sizə ABŞ-dan keyfiyyətli və etibarlı qida əlavələrini ən rahat şəkildə çatdırmaqdır. Biz yalnız yoxlanılmış və güvənilən məhsulları seçərək müştərilərimizə təqdim edirik. Siz məhsulu seçirsiniz, biz isə onu Amerika’dan sifariş edib birbaşa sizə çatdırırıq. Sadə, sürətli və etibarlı xidmət bizim əsas prinsipimizdir."
                  : "As Vitamin Amerika, our goal is to deliver quality and reliable dietary supplements from the USA to you in the most convenient way. We select and present only verified and trusted products to our customers. You choose the product, and we order it from America and deliver it directly to you. Simple, fast, and reliable service is our main principle."
                }
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
