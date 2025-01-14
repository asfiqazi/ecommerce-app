import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
}

interface CartState {
  items: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (product: Product) => {
        set((state) => {
          // Check if product already exists in cart
          const existingProduct = state.items.find(item => item.id === product.id);
          
          if (existingProduct) {
            return state; // Prevent duplicates
          }

          return { 
            items: [...state.items, product] 
          };
        });
      },

      removeFromCart: (productId: string) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== productId)
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price, 0);
      }
    }),
    {
      name: 'cart-storage',
      getStorage: () => localStorage,
    }
  )
);

export default useCartStore;
