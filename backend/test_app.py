import pytest
from app import app, init_db
import os
import tempfile

@pytest.fixture
def client():
    # Create a temporary file to isolate tests from actual development db
    db_fd, db_path = tempfile.mkstemp()
    app.config['DATABASE_PATH'] = db_path
    app.config['TESTING'] = True
    
    # Use test client
    with app.test_client() as client:
        # Create the database and its tables/test data
        with app.app_context():
            init_db()
        yield client
    
    # Close and remove the temporary file
    os.close(db_fd)
    os.unlink(db_path)

def test_home_unauthorized(client):
    """Test that unauthorized access to home returns 401."""
    response = client.get('/')
    assert response.status_code == 401
    assert b'must be logged in' in response.data

def test_register_and_login(client):
    """Test user registration and login."""
    # Register a new user
    register_response = client.post('/register', json={
        'username': 'testuser',
        'password': 'password123',
        'email': 'test@example.com'
    })
    assert register_response.status_code == 201
    
    # Login with the new user
    login_response = client.post('/login', json={
        'username': 'testuser',
        'password': 'password123'
    })
    assert login_response.status_code == 200
    assert b'Login successful' in login_response.data
    
    # Check that the session is set
    with client.session_transaction() as session:
        assert 'user_id' in session
        assert 'username' in session
        assert session['username'] == 'testuser'

def test_create_post(client):
    """Test creating a post."""
    # First login
    client.post('/login', json={
        'username': 'admin',
        'password': 'admin123'
    })
    
    # Create a post
    post_response = client.post('/add_post', json={
        'title': 'Test Post',
        'content': 'This is a test post content.',
        'tags': ['test', 'pytest'],
        'category': 'General'
    })
    assert post_response.status_code == 201
    
    # Get all posts and check if our post is there
    posts_response = client.get('/posts')
    assert posts_response.status_code == 200
    assert b'Test Post' in posts_response.data

def test_user_profile(client):
    """Test user profile operations."""
    # First login
    client.post('/login', json={
        'username': 'admin',
        'password': 'admin123'
    })
    
    # Get user profile
    profile_response = client.get('/user/profile')
    assert profile_response.status_code == 200
    
    # Update user profile
    update_response = client.put('/user/profile', json={
        'bio': 'Updated bio for testing',
        'email': 'updated@example.com'
    })
    assert update_response.status_code == 200
    
    # Verify the update
    profile_response = client.get('/user/profile')
    assert b'Updated bio for testing' in profile_response.data
    assert b'updated@example.com' in profile_response.data

def test_categories(client):
    """Test category operations."""
    # Get all categories (no login required)
    categories_response = client.get('/categories')
    assert categories_response.status_code == 200
    assert b'General' in categories_response.data
    assert b'Announcements' in categories_response.data
