import React, { useEffect, useState } from 'react';
import { checkAuth } from './services/auth';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import CreatePost from './components/CreatePost';
import WelcomeScreen from './components/WelcomeScreen';
import { getAllPosts } from './services/posts';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
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
        }
      } catch (error) {
        console.error('Auth verification error:', error);
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
        return; // Don't fetch posts if not logged in
      }
      
      console.log("User authenticated, fetching posts:", user);
      try {
        const data = await getAllPosts();
        console.log("Posts fetched successfully:", data);
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
        // If unauthorized, ensure we clear the posts
        if (error.message && error.message.includes('must be logged in')) {
          setPosts([]);
        }
      }
    };

    fetchPosts();
  }, [user]); // Refetch when user changes (login/logout)

  const handleLoginSuccess = (userData) => {
    console.log("Login success, setting user data:", userData);
    setUser(userData);
    setShowLogin(false);
  };

  const handleRegisterSuccess = () => {
    setShowRegister(false);
    setShowLogin(true); // Show login form after successful registration
  };

  const handleLogout = () => {
    // Clear user state
    setUser(null);
    // Clear localStorage
    localStorage.removeItem('user');
    // Reset UI state
    setShowLogin(false);
    setShowRegister(false);
  };
  
  const handlePostCreated = async () => {
    // Fetch all posts again after a new post is created
    try {
      const data = await getAllPosts();
      setPosts(data);
    } catch (error) {
      console.error('Error refreshing posts:', error);
    }
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar 
        user={user} 
        onLogout={handleLogout} 
      />
      
      <div style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h1>Choikk Forum</h1>
          <div>
            {!user && (
              <div>
                <button 
                  onClick={() => { setShowLogin(true); setShowRegister(false); }}
                  style={{ marginRight: '0.5rem' }}
                >
                  Login
                </button>
                <button 
                  onClick={() => { setShowRegister(true); setShowLogin(false); }}
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
        
        {!user ? (
          // Show authentication forms if not logged in
          <div>
            {showLogin ? (
              <div style={{ marginBottom: '2rem' }}>
                <Login onLoginSuccess={handleLoginSuccess} />
                <p>
                  Don't have an account? 
                  <button 
                    onClick={() => { setShowRegister(true); setShowLogin(false); }}
                    style={{ marginLeft: '0.5rem', background: 'none', border: 'none', color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                  >
                    Register here
                  </button>
                </p>
              </div>
            ) : showRegister ? (
              <div style={{ marginBottom: '2rem' }}>
                <Register onRegisterSuccess={handleRegisterSuccess} />
                <p>
                  Already have an account? 
                  <button 
                    onClick={() => { setShowLogin(true); setShowRegister(false); }}
                    style={{ marginLeft: '0.5rem', background: 'none', border: 'none', color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                  >
                    Login here
                  </button>
                </p>
              </div>
            ) : (
              <WelcomeScreen 
                onLoginClick={() => { setShowLogin(true); setShowRegister(false); }} 
                onRegisterClick={() => { setShowRegister(true); setShowLogin(false); }} 
              />
            )}
          </div>
        ) : (
          // Show content only if logged in
          <div>
            <div style={{ marginBottom: '2rem', border: '1px solid #ccc', padding: '1rem', borderRadius: '4px' }}>
              <CreatePost onPostCreated={handlePostCreated} />
            </div>
               <div>
            <h2>Recent Posts</h2>
            {posts ? (
              posts.length === 0 ? (
                <p>No posts found. The database has posts but they were not returned properly.</p>
              ) : (
                posts.map(post => (
                  <div key={post.id} className="post-card">
                    <h2 className="post-title">{post.title}</h2>
                    <p className="post-content">{post.content}</p>
                    <div className="post-meta">
                      <span>By <strong>{post.author}</strong> at {post.timestamp}</span>
                      {post.tags && post.tags.length > 0 && (
                        <div className="post-tags">
                          {post.tags.map((tag, index) => (
                            <span key={index} className="tag">{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )
            ) : (
              <p>Loading posts...</p>
            )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
