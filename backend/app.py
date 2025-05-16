from flask import Flask, jsonify, request
import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

posts=[
    {
        "id": 1,
        "title": "First Post",
        "content": "This is the content of first post.",
        "author": "User1",
        "timestamp": "2025-05-16 10:56:00",
        "tags": ["post", "first"]
    }
]

@app.route('/')
def home():
    return jsonify(message="Hello from Choikk backend!")

@app.route('/status')
def status():
    now = datetime.datetime.now()
    return jsonify(
        status="OK",
        timestamp=now.strftime("%Y-%m-%d %H:%M:%S"),
        message="Choikk backend is running smoothly!"
    )

@app.route('/posts')
def get_all_posts():
    return jsonify(posts=posts)

@app.route('/add_post', methods=['POST'])
def add_post():
    title = request.json.get('title')
    content= request.json.get('content')
    author = request.json.get('author')
    tags = request.json.get('tags', [])
    if not title or not content or not author:
        return jsonify(error="Title, content, and author are required."), 400
    new_post = {
        "id": len(posts) + 1,
        "title": title,
        "content": content,
        "author": author,
        "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "tags": ["post", "new"]
    }
    posts.append(new_post)
    return jsonify(post=new_post)

@app.route('/posts/<int:id>')
def get_post(id):
    for post in posts:
        if post['id'] == id:
            return jsonify(post=post)
    return jsonify(error="Post not found"), 404    

if __name__ == '__main__':
    app.run(debug=True)
