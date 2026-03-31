import { create } from 'zustand';

export type Product = {
  id: string;
  name: string;
  price: number; // Stored in AZN
  description: string;
  categoryId: string;
  imageUrl: string;
};

export type Category = {
  id: string;
  name: string;
};

export type PromoCode = {
  code: string;
  discountPercent: number;
};

export type OrderItem = {
  product: Product;
  quantity: number;
};

export type Order = {
  id: string;
  customerName: string;
  customerSurname: string;
  phone: string;
  items: OrderItem[];
  total: number;
  date: string;
};

export type ToastMessage = {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
};

interface AppState {
  language: 'AZ' | 'EN';
  currency: 'AZN' | 'USD';
  setLanguage: (lang: 'AZ' | 'EN') => void;
  setCurrency: (curr: 'AZN' | 'USD') => void;

  products: Product[];
  categories: Category[];
  promoCodes: PromoCode[];
  orders: Order[];
  
  cart: OrderItem[];
  favorites: string[];
  appliedPromo: PromoCode | null;
  toasts: ToastMessage[];

  fetchData: () => Promise<void>;
  addProduct: (p: Product) => Promise<void>;
  updateProduct: (id: string, p: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addCategory: (c: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addPromoCode: (pc: PromoCode) => Promise<void>;
  deletePromoCode: (code: string) => Promise<void>;
  addOrder: (o: Order) => Promise<void>;
  
  addToCart: (p: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  
  applyPromo: (code: string) => boolean;
  removePromo: () => void;

  toggleFavorite: (id: string) => void;
  
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  language: 'AZ',
  currency: 'AZN',
  setLanguage: (lang) => set({ language: lang }),
  setCurrency: (curr) => set({ currency: curr }),

  products: [],
  categories: [],
  promoCodes: [],
  orders: [],

  cart: JSON.parse(localStorage.getItem('cart') || '[]'),
  favorites: JSON.parse(localStorage.getItem('favorites') || '[]'),
  appliedPromo: null,
  toasts: [],

  fetchData: async () => {
    try {
      const [prods, cats, promos, orders] = await Promise.all([
        fetch('/api/products').then(res => res.json()),
        fetch('/api/categories').then(res => res.json()),
        fetch('/api/promos').then(res => res.json()),
        fetch('/api/orders').then(res => res.json()),
      ]);
      set({ products: prods, categories: cats, promoCodes: promos, orders });
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  },

  addProduct: async (p) => {
    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(p),
    });
    get().fetchData();
  },

  updateProduct: async (id, p) => {
    const product = get().products.find(prod => prod.id === id);
    if (!product) return;
    await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...product, ...p }),
    });
    get().fetchData();
  },

  deleteProduct: async (id) => {
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    get().fetchData();
  },

  addCategory: async (c) => {
    await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(c),
    });
    get().fetchData();
  },

  deleteCategory: async (id) => {
    await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    get().fetchData();
  },

  addPromoCode: async (pc) => {
    await fetch('/api/promos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pc),
    });
    get().fetchData();
  },

  deletePromoCode: async (code) => {
    await fetch(`/api/promos/${code}`, { method: 'DELETE' });
    get().fetchData();
  },

  addOrder: async (o) => {
    await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(o),
    });
    get().fetchData();
  },

  addToCart: (p) => {
    const cart = get().cart;
    const existing = cart.find(item => item.product.id === p.id);
    let newCart;
    if (existing) {
      newCart = cart.map(item =>
        item.product.id === p.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      newCart = [...cart, { product: p, quantity: 1 }];
    }
    set({ cart: newCart });
    localStorage.setItem('cart', JSON.stringify(newCart));
  },

  removeFromCart: (id) => {
    const newCart = get().cart.filter(item => item.product.id !== id);
    set({ cart: newCart });
    localStorage.setItem('cart', JSON.stringify(newCart));
  },

  updateQuantity: (id, qty) => {
    const newCart = get().cart.map(item =>
      item.product.id === id ? { ...item, quantity: Math.max(1, qty) } : item
    );
    set({ cart: newCart });
    localStorage.setItem('cart', JSON.stringify(newCart));
  },

  clearCart: () => {
    set({ cart: [], appliedPromo: null });
    localStorage.removeItem('cart');
  },

  applyPromo: (code) => {
    const promo = get().promoCodes.find(p => p.code === code);
    if (promo) {
      set({ appliedPromo: promo });
      return true;
    }
    return false;
  },

  removePromo: () => set({ appliedPromo: null }),

  toggleFavorite: (id) => {
    const favorites = get().favorites;
    let newFavorites;
    if (favorites.includes(id)) {
      newFavorites = favorites.filter(f => f !== id);
    } else {
      newFavorites = [...favorites, id];
    }
    set({ favorites: newFavorites });
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  },

  addToast: (message, type = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      get().removeToast(id);
    }, 3000);
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter(t => t.id !== id) })),
}));
