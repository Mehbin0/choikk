// filepath: c:\Users\User\choikk\frontend\src\components\Login.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/auth';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if we just logged out - if so, don't check auth status
        const justLoggedOut = sessionStorage.getItem('justLoggedOut') === 'true';
        
        if (justLoggedOut) {
            // Clear the flag
            sessionStorage.removeItem('justLoggedOut');
            console.log('Just logged out, staying on login page');
            return;
        }        // Check if user is already authenticated
        const checkAuthStatus = async () => {
            try {
                const response = await authService.checkAuthStatus();
                if (response && response.isAuthenticated) {
                    // Just stay on login page since we have no other pages
                    console.log('User is authenticated');
                }
            } catch (error) {
                // User is not authenticated, continue showing login page
                console.log('User not authenticated, showing login page');
            }
        };

        checkAuthStatus();
        // Adding navigate as a dependency to avoid the exhaustive-deps warning
    }, [navigate]);    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authService.login(username, password);
            if (response && response.message) {
                // Show success message instead of navigating
                setError('');
                alert('Successfully logged in!');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <h2>Login to Choikk</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
            <p>
                Don't have an account? <Link to="/register">Register here</Link>
            </p>
        </div>
    );
};

export default Login;
