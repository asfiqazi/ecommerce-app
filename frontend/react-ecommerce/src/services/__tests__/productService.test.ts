import { productService } from '../productService';
import { api } from '../../utils/api';
import { logger } from '../../utils/logger';
import { performanceMonitor } from '../../utils/performance';

// Mock dependencies
jest.mock('../../utils/api');
jest.mock('../../utils/logger');
jest.mock('../../utils/performance');

describe('ProductService', () => {
  const mockProducts = [
    {
      id: 'product-1',
      name: 'Test Product 1',
      description: 'Test Description 1',
      price: 99.99,
      category: 'electronics',
      brand: 'Test Brand',
      imageUrls: ['https://example.com/image1.jpg'],
      stockQuantity: 10
    },
    {
      id: 'product-2',
      name: 'Test Product 2',
      description: 'Test Description 2',
      price: 149.99,
      category: 'clothing',
      brand: 'Another Brand',
      imageUrls: ['https://example.com/image2.jpg'],
      stockQuantity: 5
    }
  ];

  const mockReviews = [
    {
      id: 'review-1',
      userId: 'user-123',
      rating: 4,
      comment: 'Great product!',
      createdAt: new Date().toISOString()
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProducts', () => {
    it('should fetch products with pagination and filters', async () => {
      // Mock API and performance monitor
      (api.get as jest.Mock).mockResolvedValue({
        products: mockProducts,
        total: 2,
        page: 1,
        limit: 20
      });
      (performanceMonitor.measureAsync as jest.Mock).mockImplementation(
        async (name, fn) => await fn()
      );

      const result = await productService.getProducts(1, 20, { 
        category: 'electronics' 
      });

      // Verify API call
      expect(api.get).toHaveBeenCalledWith('/products', {
        params: {
          page: 1,
          limit: 20,
          category: 'electronics'
        }
      });

      // Verify result
      expect(result.products).toEqual(mockProducts);
      expect(result.total).toBe(2);
    });
  });

  describe('getProductById', () => {
    it('should fetch a single product by ID', async () => {
      // Mock API and performance monitor
      (api.get as jest.Mock).mockResolvedValue(mockProducts[0]);
      (performanceMonitor.measureAsync as jest.Mock).mockImplementation(
        async (name, fn) => await fn()
      );

      const result = await productService.getProductById('product-1');

      // Verify API call
      expect(api.get).toHaveBeenCalledWith('/products/product-1');

      // Verify result
      expect(result).toEqual(mockProducts[0]);
    });
  });

  describe('searchProducts', () => {
    it('should search products', async () => {
      // Mock API and performance monitor
      (api.get as jest.Mock).mockResolvedValue({
        products: mockProducts,
        total: 2,
        page: 1,
        limit: 20
      });
      (performanceMonitor.measureAsync as jest.Mock).mockImplementation(
        async (name, fn) => await fn()
      );

      const result = await productService.searchProducts('test', 1, 20);

      // Verify API call
      expect(api.get).toHaveBeenCalledWith('/products/search', {
        params: {
          query: 'test',
          page: 1,
          limit: 20
        }
      });

      // Verify result
      expect(result.products).toEqual(mockProducts);
    });
  });

  describe('Product Reviews', () => {
    it('should add a product review', async () => {
      // Mock API
      (api.post as jest.Mock).mockResolvedValue({
        id: 'review-2',
        ...mockReviews[0]
      });

      const newReview = {
        userId: 'user-123',
        rating: 5,
        comment: 'Excellent product!'
      };

      const result = await productService.addProductReview(
        'product-1', 
        newReview
      );

      // Verify API call
      expect(api.post).toHaveBeenCalledWith(
        '/products/product-1/reviews', 
        newReview
      );

      // Verify result
      expect(result).toMatchObject({
        id: 'review-2',
        ...newReview
      });
    });

    it('should fetch product reviews', async () => {
      // Mock API and performance monitor
      (api.get as jest.Mock).mockResolvedValue({
        reviews: mockReviews,
        total: 1
      });
      (performanceMonitor.measureAsync as jest.Mock).mockImplementation(
        async (name, fn) => await fn()
      );

      const result = await productService.getProductReviews(
        'product-1', 
        1, 
        10
      );

      // Verify API call
      expect(api.get).toHaveBeenCalledWith(
        '/products/product-1/reviews', 
        { params: { page: 1, limit: 10 } }
      );

      // Verify result
      expect(result.reviews).toEqual(mockReviews);
      expect(result.total).toBe(1);
    });
  });

  describe('getCategories', () => {
    it('should fetch product categories', async () => {
      // Mock API
      (api.get as jest.Mock).mockResolvedValue([
        'electronics', 
        'clothing', 
        'books'
      ]);

      const result = await productService.getCategories();

      // Verify API call
      expect(api.get).toHaveBeenCalledWith('/products/categories');

      // Verify result
      expect(result).toEqual(['electronics', 'clothing', 'books']);
    });
  });
});
