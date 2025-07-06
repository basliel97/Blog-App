# 🐳 Docker Setup for BlogHub

This document explains how to use Docker with your BlogHub frontend application.

## 📋 What You Need to Change

### 🔐 **Frontend (This Project) - NO Sensitive Data Needed**

**You DON'T need to change:**
- ❌ JWT secrets (handled by backend)
- ❌ SQL passwords (handled by backend)
- ❌ Database credentials (handled by backend)

**You MAY want to change:**
- ✅ API endpoint URL (if your backend is on a different server)
- ✅ App name (for branding)
- ✅ Development settings

## 🚀 Quick Start

### 1. Production Build
```bash
# Build and run production version
docker-compose up -d

# Access at: http://localhost:8080
```

### 2. Development Build
```bash
# Run development version with hot reload
docker-compose --profile dev up -d

# Access at: http://localhost:3000
```

### 3. Manual Docker Commands
```bash
# Build production image
docker build -t bloghub-frontend .

# Run production container
docker run -d -p 8080:80 bloghub-frontend

# Build with custom API URL
docker build --build-arg VITE_API_BASE_URL=https://your-api.com -t bloghub-frontend .
```

## 🔧 Environment Variables

### Available Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:3000` | Your backend API URL |
| `VITE_APP_NAME` | `BlogHub` | Application name |

### How to Set Environment Variables

#### Option 1: Using .env file
```bash
# Copy example file
cp env.example .env

# Edit .env file
VITE_API_BASE_URL=https://your-api-server.com
VITE_APP_NAME=MyBlog
```

#### Option 2: Using Docker Compose
```bash
# Edit docker-compose.yml
environment:
  - VITE_API_BASE_URL=https://your-api-server.com
  - VITE_APP_NAME=MyBlog
```

#### Option 3: Using Docker build args
```bash
docker build \
  --build-arg VITE_API_BASE_URL=https://your-api-server.com \
  --build-arg VITE_APP_NAME=MyBlog \
  -t bloghub-frontend .
```

## 🏗️ Architecture

### Production Build (Dockerfile)
```
Node.js Build → Nginx Serve
     ↓              ↓
Build React App → Serve Static Files
```

### Development Build (Dockerfile.dev)
```
Node.js + Vite Dev Server
     ↓
Hot Reload Development
```

## 📁 File Structure

```
bloghub/
├── Dockerfile              # Production build
├── Dockerfile.dev          # Development build
├── docker-compose.yml      # Multi-service orchestration
├── docker-entrypoint.sh    # Runtime configuration
├── nginx.conf             # Nginx configuration
├── env.example            # Environment variables example
└── DOCKER.md              # This file
```

## 🔄 Deployment Scenarios

### 1. Local Development
```bash
# Start development server
docker-compose --profile dev up -d

# View logs
docker-compose logs -f bloghub-frontend-dev
```

### 2. Production Deployment
```bash
# Build and start production
docker-compose up -d

# Scale if needed
docker-compose up -d --scale bloghub-frontend=3
```

### 3. Custom API Server
```bash
# Set environment variables
export VITE_API_BASE_URL=https://your-api-server.com

# Build and run
docker-compose up -d
```

### 4. Behind Reverse Proxy
```bash
# Update nginx.conf for your domain
# Build and run
docker-compose up -d
```

## 🛠️ Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using the port
   lsof -i :8080
   
   # Use different port
   docker run -d -p 8081:80 bloghub-frontend
   ```

2. **API Connection Issues**
   ```bash
   # Check if API is accessible
   curl http://your-api-server.com/health
   
   # Update API URL in environment
   export VITE_API_BASE_URL=http://your-api-server.com
   ```

3. **Build Failures**
   ```bash
   # Clean build
   docker build --no-cache -t bloghub-frontend .
   
   # Check build logs
   docker build -t bloghub-frontend . 2>&1 | tee build.log
   ```

### Debug Commands

```bash
# View container logs
docker-compose logs -f bloghub-frontend

# Enter container
docker exec -it bloghub-frontend sh

# Check environment variables
docker exec bloghub-frontend env

# Check nginx configuration
docker exec bloghub-frontend nginx -t
```

## 🔒 Security Notes

### Frontend Security (This Project)
- ✅ **No sensitive data** stored in frontend
- ✅ **Environment variables** for configuration
- ✅ **JWT tokens** stored in browser localStorage
- ✅ **API calls** made from browser

### Backend Security (Your API Server)
- 🔒 **JWT secrets** should be in backend environment
- 🔒 **Database credentials** should be in backend environment
- 🔒 **API keys** should be in backend environment

## 🚀 Next Steps

1. **Set up your backend** with proper environment variables
2. **Configure your API URL** in the frontend environment
3. **Deploy to your preferred platform** (AWS, GCP, Azure, etc.)
4. **Set up CI/CD** for automated deployments

## 📞 Need Help?

If you encounter issues:
1. Check the troubleshooting section above
2. Review Docker logs: `docker-compose logs`
3. Verify environment variables are set correctly
4. Ensure your backend API is accessible

---

**Happy containerizing! 🐳** 