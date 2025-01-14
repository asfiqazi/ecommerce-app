import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../theme';

// Custom wrapper for providers
const AllProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
};

// Custom render with providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllProviders, ...options });

// Mock data generators
export const generateMockUser = (overrides = {}) => ({
  id: 'user-123',
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  role: 'user',
  createdAt: new Date().toISOString(),
  ...overrides
});

export const generateMockProduct = (overrides = {}) => ({
  id: 'product-123',
  name: 'Test Product',
  description: 'A test product description',
  price: 99.99,
  category: 'electronics',
  brand: 'Test Brand',
  imageUrls: ['https://example.com/image.jpg'],
  stockQuantity: 10,
  rating: 4.5,
  ...overrides
});

export const generateMockReview = (overrides = {}) => ({
  id: 'review-123',
  userId: 'user-123',
  rating: 4,
  comment: 'Great product!',
  createdAt: new Date().toISOString(),
  ...overrides
});

// Export custom render and mock generators
export { customRender as render };
