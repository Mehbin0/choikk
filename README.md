# Choikk Forum - Members-Only Discussion Forum

A secure members-only discussion forum built with Flask and React.

## Features

- **Secure Authentication:** Register and login to access the forum with CSRF protection
- **User Profiles:** Personal profiles with bio, avatar, and stats
- **Private Content:** All content is restricted to members only
- **Create Posts:** Members can create posts with titles, content, and tags
- **Categories:** Organize posts by categories
- **Comments & Likes:** Engage with posts through comments and likes
- **View Posts:** Browse all posts created by members
- **Responsive Design:** Works on desktop and mobile devices

## Tech Stack

### Backend
- Flask (Python)
- SQLite Database
- User authentication with secure session management
- RESTful API with CSRF protection
- Rate limiting middleware

### Frontend
- React (JavaScript)
- React Router for navigation
- Modern responsive UI with CSS
- Secure API communication

## Installation & Setup

### Prerequisites
- Node.js 16+ and npm
- Python 3.9+
- Git

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/choikk.git
   cd choikk
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

4. **Environment Configuration**
   - Backend: Copy `.env.development` to `.env` and adjust settings
   - Frontend: Copy `.env.development` to `.env` and adjust settings

5. **Run Development Servers**
   - Backend:
     ```bash
     cd backend
     flask run
     ```
   - Frontend:
     ```bash
     cd frontend
     npm start
     ```

6. **Access the application**
   Open your browser and navigate to http://localhost:3000

## Docker Deployment

The application includes Docker support for easy deployment:

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

2. **Access the application**
   Open your browser and navigate to http://localhost:3000

## Testing

### Backend Tests
```bash
cd backend
python -m pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Security Features

- CSRF Protection
- Rate Limiting
- Secure Password Hashing (PBKDF2)
- Secure Session Configuration
- Input Validation

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
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