import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials: true, // Important for cookies
    headers: {
        'Content-Type': 'application/json'
    }
});

const authService = {    register: async (username, password) => {
        try {
            console.log('Attempting to register user:', username);
            const response = await api.post('/register', { 
                username, 
                password
            });
            console.log('Registration response:', response.status, response.statusText);
            return response.data;
        } catch (error) {
            console.error('Registration error details:', error.message);
            if (error.response) {
                console.error('Server response:', error.response.status, error.response.data);
            }
            throw error;
        }
    },
    
    login: async (username, password) => {
        try {
            // Clear any previous logout flag
            sessionStorage.removeItem('forceLogout');
            
            const response = await api.post('/login', { username, password });
            // Store user info for persistence
            if (response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    logout: async () => {
        // Mark as logged out immediately - no matter what happens with API
        sessionStorage.setItem('forceLogout', 'true');
        
        // Clear local storage
        localStorage.removeItem('user');
        
        try {
            // Make sure we're creating a fresh request with no cached credentials
            const response = await fetch('/logout', {
                method: 'POST',
                credentials: 'include',
                cache: 'no-store',
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });
            
            // Don't clear sessionStorage here as it would remove our forceLogout flag
            // Only clear other items selectively if needed
            
            return await response.json();
        } catch (error) {
            console.error("Logout API call failed:", error);
            return { message: "Logged out locally" };
        }
    },    checkAuthStatus: async () => {
        // If we just logged out or are in the process of logging out, return not authenticated without checking
        if (sessionStorage.getItem('forceLogout') === 'true') {
            console.log('Auth Service: forceLogout flag detected');
            return { isAuthenticated: false };
        }
        
        try {
            console.log('Checking auth status...');
            // Add cache busting to prevent cached responses
            const response = await api.get(`/auth/status?_=${new Date().getTime()}`);
            
            console.log('Auth status response:', response.data);
            // Update local storage if authenticated
            if (response.data.isAuthenticated && response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                console.log('User authenticated:', response.data.user.username);
            } else if (!response.data.isAuthenticated) {
                // If not authenticated, clear any local auth data
                console.log('User not authenticated, clearing local storage');
                localStorage.removeItem('user');
            }
            
            return response.data;
        } catch (error) {
            // If auth check fails, clear any local auth data
            localStorage.removeItem('user');
            throw error;
        }
    },

    // Helper to get current user from localStorage
    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch {
                localStorage.removeItem('user');
                return null;
            }
        }
        return null;
    }
};

// Add interceptor to handle 401 responses globally
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            // Clear local data on auth failures
            localStorage.removeItem('user');
        }
        return Promise.reject(error);
    }
);

export default authService;
