import React from 'react';
import { logout } from '../services/auth';

const Navbar = ({ user, onLogout }) => {
  const handleLogout = async () => {
    try {
      await logout();
      if (onLogout) {
        onLogout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      padding: '1rem',
      backgroundColor: '#f8f9fa',
      borderBottom: '1px solid #e9ecef',
      marginBottom: '1rem'
    }}>
      <div className="logo">
        <h2 style={{ margin: 0 }}>Choikk Forum</h2>
      </div>      <div className="user-menu">
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>Welcome, <strong>{user.username}</strong></span>
            <button 
              onClick={handleLogout}
              style={{ 
                padding: '0.25rem 0.75rem', 
                backgroundColor: '#dc3545', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <span style={{ color: '#6c757d' }}>
            <strong>Members Only Forum</strong> - Login to Access
          </span>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
