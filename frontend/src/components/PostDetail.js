import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Card, Button, Form, Spinner, Alert, Badge } from 'react-bootstrap';
import { getPost, likePost, getComments, addComment } from '../services/posts';
import { getCurrentUser } from '../services/auth';

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
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading post...</p>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
          <div className="d-flex justify-content-end">
            <Button as={Link} to="/" variant="outline-danger">
              Return to Home
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }
  
  return (
    <Container className="py-4">
      <Card className="border-0 shadow-sm mb-4">
        <Card.Header className="bg-white border-bottom-0 pt-4 px-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <h1 className="h2 mb-2">{post.title}</h1>
            <div>
              {post.category && (
                <Badge bg="primary" className="me-2">{post.category}</Badge>
              )}
              {post.tags && post.tags.map(tag => (
                <Badge bg="secondary" key={tag} className="me-1">{tag}</Badge>
              ))}
            </div>
          </div>
        </Card.Header>
        
        <Card.Body className="px-4">
          <div className="mb-4 text-muted d-flex flex-wrap">
            <div className="me-3 mb-2">
              <i className="bi bi-person-fill me-1"></i> {post.author}
            </div>
            <div className="me-3 mb-2">
              <i className="bi bi-calendar3 me-1"></i> {new Date(post.timestamp).toLocaleString()}
            </div>
            <div className="mb-2">
              <i className="bi bi-eye-fill me-1"></i> {post.view_count} views
            </div>
          </div>
          
          <div className="post-content mb-4">
            {post.content.split('\n').map((paragraph, index) => (
              paragraph ? <p key={index}>{paragraph}</p> : <br key={index} />
            ))}
          </div>
          
          <div className="d-flex mt-4 pt-3 border-top">
            <Button 
              variant={post.liked_by_user ? "primary" : "outline-primary"}
              className="d-flex align-items-center me-3"
              onClick={handleLike}
              disabled={likeLoading}
            >
              <i className={`bi ${post.liked_by_user ? 'bi-heart-fill' : 'bi-heart'} me-2`}></i>
              {likeLoading ? 'Processing...' : `${post.like_count || 0} Like${post.like_count !== 1 ? 's' : ''}`}
            </Button>
            
            <Button 
              variant="outline-secondary"
              className="d-flex align-items-center"
              onClick={() => document.getElementById('comment-input').focus()}
            >
              <i className="bi bi-chat-left-text me-2"></i>
              {comments.length || 0} Comments
            </Button>
          </div>
        </Card.Body>
      </Card>
      
      <div className="comments-section">
        <h3 className="mb-4">Comments ({comments.length})</h3>
        
        {currentUser && (
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body className="p-4">
              <Form onSubmit={handleAddComment}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="comment-input">Add a comment</Form.Label>
                  <Form.Control
                    as="textarea"
                    id="comment-input"
                    rows="3"
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    placeholder="Write your comment here..."
                    required
                  />
                </Form.Group>
                <div className="d-flex justify-content-end">
                  <Button 
                    type="submit"
                    variant="primary"
                    disabled={submittingComment || !commentContent.trim()}
                  >
                    {submittingComment ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Posting...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-send me-2"></i>
                        Post Comment
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        )}
        
        {comments.length === 0 ? (
          <div className="text-center py-4">
            <i className="bi bi-chat-left-text display-4 text-muted mb-3"></i>
            <p className="text-muted">No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          <div className="comments-list">
            {comments.map(comment => (
              <Card key={comment.id} className="border-0 shadow-sm mb-3">
                <Card.Body className="p-3">
                  <div className="d-flex justify-content-between mb-2">
                    <h6 className="mb-0 d-flex align-items-center">
                      <i className="bi bi-person-circle me-2 text-secondary"></i>
                      {comment.author}
                    </h6>
                    <small className="text-muted">
                      {new Date(comment.timestamp).toLocaleString()}
                    </small>
                  </div>
                  <p className="card-text mb-2">{comment.content}</p>
                  
                  {currentUser && (currentUser.id === comment.author_id || currentUser.role === 'admin') && (
                    <div className="d-flex justify-content-end">
                      <Button variant="outline-danger" size="sm">
                        <i className="bi bi-trash me-1"></i> Delete
                      </Button>
                    </div>
                  )}
                </Card.Body>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
};

export default PostDetail;
