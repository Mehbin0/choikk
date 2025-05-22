@echo off
REM Script to run both frontend and backend development servers

echo Checking Python and Node.js installations...

REM Check if Python is installed
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Python could not be found. Please install Python 3.9+ and try again.
    exit /b 1
)

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Node.js could not be found. Please install Node.js 16+ and try again.
    exit /b 1
)

REM Start backend server
cd backend
echo Starting Flask backend server...

REM Create virtual environment if it doesn't exist
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate

REM Install requirements
echo Installing/updating backend dependencies...
pip install -r requirements.txt

REM Start backend server
set FLASK_APP=app.py
set FLASK_ENV=development
start "Choikk Backend" python -m flask run

REM Navigate back to root
cd ..

REM Start frontend server
cd frontend
echo Starting React frontend server...

REM Install dependencies if needed
if not exist node_modules (
    echo Installing frontend dependencies...
    call npm install
)

REM Start frontend server
start "Choikk Frontend" npm start

REM Navigate back to root
cd ..

echo.
echo Choikk Forum is now running!
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:5000
echo.
echo Close the command windows to stop the servers.
echo.
