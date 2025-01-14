import { api, APIError } from '../utils/api';
import { logger } from '../utils/logger';
import { performanceMonitor } from '../utils/performance';

// Product-related interfaces
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  imageUrls: string[];
  stockQuantity: number;
  rating?: number;
  reviews?: ProductReview[];
}

export interface ProductReview {
  id: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ProductFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  inStock?: boolean;
}

export interface ProductPaginationResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

class ProductService {
  private static instance: ProductService;

  private constructor() {}

  public static getInstance(): ProductService {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService();
    }
    return ProductService.instance;
  }

  // Fetch products with advanced filtering and pagination
  public async getProducts(
    page: number = 1, 
    limit: number = 20, 
    filters: ProductFilter = {}
  ): Promise<ProductPaginationResponse> {
    try {
      return performanceMonitor.measureAsync(
        'Fetch Products',
        async () => {
          const response = await api.get<ProductPaginationResponse>('/products', {
            params: {
              page,
              limit,
              ...filters
            }
          });

          logger.info('Products fetched successfully', { 
            total: response.total, 
            page: response.page 
          });

          return response;
        }
      );
    } catch (error) {
      logger.error('Failed to fetch products', error);
      throw error;
    }
  }

  // Get product by ID
  public async getProductById(
    productId: string
  ): Promise<Product> {
    try {
      return performanceMonitor.measureAsync(
        `Fetch Product ${productId}`,
        async () => {
          const product = await api.get<Product>(`/products/${productId}`);
          
          logger.info('Product fetched successfully', { 
            productId: product.id 
          });

          return product;
        }
      );
    } catch (error) {
      logger.error(`Failed to fetch product ${productId}`, error);
      throw error;
    }
  }

  // Search products
  public async searchProducts(
    query: string, 
    page: number = 1, 
    limit: number = 20
  ): Promise<ProductPaginationResponse> {
    try {
      return performanceMonitor.measureAsync(
        'Search Products',
        async () => {
          const response = await api.get<ProductPaginationResponse>('/products/search', {
            params: {
              query,
              page,
              limit
            }
          });

          logger.info('Product search completed', { 
            query, 
            total: response.total 
          });

          return response;
        }
      );
    } catch (error) {
      logger.error('Product search failed', { query, error });
      throw error;
    }
  }

  // Add product review
  public async addProductReview(
    productId: string, 
    review: Omit<ProductReview, 'id' | 'createdAt'>
  ): Promise<ProductReview> {
    try {
      const newReview = await api.post<ProductReview>(
        `/products/${productId}/reviews`, 
        review
      );

      logger.info('Product review added', { 
        productId, 
        rating: review.rating 
      });

      return newReview;
    } catch (error) {
      logger.error('Failed to add product review', { productId, error });
      throw error;
    }
  }

  // Get product reviews
  public async getProductReviews(
    productId: string, 
    page: number = 1, 
    limit: number = 10
  ): Promise<{ reviews: ProductReview[]; total: number }> {
    try {
      return performanceMonitor.measureAsync(
        `Fetch Reviews for Product ${productId}`,
        async () => {
          const response = await api.get<{
            reviews: ProductReview[];
            total: number;
          }>(`/products/${productId}/reviews`, {
            params: { page, limit }
          });

          logger.info('Product reviews fetched', { 
            productId, 
            total: response.total 
          });

          return response;
        }
      );
    } catch (error) {
      logger.error(`Failed to fetch reviews for product ${productId}`, error);
      throw error;
    }
  }

  // Get product categories
  public async getCategories(): Promise<string[]> {
    try {
      const categories = await api.get<string[]>('/products/categories');
      
      logger.info('Product categories fetched', { 
        categoryCount: categories.length 
      });

      return categories;
    } catch (error) {
      logger.error('Failed to fetch product categories', error);
      throw error;
    }
  }
}

// Export singleton instance
export const productService = ProductService.getInstance();
