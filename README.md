# Choikk Forum - Members-Only Discussion Forum

A secure members-only discussion forum built with Flask and React.

## Features

- **Secure Authentication:** Register and login to access the forum
- **Private Content:** All content is restricted to members only
- **Create Posts:** Members can create posts with titles, content, and tags
- **View Posts:** Browse all posts created by members
- **Responsive Design:** Works on desktop and mobile devices

## Tech Stack

### Backend
- Flask (Python)
- SQLite Database
- User authentication with session management
- RESTful API

### Frontend
- React
- Modern UI components
- Secure authentication workflow
- Responsive design

## Getting Started

### Prerequisites
- Python 3.x
- Node.js and npm

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create and activate a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Run the server:
   ```
   python app.py
   ```

The backend server will start at http://127.0.0.1:5000

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

The frontend server will start at http://localhost:3000

## Default Admin Account
- Username: admin
- Password: admin123

## Security Features
- Password hashing using SHA-256
- Session-based authentication
- CORS protection
- Protected API endpoints

## License
This project is licensed under the MIT License