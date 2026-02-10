# AllInOnePDF Server

Backend API server for AllInOnePDF application.

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **File Upload**: Multer

## Setup

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```env
PORT=5000
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-secret-key
ADMIN_EMAIL=admin@allinonepdf.com
ADMIN_PASSWORD=your-admin-password
FRONTEND_URL=http://localhost:3000
```

### Development

```bash
npm run dev
```

Server runs at `http://localhost:5000`

### Production Build

```bash
npm run build
npm start
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/admin/login` | Admin login |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/register` | User registration |

### Users (Admin only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List all users |
| GET | `/api/users/:id` | Get user by ID |
| PATCH | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

### Tickets
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tickets` | List tickets (admin) |
| POST | `/api/tickets` | Create ticket (public) |
| GET | `/api/tickets/:id` | Get ticket |
| PATCH | `/api/tickets/:id` | Update ticket (admin) |
| DELETE | `/api/tickets/:id` | Delete ticket (admin) |

### File Upload
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload/single` | Upload single file |
| POST | `/api/upload/multiple` | Upload multiple files |
| GET | `/api/upload/:filename` | Get file |
| DELETE | `/api/upload/:filename` | Delete file |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |

## Deployment on VPS

### Using PM2

1. Install PM2:
```bash
npm install -g pm2
```

2. Build and start:
```bash
npm run build
pm2 start dist/index.js --name allinonepdf-api
```

3. Setup auto-restart:
```bash
pm2 startup
pm2 save
```

### Using Docker

Create `Dockerfile`:
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 5000
CMD ["node", "dist/index.js"]
```

Build and run:
```bash
docker build -t allinonepdf-server .
docker run -p 5000:5000 --env-file .env allinonepdf-server
```

### Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `MONGODB_URI` | MongoDB connection string | - |
| `JWT_SECRET` | JWT signing secret | - |
| `ADMIN_EMAIL` | Initial admin email | admin@allinonepdf.com |
| `ADMIN_PASSWORD` | Initial admin password | admin123 |
| `UPLOAD_DIR` | File upload directory | ./uploads |
| `MAX_FILE_SIZE` | Max upload size (bytes) | 104857600 |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 |

## License

MIT
