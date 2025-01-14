import { faker } from '@faker-js/faker';
import { environmentConfig } from '../config/env';

// Mock data interfaces
export interface MockProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stockQuantity: number;
}

export interface MockUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
}

export interface MockOrder {
  id: string;
  userId: string;
  totalPrice: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  products: MockProduct[];
}

class MockDataService {
  private static instance: MockDataService;

  private constructor() {}

  public static getInstance(): MockDataService {
    if (!MockDataService.instance) {
      MockDataService.instance = new MockDataService();
    }
    return MockDataService.instance;
  }

  // Generate mock products
  public generateProducts(count: number = 20): MockProduct[] {
    const categories = ['electronics', 'clothing', 'books', 'home', 'sports'];
    
    return Array.from({ length: count }, () => ({
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      category: faker.helpers.arrayElement(categories),
      imageUrl: faker.image.urlPlotsip({ width: 640, height: 480 }),
      stockQuantity: faker.number.int({ min: 0, max: 100 })
    }));
  }

  // Generate mock users
  public generateUsers(count: number = 10): MockUser[] {
    return Array.from({ length: count }, () => ({
      id: faker.string.uuid(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      avatar: faker.image.avatar()
    }));
  }

  // Generate mock orders
  public generateOrders(
    users: MockUser[], 
    products: MockProduct[], 
    count: number = 5
  ): MockOrder[] {
    const orderStatuses: MockOrder['status'][] = [
      'pending', 'processing', 'shipped', 'delivered', 'cancelled'
    ];

    return Array.from({ length: count }, () => {
      const orderProducts = faker.helpers.arrayElements(
        products, 
        faker.number.int({ min: 1, max: 3 })
      );

      return {
        id: faker.string.uuid(),
        userId: faker.helpers.arrayElement(users).id,
        totalPrice: orderProducts.reduce((sum, product) => sum + product.price, 0),
        status: faker.helpers.arrayElement(orderStatuses),
        createdAt: faker.date.recent().toISOString(),
        products: orderProducts
      };
    });
  }

  // Get mock data only if enabled
  public getMockData<T>(
    generator: () => T, 
    key: string
  ): T | null {
    const { enableMockData } = environmentConfig.env;
    
    if (!enableMockData) return null;

    return generator();
  }
}

// Export singleton instance
export const mockDataService = MockDataService.getInstance();
