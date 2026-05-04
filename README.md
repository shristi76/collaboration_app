# Collaborative Code Editor

A real-time collaborative code editor built with React, Monaco Editor, Yjs, and Socket.IO.

## Features

- Real-time collaborative editing
- Monaco Editor (same as VS Code)
- User presence and active users list
- Docker containerization

## Local Development

### Prerequisites

- Node.js 18+
- npm

### Setup

1. Clone the repository
2. Install dependencies for both frontend and backend:

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. Start the backend server:

```bash
cd backend
npm run dev
```

4. Start the frontend (in a new terminal):

```bash
cd frontend
npm run dev
```

5. Open http://localhost:5173 in your browser

## Docker

To run with Docker:

```bash
docker-compose up --build
```

Frontend will be available at http://localhost

## Usage

1. Enter a username to join
2. Start editing code - changes will sync in real-time
3. See active users in the sidebar