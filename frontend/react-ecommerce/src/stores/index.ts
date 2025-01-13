import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Combine all store types
export interface RootState {
  // Add references to all stores
  auth: ReturnType<typeof useAuthStore>;
  cart: ReturnType<typeof useCartStore>;
  // Add other stores as needed
}

// Create a global store context
export const useRootStore = create<RootState>((get) => ({
  auth: useAuthStore(get),
  cart: useCartStore(get),
  // Initialize other stores
}));

// Persist middleware configuration
const persistOptions = {
  storage: createJSONStorage(() => localStorage),
  partialize: (state: RootState) => ({
    // Specify which parts of the state to persist
    auth: {
      token: state.auth.token,
      user: state.auth.user
    },
    cart: {
      items: state.cart.items
    }
  })
};

// Export store hooks with persistence
export const useAuthStore = create(
  persist(
    (set, get) => ({
      // Authentication state
      token: null,
      user: null,
      isAuthenticated: false,

      // Login method
      login: async (email: string, password: string) => {
        try {
          // Implement login logic
          const response = await api.post('/auth/login', { email, password });
          
          set({
            token: response.data.token,
            user: response.data.user,
            isAuthenticated: true
          });

          return response.data.user;
        } catch (error) {
          set({ token: null, user: null, isAuthenticated: false });
          throw error;
        }
      },

      // Logout method
      logout: () => {
        set({ token: null, user: null, isAuthenticated: false });
      },

      // Refresh token method
      refreshToken: async () => {
        try {
          const response = await api.post('/auth/refresh-token');
          set({ token: response.data.token });
          return response.data.token;
        } catch (error) {
          // Logout if refresh fails
          set({ token: null, user: null, isAuthenticated: false });
          throw error;
        }
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user
      })
    }
  )
);

export const useCartStore = create(
  persist(
    (set, get) => ({
      // Cart state
      items: [],

      // Add to cart method
      addToCart: (product: any) => {
        set((state) => {
          const existingItem = state.items.find(item => item.id === product.id);
          
          if (existingItem) {
            return {
              items: state.items.map(item => 
                item.id === product.id 
                  ? { ...item, quantity: (item.quantity || 1) + 1 }
                  : item
              )
            };
          }

          return {
            items: [...state.items, { ...product, quantity: 1 }]
          };
        });
      },

      // Remove from cart method
      removeFromCart: (productId: string) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== productId)
        }));
      },

      // Clear cart method
      clearCart: () => {
        set({ items: [] });
      },

      // Calculate total price
      getTotalPrice: () => {
        return get().items.reduce((total, item) => 
          total + (item.price * (item.quantity || 1)), 
          0
        );
      }
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items
      })
    }
  )
);
