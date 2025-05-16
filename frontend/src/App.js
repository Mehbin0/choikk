import React, { useEffect, useState } from 'react';

function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/posts')
      .then(res => res.json())
      .then(data => setPosts(data.posts))
      .catch(err => console.error('Error fetching posts:', err));
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Choikk Forum</h1>
      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        posts.map(post => (
          <div key={post.id} style={{ marginBottom: '1.5rem', border: '1px solid #ccc', padding: '1rem' }}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <small>By {post.author} at {post.timestamp}</small><br/>
            <strong>Tags:</strong> {post.tags.join(', ')}
          </div>
        ))
      )}
    </div>
  );
}

export default App;
