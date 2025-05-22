import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPost, likePost, getComments, addComment } from '../services/posts';
import { getCurrentUser } from '../services/auth';
import '../custom.css';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentContent, setCommentContent] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  
  const currentUser = getCurrentUser();
  
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        setLoading(true);
        const postData = await getPost(id);
        setPost(postData);
        setComments(postData.comments || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load post. It may have been deleted or you do not have permission to view it.');
        setLoading(false);
      }
    };
    
    fetchPostData();
  }, [id]);
  
  const handleLike = async () => {
    try {
      setLikeLoading(true);
      const likeData = await likePost(id);
      
      // Update post with new like status
      setPost(prev => ({
        ...prev,
        like_count: likeData.likes_count,
        liked_by_user: likeData.liked
      }));
      
      setLikeLoading(false);
    } catch (err) {
      console.error('Error liking/unliking post:', err);
      setLikeLoading(false);
    }
  };
  
  const handleAddComment = async (e) => {
    e.preventDefault();
    
    if (!commentContent.trim()) return;
    
    try {
      setSubmittingComment(true);
      const newComment = await addComment(id, commentContent);
      
      // Add the new comment to the list
      setComments(prev => [...prev, newComment]);
      setCommentContent('');
      setSubmittingComment(false);
    } catch (err) {
      console.error('Error adding comment:', err);
      setSubmittingComment(false);
    }
  };
  
  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading post...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          <h4>Error</h4>
          <p>{error}</p>
          <Link to="/" className="btn btn-primary">Return to Home</Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mt-4">
      <div className="post-container">
        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h2 className="mb-0">{post.title}</h2>
            <div>
              <span className="badge bg-primary me-2">{post.category}</span>
              {post.tags && post.tags.map(tag => (
                <span key={tag} className="badge bg-secondary me-1">{tag}</span>
              ))}
            </div>
          </div>
          <div className="card-body">
            <div className="post-metadata mb-3">
              <span className="author">
                <i className="bi bi-person-fill"></i> {post.author}
              </span>
              <span className="date ms-3">
                <i className="bi bi-calendar3"></i> {new Date(post.timestamp).toLocaleString()}
              </span>
              <span className="views ms-3">
                <i className="bi bi-eye-fill"></i> {post.view_count} views
              </span>
            </div>
            
            <div className="post-content mb-4">
              {post.content.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            
            <div className="post-actions d-flex">
              <button 
                className={`btn ${post.liked_by_user ? 'btn-primary' : 'btn-outline-primary'} me-2 d-flex align-items-center`}
                onClick={handleLike}
                disabled={likeLoading}
              >
                <i className={`bi ${post.liked_by_user ? 'bi-heart-fill' : 'bi-heart'} me-1`}></i>
                {likeLoading ? 'Processing...' : `${post.like_count} Like${post.like_count !== 1 ? 's' : ''}`}
              </button>
              <button 
                className="btn btn-outline-secondary d-flex align-items-center"
                onClick={() => document.getElementById('comment-input').focus()}
              >
                <i className="bi bi-chat-left-text me-1"></i>
                {post.comments ? post.comments.length : comments.length} Comments
              </button>
            </div>
          </div>
        </div>
        
        <div className="comments-section">
          <h3>Comments ({comments.length})</h3>
          
          {currentUser && (
            <div className="card mb-4">
              <div className="card-body">
                <form onSubmit={handleAddComment}>
                  <div className="mb-3">
                    <label htmlFor="comment-input" className="form-label">Add a comment</label>
                    <textarea
                      id="comment-input"
                      className="form-control"
                      rows="3"
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      placeholder="Write your comment here..."
                      required
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={submittingComment || !commentContent.trim()}
                  >
                    {submittingComment ? 'Posting...' : 'Post Comment'}
                  </button>
                </form>
              </div>
            </div>
          )}
          
          {comments.length === 0 ? (
            <div className="text-center my-4">
              <p className="text-muted">No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            <div className="comments-list">
              {comments.map(comment => (
                <div key={comment.id} className="card mb-3">
                  <div className="card-body">
                    <div className="d-flex justify-content-between mb-2">
                      <h6 className="mb-0">{comment.author}</h6>
                      <small className="text-muted">
                        {new Date(comment.timestamp).toLocaleString()}
                      </small>
                    </div>
                    <p className="card-text">{comment.content}</p>
                    
                    {currentUser && (currentUser.id === comment.author_id || currentUser.role === 'admin') && (
                      <div className="d-flex justify-content-end">
                        <button className="btn btn-sm btn-danger">
                          <i className="bi bi-trash"></i> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
