// Jest setup file
import '@testing-library/jest-dom';
import 'whatwg-fetch';

// Mock environment variables
Object.defineProperty(window, 'env', {
  value: {
    VITE_API_BASE_URL: 'http://localhost:3000/api',
    VITE_STRIPE_PUBLISHABLE_KEY: 'test_stripe_key'
  },
  writable: false
});

// Mock localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock window methods
window.scrollTo = jest.fn();

// Suppress specific warnings
const originalConsoleError = console.error;
console.error = jest.fn((message, ...args) => {
  const suppressedMessages = [
    'Warning: An update inside a test was not wrapped in act(...)',
    'Warning: ReactDOM.render is no longer supported in React 18'
  ];

  if (!suppressedMessages.some(msg => message.includes(msg))) {
    originalConsoleError(message, ...args);
  }
});

// Global test cleanup
afterEach(() => {
  jest.clearAllMocks();
  localStorageMock.clear();
});
