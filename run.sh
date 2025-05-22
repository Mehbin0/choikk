#!/bin/bash

# Script to run both frontend and backend development servers

# Check if Python is installed
if ! command -v python &> /dev/null; then
    echo "Python could not be found. Please install Python 3.9+ and try again."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js could not be found. Please install Node.js 16+ and try again."
    exit 1
fi

# Start backend server
start_backend() {
    echo "Starting Flask backend server..."
    cd backend || exit 1
    
    # Create virtual environment if it doesn't exist
    if [ ! -d "venv" ]; then
        echo "Creating virtual environment..."
        python -m venv venv
    fi
    
    # Activate virtual environment
    source venv/bin/activate || exit 1
    
    # Install requirements
    echo "Installing/updating backend dependencies..."
    pip install -r requirements.txt
    
    # Start backend server
    export FLASK_APP=app.py
    export FLASK_ENV=development
    python -m flask run &
    BACKEND_PID=$!
    echo "Backend server started with PID: $BACKEND_PID"
    cd ..
}

# Start frontend server
start_frontend() {
    echo "Starting React frontend server..."
    cd frontend || exit 1
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo "Installing frontend dependencies..."
        npm install
    fi
    
    # Start frontend server
    npm start &
    FRONTEND_PID=$!
    echo "Frontend server started with PID: $FRONTEND_PID"
    cd ..
}

# Handle cleanup on script exit
cleanup() {
    echo "Shutting down servers..."
    if [ -n "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
    fi
    if [ -n "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
    fi
    echo "Servers shut down successfully."
    exit 0
}

# Register cleanup function
trap cleanup SIGINT SIGTERM

# Start servers
start_backend
start_frontend

# Keep the script running
echo ""
echo "Choikk Forum is now running!"
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop all servers."

# Wait forever
while true; do
    sleep 1
done
