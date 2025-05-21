import React from 'react';

const WelcomeScreen = ({ onLoginClick, onRegisterClick }) => {
  return (
    <div className="welcome-screen">
      <h1 className="welcome-title">Welcome to Choikk Forum</h1>
      
      <p className="welcome-message">
        This is a members-only forum where users can share thoughts, ask questions, 
        and engage in discussions. Please login or register to access all content.
      </p>
      
      <div className="auth-buttons">
        <button 
          className="btn btn-primary" 
          onClick={onLoginClick}
        >
          Login
        </button>
        <button 
          className="btn btn-success"
          onClick={onRegisterClick}
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
