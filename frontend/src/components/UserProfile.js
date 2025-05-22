import React, { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile, changePassword } from '../services/auth';
import { getUserPosts } from '../services/posts';
import { useNavigate } from 'react-router-dom';
import '../custom.css';

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  const [editMode, setEditMode] = useState(false);
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
        const profileData = await getUserProfile();        setProfile(profileData);
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
    return <div className="container mt-5"><p>Loading profile...</p></div>;
  }
  
  if (error) {
    return <div className="container mt-5"><p className="text-danger">{error}</p></div>;
  }
  
  return (
    <div className="container mt-4">
      <h2>User Profile</h2>
      
      {message && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
          {message.text}
          <button
            type="button"
            className="btn-close float-end"
            onClick={() => setMessage(null)}
          ></button>
        </div>
      )}
      
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            My Posts
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            Security
          </button>
        </li>
      </ul>
      
      {activeTab === 'profile' && (
        <div className="profile-tab">
          {!editMode ? (
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4 text-center mb-3">
                    <img
                      src={profile.avatar_url || 'https://via.placeholder.com/150'}
                      alt="Profile Avatar"
                      className="rounded-circle img-thumbnail"
                      style={{ width: '150px', height: '150px' }}
                    />
                  </div>
                  <div className="col-md-8">
                    <h3>{profile.username}</h3>                    <p className="text-muted">Role: {profile.role}</p>
                    <p className="text-muted">Joined: {new Date(profile.created_at).toLocaleDateString()}</p>
                    <p className="text-muted">Last Login: {profile.last_login ? new Date(profile.last_login).toLocaleString() : 'N/A'}</p>
                    <p className="text-muted">Posts: {profile.post_count || userPosts.length}</p>
                    <h5 className="mt-3">Bio</h5>
                    <p>{profile.bio || 'No bio provided.'}</p>
                    <button
                      className="btn btn-primary"
                      onClick={() => setEditMode(true)}
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="card-body">
                <h3>Edit Profile</h3>                <form onSubmit={handleProfileUpdate}>
                  <div className="mb-3">
                    <label htmlFor="avatar_url" className="form-label">Avatar URL</label>
                    <input
                      type="text"
                      className="form-control"
                      id="avatar_url"
                      name="avatar_url"
                      value={formData.avatar_url}
                      onChange={handleInputChange}
                    />
                    {formData.avatar_url && (
                      <div className="mt-2">
                        <img
                          src={formData.avatar_url}
                          alt="Avatar Preview"
                          className="img-thumbnail"
                          style={{ maxWidth: '100px' }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="bio" className="form-label">Bio</label>
                    <textarea
                      className="form-control"
                      id="bio"
                      name="bio"
                      rows="4"
                      value={formData.bio}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-success" disabled={loading}>
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setEditMode(false)}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'posts' && (
        <div className="posts-tab">
          <h3>My Posts</h3>
          {userPosts.length === 0 ? (
            <p>You haven't created any posts yet.</p>
          ) : (
            <div className="row">
              {userPosts.map(post => (
                <div className="col-md-6 mb-4" key={post.id}>
                  <div className="card h-100">
                    <div className="card-body">
                      <h5 className="card-title">{post.title}</h5>
                      <p className="card-text text-muted">
                        Posted on {new Date(post.timestamp).toLocaleDateString()}
                      </p>
                      <p className="card-text">
                        {post.content.length > 100
                          ? `${post.content.substring(0, 100)}...`
                          : post.content}
                      </p>
                      <div>
                        {post.tags && post.tags.map(tag => (
                          <span key={tag} className="badge bg-secondary me-1">{tag}</span>
                        ))}
                      </div>
                    </div>
                    <div className="card-footer">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => navigateToPost(post.id)}
                      >
                        View Post
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'security' && (
        <div className="security-tab">
          <div className="card">
            <div className="card-body">
              <h3>Change Password</h3>
              <form onSubmit={handlePasswordUpdate}>
                <div className="mb-3">
                  <label htmlFor="currentPassword" className="form-label">Current Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="newPassword" className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    minLength="8"
                  />
                  <small className="text-muted">Password must be at least 8 characters long.</small>
                </div>
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Changing Password...' : 'Change Password'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
