import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AuthChecker from './AuthChecker';
import { useAuth } from '../../contexts/AuthContext';

// Mock the useAuth hook
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// Mock the react-router-dom useNavigate hook
const mockedUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}));

describe('AuthChecker', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  test('redirects to /login if user is not authenticated and accessing a protected route', () => {
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: false });
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <AuthChecker>
          <div>Protected Content</div>
        </AuthChecker>
      </MemoryRouter>
    );
    expect(mockedUseNavigate).toHaveBeenCalledWith('/login');
  });

  test('renders children if user is authenticated and accessing a protected route', () => {
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true });
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <AuthChecker>
          <div>Protected Content</div>
        </AuthChecker>
      </MemoryRouter>
    );
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(mockedUseNavigate).not.toHaveBeenCalled();
  });

  test('renders children if accessing a public route regardless of authentication state', () => {
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: false });
    render(
      <MemoryRouter initialEntries={['/public']}>
        <AuthChecker>
          <div>Public Content</div>
        </AuthChecker>
      </MemoryRouter>
    );
    // For unauthenticated user on a generic public route, expect redirect to /login
    expect(mockedUseNavigate).toHaveBeenCalledWith('/login');

    // Clear mock for the next part of the test
    mockedUseNavigate.mockClear();

    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true });
    render(
      <MemoryRouter initialEntries={['/public']}>
        <AuthChecker>
          <div>Public Content</div>
        </AuthChecker>
      </MemoryRouter>
    );
    expect(screen.getByText('Public Content')).toBeInTheDocument();
    expect(mockedUseNavigate).not.toHaveBeenCalled();
  });

  test('redirects to / if user is authenticated and accessing /login or /signup', () => {
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true });
    render(
      <MemoryRouter initialEntries={['/login']}>
        <AuthChecker>
          <div>Login Page</div>
        </AuthChecker>
      </MemoryRouter>
    );
    expect(mockedUseNavigate).toHaveBeenCalledWith('/');

    mockedUseNavigate.mockClear(); // Clear mock for the next assertion

    render(
      <MemoryRouter initialEntries={['/signup']}>
        <AuthChecker>
          <div>Signup Page</div>
        </AuthChecker>
      </MemoryRouter>
    );
    expect(mockedUseNavigate).toHaveBeenCalledWith('/');
  });

  test('renders children if user is not authenticated and accessing /login or /signup', () => {
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: false });
    render(
      <MemoryRouter initialEntries={['/login']}>
        <AuthChecker>
          <div>Login Page</div>
        </AuthChecker>
      </MemoryRouter>
    );
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(mockedUseNavigate).not.toHaveBeenCalled();

    render(
      <MemoryRouter initialEntries={['/signup']}>
        <AuthChecker>
          <div>Signup Page</div>
        </AuthChecker>
      </MemoryRouter>
    );
    expect(screen.getByText('Signup Page')).toBeInTheDocument();
    expect(mockedUseNavigate).not.toHaveBeenCalled();
  });
});
