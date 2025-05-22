import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Nav, Spinner, Badge } from 'react-bootstrap';
import { getUserProfile, updateUserProfile, changePassword } from '../services/auth';
import { getUserPosts } from '../services/posts';
import { useNavigate } from 'react-router-dom';
import '../custom.css';

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    avatar_url: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const profileData = await getUserProfile();
        setProfile(profileData);
        setFormData({
          bio: profileData.bio || '',
          avatar_url: profileData.avatar_url || ''
        });
        
        // Fetch user's posts
        const posts = await getUserPosts();
        setUserPosts(posts);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, []);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const result = await updateUserProfile(formData);
      setProfile(result.user);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setEditMode(false);
      setLoading(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setMessage({ type: 'error', text: err.message || 'Failed to update profile.' });
      setLoading(false);
    }
  };
  
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'New password must be at least 8 characters long.' });
      return;
    }
    
    try {
      setLoading(true);
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setLoading(false);
    } catch (err) {
      console.error('Error changing password:', err);
      setMessage({ type: 'error', text: err.message || 'Failed to change password.' });
      setLoading(false);
    }
  };
  
  const navigateToPost = (postId) => {
    navigate(`/posts/${postId}`);
  };
  
  if (loading && !profile) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading profile...</p>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }
  
  return (
    <Container className="py-4">
      <h2 className="mb-4 border-bottom pb-3">User Profile</h2>
      
      {message && (
        <Alert 
          variant={message.type === 'success' ? 'success' : 'danger'}
          dismissible
          onClose={() => setMessage(null)}
          className="mb-4"
        >
          {message.text}
        </Alert>
      )}
      
      <Nav variant="tabs" className="mb-4">
        <Nav.Item>
          <Nav.Link 
            active={activeTab === 'profile'}
            onClick={() => setActiveTab('profile')}
            className="d-flex align-items-center"
          >
            <i className="bi bi-person me-2"></i> Profile
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            active={activeTab === 'posts'}
            onClick={() => setActiveTab('posts')}
            className="d-flex align-items-center"
          >
            <i className="bi bi-file-text me-2"></i> My Posts
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            active={activeTab === 'security'}
            onClick={() => setActiveTab('security')}
            className="d-flex align-items-center"
          >
            <i className="bi bi-shield-lock me-2"></i> Security
          </Nav.Link>
        </Nav.Item>
      </Nav>
      
      {activeTab === 'profile' && (
        <div className="profile-tab">
          {!editMode ? (
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <Row>
                  <Col md={4} className="text-center mb-4 mb-md-0">
                    <img
                      src={profile.avatar_url || 'https://via.placeholder.com/150'}
                      alt="Profile Avatar"
                      className="rounded-circle img-thumbnail"
                      style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                    />
                    <div className="mt-3">
                      <h4>{profile.username}</h4>
                      <Badge bg="primary" className="me-2">{profile.role || 'User'}</Badge>
                    </div>
                  </Col>
                  <Col md={8}>
                    <div className="mb-4">
                      <Row className="mb-2">
                        <Col xs={12} md={4} className="text-muted">Joined:</Col>
                        <Col xs={12} md={8}>{new Date(profile.created_at).toLocaleDateString()}</Col>
                      </Row>
                      <Row className="mb-2">
                        <Col xs={12} md={4} className="text-muted">Last Login:</Col>
                        <Col xs={12} md={8}>{profile.last_login ? new Date(profile.last_login).toLocaleString() : 'N/A'}</Col>
                      </Row>
                      <Row className="mb-4">
                        <Col xs={12} md={4} className="text-muted">Posts:</Col>
                        <Col xs={12} md={8}>{profile.post_count || userPosts.length}</Col>
                      </Row>
                      <Row>
                        <Col xs={12}>
                          <h5 className="mb-2">Bio</h5>
                          <p className="text-muted">{profile.bio || 'No bio provided.'}</p>
                        </Col>
                      </Row>
                    </div>
                    <Button
                      variant="primary"
                      onClick={() => setEditMode(true)}
                      className="d-flex align-items-center"
                    >
                      <i className="bi bi-pencil-square me-2"></i> Edit Profile
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ) : (
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white py-3">
                <h4 className="mb-0">Edit Profile</h4>
              </Card.Header>
              <Card.Body className="p-4">
                <Form onSubmit={handleProfileUpdate}>
                  <Form.Group className="mb-4">
                    <Form.Label>Avatar URL</Form.Label>
                    <Form.Control
                      type="text"
                      name="avatar_url"
                      value={formData.avatar_url}
                      onChange={handleInputChange}
                      placeholder="Enter URL to your avatar image"
                    />
                    {formData.avatar_url && (
                      <div className="mt-3 text-center">
                        <img
                          src={formData.avatar_url}
                          alt="Avatar Preview"
                          className="img-thumbnail rounded-circle"
                          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        />
                      </div>
                    )}
                  </Form.Group>
                  <Form.Group className="mb-4">
                    <Form.Label>Bio</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="bio"
                      rows="4"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us about yourself"
                    />
                  </Form.Group>
                  <div className="d-flex gap-2">
                    <Button type="submit" variant="success" disabled={loading}>
                      {loading ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-2"></i> Save Changes
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={() => setEditMode(false)}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          )}
        </div>
      )}
      
      {activeTab === 'posts' && (
        <div className="posts-tab">
          <div className="d-flex justify-content-between mb-4">
            <h3>My Posts</h3>
            <Button variant="primary" href="/create-post">
              <i className="bi bi-plus-circle me-2"></i> Create New Post
            </Button>
          </div>
          
          {userPosts.length === 0 ? (
            <Card className="border-0 shadow-sm text-center p-5">
              <Card.Body>
                <i className="bi bi-journal-text display-4 text-muted mb-3"></i>
                <h4>No posts yet</h4>
                <p className="text-muted">You haven't created any posts yet.</p>
                <Button variant="primary" href="/create-post">
                  Create Your First Post
                </Button>
              </Card.Body>
            </Card>
          ) : (
            <Row xs={1} md={2} className="g-4">
              {userPosts.map(post => (
                <Col key={post.id}>
                  <Card className="h-100 border-0 shadow-sm hover-card">
                    <Card.Body>
                      <div className="d-flex justify-content-between mb-2">
                        <div>
                          {post.tags && post.tags.map(tag => (
                            <Badge bg="secondary" key={tag} className="me-1">{tag}</Badge>
                          ))}
                        </div>
                        <small className="text-muted">
                          {new Date(post.timestamp).toLocaleDateString()}
                        </small>
                      </div>
                      <Card.Title className="mb-3">{post.title}</Card.Title>
                      <Card.Text className="text-muted">
                        {post.content.length > 100
                          ? `${post.content.substring(0, 100)}...`
                          : post.content}
                      </Card.Text>
                    </Card.Body>
                    <Card.Footer className="bg-white border-top-0">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <Badge bg="light" text="dark" className="me-2">
                            <i className="bi bi-chat me-1"></i>
                            {post.comment_count || 0}
                          </Badge>
                          <Badge bg="light" text="dark">
                            <i className="bi bi-eye me-1"></i>
                            {post.view_count || 0}
                          </Badge>
                        </div>
                        <Button
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => navigateToPost(post.id)}
                        >
                          View Post
                        </Button>
                      </div>
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>
      )}
      
      {activeTab === 'security' && (
        <div className="security-tab">
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white py-3">
              <h4 className="mb-0">Change Password</h4>
            </Card.Header>
            <Card.Body className="p-4">
              <Form onSubmit={handlePasswordUpdate}>
                <Form.Group className="mb-3">
                  <Form.Label>Current Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    minLength="8"
                  />
                  <Form.Text className="text-muted">
                    Password must be at least 8 characters long.
                  </Form.Text>
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </Form.Group>
                <Button 
                  type="submit" 
                  variant="primary" 
                  className="d-flex align-items-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Changing Password...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-shield-lock-fill me-2"></i> Change Password
                    </>
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </div>
      )}
    </Container>
  );
};

export default UserProfile;
