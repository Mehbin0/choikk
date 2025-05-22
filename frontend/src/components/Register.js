import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/auth';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();    // Check if user is already authenticated
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await authService.checkAuthStatus();
                if (response && response.isAuthenticated) {
                    // If already logged in, show message
                    alert('You are already logged in');
                }
            } catch (error) {
                // User is not authenticated, continue showing register page
                console.log('User not authenticated, showing register page');
            }
        };

        checkAuthStatus();
    }, [navigate]);const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        // Input validation
        if (!username || username.length < 3) {
            setError('Username must be at least 3 characters');
            return;
        }
        
        if (!password || password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        
        // Validate passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        
        setLoading(true);
        try {
            // Call the register method that we just added to authService
            const response = await authService.register(username, password);
            if (response && response.message) {
                // Registration successful
                console.log('Registration successful:', response.message);
                
                // Show success message and redirect to login after a short delay
                setError('');
                alert('Registration successful! You can now log in.');
                navigate('/login');
            }
        } catch (err) {
            console.error('Registration error:', err);
            // Extract error message from response if available
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError('Registration failed. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };    return (
        <div className="auth-container">
            <h2>Register for Choikk</h2>
            {error && (
                <div className="error-message" style={{ 
                    color: 'red', 
                    padding: '10px', 
                    marginBottom: '15px',
                    border: '1px solid red',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(255, 0, 0, 0.05)'
                }}>
                    {error}
                </div>
            )}
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
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
            <p>
                Already have an account? <Link to="/login">Login here</Link>
            </p>
        </div>
    );
};

export default Register;
