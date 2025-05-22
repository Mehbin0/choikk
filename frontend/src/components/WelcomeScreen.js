import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getAllPosts } from '../services/posts';
import { getCategoryPosts } from '../services/categories';
import '../custom.css';

const WelcomeScreen = ({ user, posts: initialPosts, isCategoryView }) => {
  const [posts, setPosts] = useState(initialPosts || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    perPage: 10
  });
  
  const { id: categoryId } = useParams();
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        
        let result;
        if (isCategoryView && categoryId) {
          // Fetch posts for specific category
          result = await getCategoryPosts(categoryId, pagination.currentPage, pagination.perPage);
          setCategory(result.category);
        } else {
          // Fetch all posts
          result = await getAllPosts(pagination.currentPage, pagination.perPage);
        }
        
        setPosts(result.posts || []);
        setPagination(result.pagination || pagination);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, [categoryId, isCategoryView, pagination.currentPage, pagination.perPage]);
  
  const handlePageChange = (newPage) => {
    setPagination(prev => ({
      ...prev,
      currentPage: newPage
    }));
  };
  
  if (!user) {
    return (
      <div className="welcome-screen">
        <h1 className="welcome-title">Welcome to Choikk Forum</h1>
        
        <p className="welcome-message">
          This is a members-only forum where users can share thoughts, ask questions, 
          and engage in discussions. Please login or register to access all content.
        </p>
        
        <div className="auth-buttons">
          <Link to="/login" className="btn btn-primary me-2">Login</Link>
          <Link to="/register" className="btn btn-success">Register</Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="forum-container">
      <div className="forum-header mb-4">
        <h1>{isCategoryView && category ? `${category.name} Posts` : 'Recent Posts'}</h1>
        {isCategoryView && category && <p>{category.description}</p>}
        <Link to="/create-post" className="btn btn-primary">Create New Post</Link>
      </div>
      
      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : posts.length === 0 ? (
        <div className="alert alert-info">
          {isCategoryView ? 'No posts in this category yet.' : 'No posts yet.'}
        </div>
      ) : (
        <>
          <div className="post-list">
            {posts.map(post => (
              <div key={post.id} className="post-card">
                <div className="post-header">
                  <h2 className="post-title">
                    <Link to={`/post/${post.id}`}>{post.title}</Link>
                  </h2>
                  <span className="post-meta">
                    {post.category && (
                      <span className="post-category badge bg-secondary me-2">{post.category}</span>
                    )}
                    <span className="post-date">{new Date(post.timestamp).toLocaleString()}</span>
                  </span>
                </div>
                <div className="post-author">
                  By: {post.author}
                </div>
                <div className="post-preview">
                  {post.content.length > 200 ? post.content.substring(0, 200) + '...' : post.content}
                </div>
                <div className="post-footer">
                  <div className="post-stats">
                    <span title="Views"><i className="bi bi-eye"></i> {post.view_count || 0}</span>
                    <span title="Comments"><i className="bi bi-chat"></i> {post.comment_count || 0}</span>
                    <span title="Likes"><i className="bi bi-heart"></i> {post.like_count || 0}</span>
                  </div>
                  <Link to={`/post/${post.id}`} className="btn btn-sm btn-outline-primary">Read More</Link>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination controls */}
          {pagination.totalPages > 1 && (
            <nav className="mt-4">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${pagination.currentPage === 1 ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                  >
                    Previous
                  </button>
                </li>
                
                {[...Array(pagination.totalPages).keys()].map(page => (
                  <li key={page + 1} className={`page-item ${pagination.currentPage === page + 1 ? 'active' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => handlePageChange(page + 1)}
                    >
                      {page + 1}
                    </button>
                  </li>
                ))}
                
                <li className={`page-item ${pagination.currentPage === pagination.totalPages ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
};

export default WelcomeScreen;
