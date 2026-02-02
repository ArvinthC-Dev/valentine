require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// Configure CORS to allow requests from GitHub Pages
const allowedOrigins = [
	'http://localhost:3000',
	'http://127.0.0.1:3000',
	'https://arvinthc-dev.github.io',
	'https://valentine-ebon-one.vercel.app', // No trailing slash!
];

app.use(
	cors({
		origin: function (origin, callback) {
			// Allow requests with no origin (like mobile apps or curl)
			if (!origin) return callback(null, true);

			if (
				allowedOrigins.indexOf(origin) !== -1 ||
				origin.endsWith('.github.io')
			) {
				callback(null, true);
			} else {
				callback(null, true); // For development, allow all. Change to false in production
			}
		},
		credentials: true,
	}),
);
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// MongoDB connection
// Replace YOUR_USERNAME and YOUR_PASSWORD with actual credentials
const DB_USERNAME = process.env.DB_USERNAME || 'YOUR_USERNAME';
const DB_PASSWORD = process.env.DB_PASSWORD || 'YOUR_PASSWORD';
const MONGODB_URI = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@assitantai.uvqeglr.mongodb.net/?appName=AssitantAI`;

mongoose
	.connect(MONGODB_URI, {
		dbName: 'valentine_analytics',
	})
	.then(() => console.log('✅ Connected to MongoDB'))
	.catch(err => console.error('❌ MongoDB connection error:', err));

// Analytics Schema
const analyticsSchema = new mongoose.Schema(
	{
		userFingerprint: { type: String, required: true, unique: true }, // IP + browser hash
		sessionIds: [{ type: String }], // Array of all session IDs
		visitTimestamp: [{ type: Date }], // Array of all visit timestamps
		ipAddress: { type: String },
		browserInfo: {
			userAgent: String,
			language: String,
			platform: String,
			screenResolution: String,
			timezone: String,
			cookiesEnabled: Boolean,
		},
		interactions: [
			{
				action: String,
				timestamp: Date,
				sessionId: String, // Track which session this interaction belongs to
				details: mongoose.Schema.Types.Mixed,
			},
		],
		visitCount: { type: Number, default: 1 },
		firstVisit: { type: Date },
		lastVisit: { type: Date, default: Date.now },
	},
	{
		timestamps: true,
	},
);

const Analytics = mongoose.model('Analytics', analyticsSchema);

// API Routes

// Create or update analytics session
app.post('/api/analytics', async (req, res) => {
	try {
		const { sessionId, visitTimestamp, ipAddress, browserInfo, interactions } =
			req.body;

		// Don't process if IP address is not available yet
		if (!ipAddress || ipAddress === 'null') {
			return res.status(400).json({
				success: false,
				message: 'IP address not yet available',
			});
		}

		// Create user fingerprint from IP + browser info
		const fingerprint = `${ipAddress}_${browserInfo.userAgent}_${browserInfo.platform}`;
		const userFingerprint = require('crypto')
			.createHash('md5')
			.update(fingerprint)
			.digest('hex');

		// Check if user already exists
		let analytics = await Analytics.findOne({ userFingerprint });

		if (analytics) {
			// Returning user - update existing record
			if (!analytics.sessionIds.includes(sessionId)) {
				analytics.sessionIds.push(sessionId);
				analytics.visitTimestamp.push(new Date(visitTimestamp));
				analytics.visitCount += 1;
			}

			// Update interactions - append new ones and update existing
			for (const interaction of interactions) {
				const existingIndex = analytics.interactions.findIndex(
					i =>
						i.sessionId === sessionId &&
						i.action === interaction.action &&
						i.timestamp.toISOString() === interaction.timestamp,
				);

				if (existingIndex === -1) {
					analytics.interactions.push({
						...interaction,
						sessionId,
					});
				}
			}

			analytics.ipAddress = ipAddress || analytics.ipAddress;
			analytics.browserInfo = browserInfo;
			analytics.lastVisit = new Date();
			await analytics.save();

			res.status(200).json({
				success: true,
				message: 'Analytics updated for returning user',
				sessionId: sessionId,
				isReturningUser: true,
				visitCount: analytics.visitCount,
			});
		} else {
			// New user - create new record
			analytics = new Analytics({
				userFingerprint,
				sessionIds: [sessionId],
				visitTimestamp: [new Date(visitTimestamp)],
				ipAddress,
				browserInfo,
				interactions: interactions.map(i => ({ ...i, sessionId })),
				visitCount: 1,
				firstVisit: new Date(visitTimestamp),
				lastVisit: new Date(visitTimestamp),
			});
			await analytics.save();

			res.status(200).json({
				success: true,
				message: 'Analytics created for new user',
				sessionId: sessionId,
				isReturningUser: false,
				visitCount: 1,
			});
		}
	} catch (error) {
		console.error('Error saving analytics:', error);
		res.status(500).json({
			success: false,
			message: 'Failed to save analytics data',
			error: error.message,
		});
	}
});

// Get all analytics data (optional - for viewing data)
app.get('/api/analytics', async (req, res) => {
	try {
		const analytics = await Analytics.find().sort({ lastVisit: -1 });
		res.status(200).json({
			success: true,
			totalUsers: analytics.length,
			totalVisits: analytics.reduce((sum, user) => sum + user.visitCount, 0),
			data: analytics,
		});
	} catch (error) {
		console.error('Error fetching analytics:', error);
		res.status(500).json({
			success: false,
			message: 'Failed to fetch analytics data',
			error: error.message,
		});
	}
});

// Get analytics by session ID
app.get('/api/analytics/session/:sessionId', async (req, res) => {
	try {
		const analytics = await Analytics.findOne({
			sessionIds: req.params.sessionId,
		});
		if (!analytics) {
			return res.status(404).json({
				success: false,
				message: 'Session not found',
			});
		}

		// Filter interactions for this specific session
		const sessionInteractions = analytics.interactions.filter(
			i => i.sessionId === req.params.sessionId,
		);

		res.status(200).json({
			success: true,
			data: {
				...analytics.toObject(),
				interactions: sessionInteractions,
			},
		});
	} catch (error) {
		console.error('Error fetching analytics:', error);
		res.status(500).json({
			success: false,
			message: 'Failed to fetch analytics data',
			error: error.message,
		});
	}
});

// Get analytics statistics
app.get('/api/analytics/stats', async (req, res) => {
	try {
		const allAnalytics = await Analytics.find();

		const stats = {
			totalUniqueUsers: allAnalytics.length,
			totalVisits: allAnalytics.reduce((sum, user) => sum + user.visitCount, 0),
			returningUsers: allAnalytics.filter(user => user.visitCount > 1).length,
			totalInteractions: allAnalytics.reduce(
				(sum, user) => sum + user.interactions.length,
				0,
			),
			yesClicks: allAnalytics.reduce(
				(sum, user) =>
					sum +
					user.interactions.filter(i => i.action === 'yes_button_click').length,
				0,
			),
			noClicks: allAnalytics.reduce(
				(sum, user) =>
					sum +
					user.interactions.filter(i => i.action === 'no_button_click').length,
				0,
			),
		};

		res.status(200).json({
			success: true,
			stats,
		});
	} catch (error) {
		console.error('Error fetching stats:', error);
		res.status(500).json({
			success: false,
			message: 'Failed to fetch statistics',
			error: error.message,
		});
	}
});

// Serve the main page
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
	console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
