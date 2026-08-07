@echo off
echo ===================================================
echo Starting RoboCutz MERN Project (Backend & Frontend)
echo ===================================================

echo [1/2] Starting Node.js Express Server...
start "RoboCutz Backend" cmd /k "cd server && npm run dev"

echo [2/2] Starting React Vite Client...
start "RoboCutz Frontend" cmd /k "cd client && npm run dev"

echo.
echo All services have been launched in separate windows!
echo Backend API will run on: http://localhost:5000
echo Frontend Web App will run on: http://localhost:3000
echo.
pause
