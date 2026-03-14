# Pocket Budget — Hetzner VPS Deployment Guide

## Prerequisites

- A Hetzner VPS (CX22 or higher recommended)
- A domain pointed to your VPS IP (e.g. `budget.yourdomain.com`)
- SSH access to the server

---

## 1. Initial Server Setup

```bash
# SSH into your server
ssh root@YOUR_SERVER_IP

# Update packages
apt update && apt upgrade -y

# Create a non-root user
adduser deploy
usermod -aG sudo deploy

# Set up SSH key for the new user
mkdir -p /home/deploy/.ssh
cp ~/.ssh/authorized_keys /home/deploy/.ssh/
chown -R deploy:deploy /home/deploy/.ssh

# Switch to deploy user
su - deploy
```

## 2. Install Node.js via nvm

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc

# Install Node.js LTS
nvm install --lts
nvm use --lts
node -v  # verify
```

## 3. Install PM2

```bash
npm install -g pm2
```

## 4. Clone & Build the App

```bash
cd ~
git clone YOUR_REPO_URL pocket-budget
cd pocket-budget

# Install dependencies
npm install

# Ensure production env file exists (SQLite DB at project root)
cat > .env << 'EOF'
DATABASE_URL="file:./dev.db"
EOF

# Run Prisma migration (creates/updates SQLite DB)
npx prisma migrate deploy

# Build the Next.js app
npm run build
```

## 5. Start with PM2

```bash
# Start app using ecosystem config
pm2 start ecosystem.config.cjs

# Save PM2 process list so it restarts on reboot
pm2 save
pm2 startup
# Run the command PM2 outputs (it will look like: sudo env PATH=... pm2 startup ...)
```

Useful PM2 commands:
```bash
pm2 status          # check status
pm2 logs pocket-budget  # view logs
pm2 restart pocket-budget
pm2 stop pocket-budget
```

## 6. Install & Configure Nginx

```bash
sudo apt install nginx -y

# Create site config
sudo nano /etc/nginx/sites-available/pocket-budget
```

Paste this config (replace `budget.yourdomain.com` with your domain):

```nginx
server {
    listen 80;
    server_name budget.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/pocket-budget /etc/nginx/sites-enabled/
sudo nginx -t        # test config
sudo systemctl restart nginx
```

## 7. SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate (follow the prompts)
sudo certbot --nginx -d budget.yourdomain.com

# Auto-renewal is set up automatically; verify with:
sudo certbot renew --dry-run
```

## 8. Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

## 9. Install as PWA on iPhone

1. Open `https://budget.yourdomain.com` in **Safari**
2. Tap the **Share** button (square with arrow)
3. Scroll down and tap **"Add to Home Screen"**
4. Name it "Pocket Budget" and tap **Add**
5. The app will appear on your home screen and open in standalone mode (no browser chrome)

> **Note:** HTTPS is required for PWA install and service worker to work.

---

## Updating the App

```bash
cd ~/pocket-budget
git pull
npm install
npx prisma migrate deploy
npm run build
pm2 restart ecosystem.config.cjs --update-env
```

## Database Backup

The SQLite database is at `dev.db` (project root). To back up:

```bash
# Simple copy
cp ~/pocket-budget/dev.db ~/backups/pocket-budget-$(date +%Y%m%d).db

# Optional: set up a cron job for daily backups
crontab -e
# Add: 0 2 * * * cp ~/pocket-budget/dev.db ~/backups/pocket-budget-$(date +\%Y\%m\%d).db
```
