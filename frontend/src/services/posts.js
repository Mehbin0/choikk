// Posts service

const API_URL = 'http://127.0.0.1:5000';

export const getAllPosts = async () => {
  try {
    console.log('Fetching all posts from:', `${API_URL}/posts`);
    
    // Temporarily use the test_posts endpoint which doesn't require authentication
    const response = await fetch(`${API_URL}/test_posts`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(errorText || `Failed to fetch posts: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Posts data received:', data);
    
    // Check both data.posts and data format
    if (data.posts) {
      return data.posts;
    } else if (Array.isArray(data)) {
      return data;
    } else {
      console.warn('Unexpected response format:', data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

export const getPost = async (id) => {
  try {
    const response = await fetch(`${API_URL}/posts/${id}`, {
      credentials: 'include'
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

export const createPost = async (title, content, tags = []) => {
  try {
    const response = await fetch(`${API_URL}/add_post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content, tags }),
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
      credentials: 'include'
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
