# MongoDB Setup Instructions

## Step 1: Update MongoDB Credentials

You need to replace the placeholder credentials in `server.js` with your actual MongoDB credentials.

**Current connection string:**
```
mongodb+srv://<db_username>:<db_password>@assitantai.uvqeglr.mongodb.net/?appName=AssitantAI
```

**Update line 15 in server.js:**
```javascript
const MONGODB_URI = 'mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@assitantai.uvqeglr.mongodb.net/?appName=AssitantAI';
```

## Step 2: Start the Server

Run one of these commands:

```bash
# Production mode
npm start

# Development mode (with auto-reload)
npm run dev
```

## Step 3: Open the Website

Navigate to: http://localhost:3000

## Step 4: View Analytics

### In Browser Console:
- Open DevTools (F12)
- Go to Console tab
- You'll see analytics logs with ✅ confirmations when data is saved

### View All Analytics via API:
Open in browser: http://localhost:3000/api/analytics

This will show all collected analytics data in JSON format.

## Database Structure

The MongoDB collection `Analytics` stores:
```javascript
{
  sessionId: "unique_session_id",
  visitTimestamp: "2026-02-02T...",
  ipAddress: "123.456.789.0",
  browserInfo: {
    userAgent: "Mozilla/5.0...",
    language: "en-US",
    platform: "MacIntel",
    screenResolution: "1920x1080",
    timezone: "America/New_York",
    cookiesEnabled: true
  },
  interactions: [
    {
      action: "page_load",
      timestamp: "2026-02-02T...",
      details: {}
    },
    {
      action: "no_button_click",
      timestamp: "2026-02-02T...",
      details: {
        clickCount: 1,
        buttonText: "Are you sure? 🥺"
      }
    },
    {
      action: "yes_button_click",
      timestamp: "2026-02-02T...",
      details: {
        noClickCount: 3,
        yesButtonSize: 3
      }
    }
  ]
}
```

## Troubleshooting

### Connection Error
If you see MongoDB connection errors:
1. Verify your username and password are correct
2. Check that your IP is whitelisted in MongoDB Atlas
3. Ensure the database name is correct

### CORS Issues
If running from a different domain, update the CORS settings in `server.js`

### Port Already in Use
Change the PORT in `.env` file or `server.js` if port 3000 is occupied
