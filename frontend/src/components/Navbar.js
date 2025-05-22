import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';
import { logout } from '../services/auth';
import { getCategories } from '../services/posts';
import '../custom.css';

const Navbar = ({ user, onLogout }) => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch categories when the component mounts
    const fetchCategories = async () => {
      try {
        if (user) {
          const categoriesData = await getCategories();
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      if (onLogout) {
        onLogout();
      }
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <BootstrapNavbar bg="white" expand="lg" className="shadow-sm py-3 mb-4">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/" className="fw-bold">
          <h2 className="m-0">Choikk Forum</h2>
        </BootstrapNavbar.Brand>
        
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          {user && (
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              
              <NavDropdown title="Categories" id="categories-dropdown">
                {categories.map(category => (
                  <NavDropdown.Item 
                    key={category.id} 
                    as={Link} 
                    to={`/category/${category.id}`}
                  >
                    {category.name}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
              
              <Nav.Link as={Link} to="/create-post">
                <i className="bi bi-plus-circle me-1"></i> Create Post
              </Nav.Link>
            </Nav>
          )}
          
          <Nav>
            {user ? (
              <div className="d-flex align-items-center">
                <NavDropdown 
                  title={
                    <span>
                      <i className="bi bi-person-circle me-1"></i>
                      {user.username}
                    </span>
                  } 
                  id="user-dropdown"
                  align="end"
                >
                  <NavDropdown.Item as={Link} to="/profile">
                    <i className="bi bi-person me-2"></i>My Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/my-posts">
                    <i className="bi bi-file-text me-2"></i>My Posts
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2"></i>Logout
                  </NavDropdown.Item>
                </NavDropdown>
                
                {/* Standalone Logout Button for Better Visibility */}
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  className="ms-2"
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right me-1"></i>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Button as={Link} to="/login" variant="outline-primary">
                  Login
                </Button>
                <Button as={Link} to="/register" variant="primary">
                  Register
                </Button>
              </div>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
