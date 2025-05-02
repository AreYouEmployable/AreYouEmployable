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
# Start the app (replace app.js with your entry file)
pm2 start app.js

# Start with a custom name
pm2 start app.js --name my-app

# Restart the app
pm2 restart my-app

# Stop the app
pm2 stop my-app

# Delete the app from the PM2 process list
pm2 delete my-app

# View real-time logs
pm2 logs

# Monitor performance and metrics
pm2 monit

# Save current process list (for automatic respawn)
pm2 save

# Generate startup script to resurrect PM2 processes on boot
pm2 startup