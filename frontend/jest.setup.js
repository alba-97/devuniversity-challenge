import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: {},
      asPath: '',
      push: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforeHistoryChange: jest.fn(),
      isReady: true,
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      }
    };
  },
}));

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: {},
      asPath: '',
      push: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforeHistoryChange: jest.fn(),
      isReady: true,
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    };
  },
  usePathname() {
    return '/';
  },
}));

// Mock AuthContext
jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
  }),
  AuthProvider: ({ children }) => children,
}));

// Mock AuthService
jest.mock('@/services/AuthService', () => ({
  AuthService: {
    login: jest.fn(),
    register: jest.fn(),
    getCurrentUser: jest.fn(),
    logout: jest.fn(),
  },
}));

// Mock TaskService
jest.mock('@/services/TaskService', () => ({
  TaskService: {
    getTasks: jest.fn(),
    createTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
  },
}));

// Silence console errors during testing
console.error = jest.fn();
