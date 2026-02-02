# Deployment Guide

This project has two parts that need to be deployed separately:
1. **Frontend** (HTML, CSS, JS) → GitHub Pages
2. **Backend** (Node.js/Express/MongoDB) → Cloud platform

## Part 1: Deploy Frontend to GitHub Pages

### Step 1: Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Build and deployment", select **GitHub Actions** as the source
4. The workflow will automatically deploy when you push to main branch

### Step 2: Access Your Site
Your site will be live at: `https://YOUR-USERNAME.github.io/valentine/`

## Part 2: Deploy Backend Server

Choose one of these platforms to deploy your backend:

### Option A: Render (Recommended - Free Tier Available)

1. Go to https://render.com and sign up
2. Click **New** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name**: valentine-backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Add Environment Variables**:
     - `DB_USERNAME`: your_mongodb_username
     - `DB_PASSWORD`: your_mongodb_password
     - `PORT`: 3000
5. Click **Create Web Service**
6. Copy your backend URL (e.g., `https://valentine-backend.onrender.com`)

### Option B: Railway

1. Go to https://railway.app and sign up
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your repository
4. Add environment variables (same as above)
5. Copy your backend URL

### Option C: Vercel

1. Go to https://vercel.com and sign up
2. Import your repository
3. Configure as Node.js project
4. Add environment variables
5. Copy your backend URL

## Part 3: Connect Frontend to Backend

Update the backend URL in `script.js`:

```javascript
const API_BASE_URL = window.location.hostname === 'localhost' 
	? 'http://localhost:3000'
	: 'https://YOUR-BACKEND-URL.com'; // Replace with your actual backend URL
```

**Example:**
```javascript
const API_BASE_URL = window.location.hostname === 'localhost' 
	? 'http://localhost:3000'
	: 'https://valentine-backend.onrender.com';
```

## Part 4: Update Backend CORS

In `server.js`, update CORS to allow your GitHub Pages domain:

```javascript
app.use(cors({
	origin: [
		'http://localhost:3000',
		'https://YOUR-USERNAME.github.io'
	],
	credentials: true
}));
```

## Testing

1. **Local Testing**: `npm start` → http://localhost:3000
2. **Production**: Visit your GitHub Pages URL

## Troubleshooting

### CORS Errors
Make sure your backend CORS settings include your GitHub Pages URL

### Analytics Not Working
- Check browser console for errors
- Verify backend URL is correct in script.js
- Ensure backend is deployed and running
- Check MongoDB credentials in backend environment variables

## Cost Summary

- **GitHub Pages**: Free
- **MongoDB Atlas**: Free tier (512 MB)
- **Render/Railway**: Free tier available
- **Total**: $0/month for small projects
