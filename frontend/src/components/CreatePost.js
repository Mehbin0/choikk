import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { createPost } from '../services/posts';

const CreatePost = ({ onPostCreated }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Convert comma-separated tags to array
      const tagsArray = tags.split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '');
      
      await createPost(title, content, tagsArray);
      setIsLoading(false);
      
      // Clear form
      setTitle('');
      setContent('');
      setTags('');
      
      if (onPostCreated) {
        onPostCreated();
      }
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'Failed to create post. Please try again.');
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h2 className="h4 mb-0">Create New Post</h2>
            </Card.Header>
            <Card.Body className="p-4">
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="title">Title</Form.Label>
                  <Form.Control
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter post title"
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="content">Content</Form.Label>
                  <Form.Control
                    as="textarea"
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows="8"
                    placeholder="Write your post content here..."
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label htmlFor="tags">Tags (comma-separated)</Form.Label>
                  <Form.Control
                    type="text"
                    id="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="e.g. discussion, question, tutorial"
                  />
                  <Form.Text className="text-muted">
                    Optional: Add tags to help users find your post
                  </Form.Text>
                </Form.Group>
                
                <div className="d-grid">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    disabled={isLoading}
                    className="py-2"
                  >
                    {isLoading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Creating Post...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-pencil-square me-2"></i>
                        Create Post
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreatePost;
