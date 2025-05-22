import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import App from './App';
import Login from './components/Login';
import WelcomeScreen from './components/WelcomeScreen';
import { login, register } from './services/auth';

// Mock the services
jest.mock('./services/auth');
jest.mock('./services/posts');

describe('App Component', () => {
  test('renders login page when not authenticated', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    
    // Loading state first
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    
    // After loading, it should redirect to login
    // This part needs more complex setup with mocks and async testing
  });
});

describe('Login Component', () => {
  test('renders login form', () => {
    const mockLoginSuccess = jest.fn();
    
    render(
      <BrowserRouter>
        <Login onLoginSuccess={mockLoginSuccess} />
      </BrowserRouter>
    );
    
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  test('calls login service on submit', async () => {
    const mockLoginSuccess = jest.fn();
    login.mockResolvedValue({ user: { username: 'testuser' } });
    
    render(
      <BrowserRouter>
        <Login onLoginSuccess={mockLoginSuccess} />
      </BrowserRouter>
    );
    
    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: 'testuser' },
    });
    
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'password123' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    
    await waitFor(() => {
      expect(login).toHaveBeenCalledWith('testuser', 'password123');
      expect(mockLoginSuccess).toHaveBeenCalled();
    });
  });
});

describe('WelcomeScreen Component', () => {
  test('renders welcome message for guest users', () => {
    render(
      <BrowserRouter>
        <WelcomeScreen />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/Welcome to Choikk Forum/i)).toBeInTheDocument();
    expect(screen.getByText(/This is a members-only forum/i)).toBeInTheDocument();
  });
  
  test('renders posts for logged in users', () => {
    const user = { id: 1, username: 'testuser' };
    const posts = [
      { 
        id: 1, 
        title: 'Test Post', 
        content: 'This is a test post', 
        author: 'admin',
        timestamp: new Date().toISOString(),
        category: 'General',
        view_count: 5,
        comment_count: 2,
        like_count: 3
      }
    ];
    
    render(
      <BrowserRouter>
        <WelcomeScreen user={user} posts={posts} />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/Test Post/i)).toBeInTheDocument();
    expect(screen.getByText(/This is a test post/i)).toBeInTheDocument();
  });
});
