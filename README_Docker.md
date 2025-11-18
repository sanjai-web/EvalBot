# Docker Setup for EvalBot Application

This guide explains how to run the EvalBot application using Docker and Docker Compose.

## Prerequisites

- Docker installed on your system
- Docker Compose installed on your system

## Services

The application consists of the following services:

- **MongoDB**: Database service
- **Backend**: Node.js/Express API server
- **Admin**: React admin panel
- **Frontend**: React user interface

## Quick Start

1. **Clone the repository and navigate to the project directory**

2. **Create environment file** (optional, for local development):
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your actual configuration values.

3. **Build and start the services**:
   ```bash
   docker-compose up --build
   ```

4. **Access the applications**:
   - Admin Panel: http://localhost:3000
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017

## Docker Commands

### Start services
```bash
docker-compose up
```

### Start services in background
```bash
docker-compose up -d
```

### Stop services
```bash
docker-compose down
```

### Rebuild and start
```bash
docker-compose up --build
```

### View logs
```bash
docker-compose logs
```

### View logs for specific service
```bash
docker-compose logs backend
```

## Environment Variables

The following environment variables can be configured:

- `MONGO_URI`: MongoDB connection string
- `PORT`: Backend server port (default: 5000)
- `NODE_ENV`: Environment mode (development/production)

## Volumes

- `mongodb_data`: Persistent storage for MongoDB data
- `mongodb_config`: Persistent storage for MongoDB configuration

## Networks

- `evalbot-network`: Internal network for service communication

## Development

For development, you can mount the source code as volumes to enable hot reloading:

```yaml
# In docker-compose.yml, add to backend service:
volumes:
  - ./Backend:/app
  - /app/node_modules
```

## Troubleshooting

1. **Port conflicts**: Ensure ports 27017, 3000, 3001, 5000 are available
2. **MongoDB connection issues**: Check MONGO_URI in environment variables
3. **Build failures**: Ensure Docker has sufficient resources
4. **Permission issues**: Check file permissions for mounted volumes

## Production Deployment

For production deployment:

1. Update environment variables for production
2. Use proper secrets management
3. Configure reverse proxy (nginx) for SSL termination
4. Set up proper logging and monitoring
5. Use Docker secrets for sensitive data
