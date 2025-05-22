import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { checkAuth, logout } from './services/auth';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import CreatePost from './components/CreatePost';
import WelcomeScreen from './components/WelcomeScreen';
import PostDetail from './components/PostDetail';
import UserProfile from './components/UserProfile';
import { getAllPosts } from './services/posts';
import './App.css';
import './custom.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // First check localStorage for existing user
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        
        // Then verify with server
        const response = await checkAuth();
        if (response.authenticated) {
          setUser(response.user);
        } else {
          // If server says not authenticated, clear user state
          setUser(null);
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Auth verification error:', error);
        setUser(null);
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);
  
  // Fetch posts only if user is logged in
  useEffect(() => {
    const fetchPosts = async () => {
      if (!user) {
        console.log("No user, skipping posts fetch");
        setPosts([]);
        return; // Don't fetch posts if not logged in
      }
      
      console.log("User authenticated, fetching posts");
      try {
        const data = await getAllPosts();
        console.log("Posts fetched successfully:", data);
        setPosts(data.posts || []);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts([]);
      }
    };

    fetchPosts();
  }, [user]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/categories', {
          credentials: 'include'
        });
        const data = await response.json();
        setCategories(data.categories || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleLoginSuccess = (userData) => {
    console.log("Login success, setting user data:", userData);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogoutClick = async () => {
    try {
      await logout();
      // Clear user state
      setUser(null);
      // Clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('csrfToken');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Navbar user={user} onLogout={handleLogoutClick} categories={categories} />
        
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={
              user ? <WelcomeScreen user={user} posts={posts} /> : <Navigate to="/login" />
            } />
            
            <Route 
              path="/login" 
              element={user ? <Navigate to="/" /> : <Login onLoginSuccess={handleLoginSuccess} />} 
            />
            
            <Route 
              path="/register" 
              element={user ? <Navigate to="/" /> : <Register />} 
            />
            
            <Route 
              path="/create-post" 
              element={user ? <CreatePost categories={categories} /> : <Navigate to="/login" />} 
            />
            
            <Route 
              path="/post/:id" 
              element={user ? <PostDetail /> : <Navigate to="/login" />} 
            />
            
            <Route 
              path="/profile" 
              element={user ? <UserProfile /> : <Navigate to="/login" />} 
            />
            
            <Route 
              path="/category/:id" 
              element={user ? <WelcomeScreen user={user} isCategoryView={true} /> : <Navigate to="/login" />} 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
