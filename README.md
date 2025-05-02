# Are You Employable?

An interactive, scenario-based assessment tool that evaluates whether someone is employable as a software engineer

---

## 🚀 Local Development

### 🐳 Docker Setup (via Docker Desktop)

To get started locally, use Docker and Docker Compose:

#### 🔧 Commands

```bash
# Start services in foreground
docker-compose up

# Start services in detached mode (recommended)
docker-compose up -d

# Stop all services
docker-compose down

# Stop and remove all volumes (recommended clean shutdown)
docker-compose down -v
```

---

### ⚙️ PM2 Process Manager

Use [PM2](https://pm2.keymetrics.io/) to manage and keep your Node.js application alive in development and production environments.

#### 🔧 Commands

```bash
# Start all apps defined in the config
pm2 start ecosystem.config.js

# Start with a specific environment
pm2 start ecosystem.config.js --env production

# Restart all apps
pm2 restart ecosystem.config.js

# Stop all apps
pm2 stop ecosystem.config.js

# Delete all apps
pm2 delete ecosystem.config.js

# Save the current process list
pm2 save

# Setup startup script for boot persistence
pm2 startup
```
