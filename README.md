# Opinio

A full-stack blogging platform with a React/Vite frontend and an Express/MongoDB backend.

## Repository Structure

- `BACKEND/` – Node.js Express API server
- `CLIENT/` – React frontend built with Vite
- `uploads/` – file upload storage for blog assets

## Features

- User registration and login
- Blog article creation, editing, deletion
- Admin routes and default seeded admin account
- MongoDB Atlas integration
- Client-side routing with React Router

## Getting Started

### Backend

1. Open a terminal in `BACKEND/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `BACKEND/` with the following values:
   ```env
   PORT=5000
   MONGO_URI=your_mongo_connection_string
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend

1. Open a terminal in `CLIENT/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend app:
   ```bash
   npm run dev
   ```

The frontend is configured to communicate with the backend at `http://localhost:5173`.

## Default Admin Account

The backend seeds a default admin user on startup if one does not exist:

- Email: `admin@opinio.com`
- Password: `adminpassword123`

## Notes

- Ensure your MongoDB Atlas URI is valid and accessible.
- If you change the backend port, update the frontend API base URL configuration as needed.
- You can customize CORS or allowed origins in `BACKEND/src/index.js`.
