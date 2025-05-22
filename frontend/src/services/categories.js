import { getCsrfToken } from './auth';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Add CSRF token to headers if available
const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  const token = getCsrfToken();
  if (token) {
    headers['X-CSRF-Token'] = token;
  }
  
  return headers;
};

// Get all categories
export const getAllCategories = async () => {
  try {
    const response = await fetch(`${API_URL}/categories`, {
      method: 'GET',
      credentials: 'include',
      headers: getHeaders()
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch categories');
    }
    
    return data.categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Get posts for a specific category
export const getCategoryPosts = async (categoryId, page = 1, perPage = 10) => {
  try {
    const response = await fetch(
      `${API_URL}/categories/${categoryId}/posts?page=${page}&per_page=${perPage}`, 
      {
        method: 'GET',
        credentials: 'include',
        headers: getHeaders()
      }
    );
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch category posts');
    }
    
    return {
      posts: data.posts || [],
      pagination: data.pagination || null
    };
  } catch (error) {
    console.error(`Error fetching posts for category ${categoryId}:`, error);
    throw error;
  }
};
