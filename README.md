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

## Deployment / Hosting

### Recommended hosting setup

- Host the backend on a service such as Render, Railway, Fly, or Heroku.
- Host the frontend on Vercel, Netlify, or the same service as the backend.

### Backend deployment notes

1. Copy `BACKEND/.env.example` to `BACKEND/.env`.
2. Set `MONGO_URI` to your MongoDB Atlas connection string with no extra spaces before or after the value.
3. Set `CORS_ORIGIN` to your deployed frontend URL, e.g. `https://your-app.vercel.app`.
4. For frontend deployment, configure `VITE_API_URL` as the backend URL in your frontend host.

The backend now supports dynamic CORS origins and defaults to port `5000`.

### Frontend deployment notes

- Build the frontend with:
  ```bash
  cd CLIENT
  npm install
  npm run build
  ```
- If hosting statically, set `VITE_API_URL` to your deployed backend URL in the frontend hosting environment.

## Docker Deployment

### Backend Docker Setup

1. Build the Docker image:
   ```bash
   cd BACKEND
   docker build -t opinio-backend .
   ```

2. Run the container with environment variables:
   ```bash
   docker run -p 5000:5000 \
     -e MONGO_URI="your_mongo_connection_string" \
     -e PORT=5000 \
     -e CORS_ORIGIN="https://your-frontend-url" \
     opinio-backend
   ```

### Using Docker Compose (for local development)

1. Create a `.env` file in the root with your MongoDB URI.
2. Run:
   ```bash
   docker-compose up --build
   ```

This starts the backend and a local MongoDB instance.

### Railway Deployment with Docker

Railway supports Docker. Push your code with the `Dockerfile` in `BACKEND/`, and set environment variables in Railway dashboard.

## Notes

- Ensure your MongoDB Atlas URI is valid and accessible.
- If you change the backend port, update the frontend API base URL configuration as needed.
- You can customize CORS or allowed origins in `BACKEND/src/index.js`.
