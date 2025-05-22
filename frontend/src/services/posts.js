// Posts service
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

export const getAllPosts = async (page = 1, perPage = 10, category = null, tag = null) => {
  try {
    console.log('Fetching all posts from:', `${API_URL}/posts`);
    
    let url = `${API_URL}/posts?page=${page}&per_page=${perPage}`;
    
    if (category) {
      url += `&category=${encodeURIComponent(category)}`;
    }
    
    if (tag) {
      url += `&tag=${encodeURIComponent(tag)}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: getHeaders()
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(errorText || `Failed to fetch posts: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Posts data received:', data);
    
    return {
      posts: data.posts || [],
      pagination: data.pagination || null
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

export const getPost = async (id) => {
  try {
    const response = await fetch(`${API_URL}/posts/${id}`, {
      credentials: 'include',
      headers: getHeaders()
    });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch post');
    }
    
    return data.post;
  } catch (error) {
    console.error(`Error fetching post ${id}:`, error);
    throw error;
  }
};

export const createPost = async (title, content, tags = [], category = 'General') => {
  try {
    const response = await fetch(`${API_URL}/add_post`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ title, content, tags, category }),
      credentials: 'include'
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create post');
    }
    
    return data.post;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export const getUserPosts = async () => {
  try {
    const response = await fetch(`${API_URL}/user/posts`, {
      credentials: 'include',
      headers: getHeaders()
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch user posts');
    }
    
    return data.posts;
  } catch (error) {
    console.error('Error fetching user posts:', error);
    throw error;
  }
};

// Comment related functions
export const getComments = async (postId) => {
  try {
    const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
      method: 'GET',
      credentials: 'include',
      headers: getHeaders()
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch comments');
    }
    
    return data.comments;
  } catch (error) {
    console.error(`Error fetching comments for post ${postId}:`, error);
    throw error;
  }
};

export const addComment = async (postId, content) => {
  try {
    const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ content }),
      credentials: 'include'
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to add comment');
    }
    
    return data.comment;
  } catch (error) {
    console.error(`Error adding comment to post ${postId}:`, error);
    throw error;
  }
};

export const deleteComment = async (commentId) => {
  try {
    const response = await fetch(`${API_URL}/comments/${commentId}`, {
      method: 'DELETE',
      headers: getHeaders(),
      credentials: 'include'
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete comment');
    }
    
    return data;
  } catch (error) {
    console.error(`Error deleting comment ${commentId}:`, error);
    throw error;
  }
};

// Like related functions
export const likePost = async (postId) => {
  try {
    const response = await fetch(`${API_URL}/posts/${postId}/like`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include'
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to like/unlike post');
    }
    
    return data;
  } catch (error) {
    console.error(`Error liking post ${postId}:`, error);
    throw error;
  }
};

export const getPostLikes = async (postId) => {
  try {
    const response = await fetch(`${API_URL}/posts/${postId}/likes`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include'
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get post likes');
    }
    
    return data;
  } catch (error) {
    console.error(`Error getting likes for post ${postId}:`, error);
    throw error;
  }
};

// Category related functions
export const getCategories = async () => {
  try {
    const response = await fetch(`${API_URL}/categories`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include'
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

export const getCategoryPosts = async (categoryId, page = 1, perPage = 10) => {
  try {
    const url = `${API_URL}/categories/${categoryId}/posts?page=${page}&per_page=${perPage}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include'
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch category posts');
    }
    
    return {
      category: data.category,
      posts: data.posts,
      pagination: data.pagination
    };
  } catch (error) {
    console.error(`Error fetching posts for category ${categoryId}:`, error);
    throw error;
  }
};
