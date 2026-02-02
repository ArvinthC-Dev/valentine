# 💕 Valentine's Day Proposal 💕

A cute and interactive way to ask someone to be your Valentine!

## Features

- 🎨 Beautiful pink-themed UI with floating hearts
- 💝 Interactive Yes/No buttons
- 📈 Yes button grows with each "No" click
- 💬 Cute changing messages on the No button
- 🔄 Auto-reset after 30 "No" clicks
- 📱 Fully responsive design
- 📊 **Analytics tracking with MongoDB** - Tracks IP, browser info, and user interactions

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure MongoDB

Edit the `.env` file and replace the credentials:

```env
DB_USERNAME=your_mongodb_username
DB_PASSWORD=your_mongodb_password
```

Or update the connection string directly in `server.js`:

```javascript
const MONGODB_URI = 'mongodb+srv://your_username:your_password@assitantai.uvqeglr.mongodb.net/?appName=AssitantAI';
```

### 3. Start the Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The server will run on `http://localhost:3000`

## Analytics Features

The application tracks:
- **IP Address** - Visitor's public IP
- **Browser Information** - User agent, language, platform, screen resolution, timezone
- **Session Data** - Unique session ID and visit timestamp
- **User Interactions**:
  - Page loads
  - "Yes" button clicks
  - "No" button clicks (with count and button text)
  - Page resets

All data is automatically saved to MongoDB.

## API Endpoints

- `POST /api/analytics` - Save/update analytics data
- `GET /api/analytics` - Get all analytics records
- `GET /api/analytics/:sessionId` - Get specific session data

## How to Deploy on GitHub Pages (Static Version)

1. **Create a new repository on GitHub**
   - Go to [github.com](https://github.com) and create a new repository
   - Name it something like `valentine` or `valentine-proposal`
   - Make it public

2. **Push this code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Valentine's Day proposal"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**
   - Go to your repository settings
   - Navigate to "Pages" section
   - Under "Source", select "main" branch
   - Click Save
   - Your site will be live at: `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`

## Customization

Feel free to customize:
- The question text in `index.html`
- The color scheme in `style.css`
- The "No" button messages in `script.js`
- Replace the GIF with your favorite cute GIF

## Usage

Simply share the GitHub Pages link with your special someone! 💖

## License

Feel free to use this for your Valentine's Day proposal! 💕
