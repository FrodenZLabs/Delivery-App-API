# 🚚 Delivery App API
RESTful API built with Node.js, Express, and MongoDB, powered with Docker for containerization.

## 🧱 Technology Stack
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT
- **File Uploads**: Multer
- **Containerization**: Docker (Node app, MongoDB, Nginx)
- **Environment Management**: dotenv

## 🧩 Features
- User registration & login
- Auth middleware to secure routes
- CRUD for: services, delivery info, schedules, drivers, ratings
- Multer-powered file uploads (images)
- Auto-assign drivers and update schedule statuses
- JWT token issuance and validation
- Logging, error handling, and retryable DB connections

## 🚀 Getting Started
### Prerequisites
- Docker & Docker Compose installed
- [Optional] Node.js & npm for local runs

### Clone & Setup
```
git clone https://github.com/FrodenZLabs/Delivery-App-API.git
cd Delivery-App-API
cp .env.example .env   # configure env variables
```

### Run with Docker Compose
```
docker compose up --build
```
- API server at http://localhost:8000 (or port defined in .env)
- MongoDB container with named volume persists data
- Nginx reverse proxy included

### Run Locally Without Docker
```
npm install
npm run dev
```
Requires MongoDB running and .env configured accordingly.

## 🧠 API Endpoints
- **Auth**: 
  - **POST** `/api/auth/register`
  - **POST** `/api/auth/login`
- **Services**:
  - **GET** `/api/service/ – list/paginate services`
  - **POST** `/api/service/add`
  - **PUT** `/api/service/:id`
- **Delivery Info**:
  - **GET** `/api/delivery-info/user/:userId`
  - **POST** `/api/delivery-info/add`
  - **PUT** `/api/delivery-info/:id`
- **Schedule**:
  - **POST** `/api/schedule/add`
  - **GET** `/api/schedule/user/:userId`
  - **PUT** `/api/schedule/:id/assign-driver`
  - **GET** `/api/schedule/:id & more`
- **Drivers**:
  - **GET** `/api/driver/service/:serviceId`
  - **POST** `/api/driver/add`
- **Ratings**:
  - **POST** `/api/rating/add`
  - **GET** `/api/rating/eligible/:scheduleId`

## 🛠 Environment Variables
Below are the required `.env` variables:

| Variable                  | Description                   |
|---------------------------|-------------------------------|
| `PORT`                    | Server port                   |
| `MONGO_INITDB_ROOT_USERNAME` | MongoDB root username     |
| `MONGO_INITDB_ROOT_PASSWORD` | MongoDB root password     |
| `MONGO_DB`                | MongoDB database name         |
| `MONGO_USER`              | MongoDB user                  |
| `MONGO_PASSWORD`          | MongoDB password              |
| `JWT_SECRET`              | Secret key for JWT auth       |
| `CLOUDINARY_CLOUD_NAME`   | Cloudinary cloud name         |
| `CLOUDINARY_API_KEY`      | Cloudinary API key            |
| `CLOUDINARY_API_SECRET`   | Cloudinary API secret         |
| `MONGO_URL`               | MongoDB connection URL        |

## 🐳 Docker Overview
- docker-compose.yml defines three services:
  - mongo – MongoDB with persistent volume
  - delivery-app-server – your Express API
  - nginx – reverse proxy to forward traffic
- Docker volume mongo-db stores data across restarts

## 🛡 Authentication
- JWT tokens are issued upon login & must be included in Authorization: Bearer <token> header.
- Secure routes use middleware to verify JWT and extract user info.

## 📁 Structure
```
├── controllers/      # Business logic
├── models/           # Mongoose schemas
├── routes/           # Express route definitions
├── middleware/       # Auth, error handlers, file uploads
├── config/           # Config helpers (env, DB URLs)
├── index.js          # App entry point
├── docker-compose.yml
└── Dockerfile
```

## ✅ Contributing
Contributions welcome! Open an issue or submit a PR.
