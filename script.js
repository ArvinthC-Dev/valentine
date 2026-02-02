let noClickCount = 0;
let yesButtonSize = 1.5;

const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const gif = document.getElementById('gif');

// Analytics data object
let analyticsData = {
	sessionId: generateSessionId(),
	visitTimestamp: new Date().toISOString(),
	ipAddress: null,
	browserInfo: {
		userAgent: navigator.userAgent,
		language: navigator.language,
		platform: navigator.platform,
		screenResolution: `${screen.width}x${screen.height}`,
		timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
		cookiesEnabled: navigator.cookieEnabled,
	},
	interactions: [],
};

// Flag to track if initial data has been sent
let isInitialized = false;

// Generate a unique session ID
function generateSessionId() {
	return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Collect IP address
async function collectIPAddress() {
	try {
		const response = await fetch('https://api.ipify.org?format=json');
		const data = await response.json();
		analyticsData.ipAddress = data.ip;
		console.log('Analytics Data:', analyticsData);
	} catch (error) {
		console.error('Failed to fetch IP address:', error);
		analyticsData.ipAddress = 'unavailable';
	}
	
	// Track page load and send initial data after IP is collected
	trackInteraction('page_load');
	isInitialized = true;
}

// Track interaction
function trackInteraction(action, details = {}) {
	const interaction = {
		action: action,
		timestamp: new Date().toISOString(),
		...details,
	};
	analyticsData.interactions.push(interaction);
	console.log('Interaction tracked:', interaction);
	
	// Only send to backend if IP has been collected or if it's a critical action
	if (isInitialized || action === 'yes_button_click') {
		sendAnalyticsToServer();
	}
}

// Send analytics data to MongoDB via backend API
async function sendAnalyticsToServer() {
	try {
		const response = await fetch('/api/analytics', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(analyticsData),
		});
		
		const result = await response.json();
		if (result.success) {
			console.log('✅ Analytics saved to database:', result);
			
			if (result.isReturningUser) {
				console.log(`👋 Welcome back! This is visit #${result.visitCount}`);
			} else {
				console.log('🎉 First time visitor!');
			}
		} else {
			console.error('❌ Failed to save analytics:', result.message);
		}
	} catch (error) {
		console.error('❌ Error sending analytics to server:', error);
	}
}

// Initialize analytics on page load
collectIPAddress();

// Cute messages for the No button
const noMessages = [
	'No',
	'Are you sure? 🥺',
	'Really? 💔',
	'Think again! 💭',
	"Don't be like that 😢",
	'Please? 🙏',
	'Pretty please? 💝',
	"I'll be sad 😭",
	"You're breaking my heart 💔",
	'One more chance? 🌹',
	'Reconsider? 💕',
	'I promise to be sweet 🍭',
	'Just say yes! 💖',
	'Come on! 😊',
	'Please reconsider! 🥹',
	'You know you want to! 😊',
	"I'll bring you flowers! 🌺",
	'Chocolate too? 🍫',
	"You're making me sad 😿",
	'How about now? 💝',
	"Can't resist forever! 💫",
	'Give me a chance! 🌟',
	"Don't you love me? 💕",
	'This is torture! 😭',
	'Be mine? 💘',
	"I'm waiting... ⏰",
	'You know the answer! 😉',
	"YES is so easy! 💗",
	'Almost there... 🎯',
	'Last chance now! ⭐',
];

// GIF URLs for different stages
const normalGif = 'https://media.giphy.com/media/MDJ9IbxxvDUQM/giphy.gif';

yesBtn.addEventListener('click', function () {
	// Track Yes button click
	trackInteraction('yes_button_click', {
		noClickCount: noClickCount,
		yesButtonSize: yesButtonSize,
	});

	// Change the page when Yes is clicked
	document.querySelector('.content').innerHTML = `
        <h1 class="question">Yay! 🎉💕</h1>
        <div class="gif-container">
            <img src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcXVpd2E2YnJ0YzZ2OG55cTNzcHVodzF6NjQzMnI4cmxwbW41dnk1byZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ZdqrObYRdnAVuBVCNe/giphy.gif" alt="celebration">
        </div>
        <p style="font-size: 2rem; color: #ff1493; margin-top: 20px;">
            I knew you'd say yes! 💖<br>
            Happy Valentine's Day! 🌹
        </p>
    `;
});

noBtn.addEventListener('click', function () {
	noClickCount++;

	// Track No button click
	trackInteraction('no_button_click', {
		clickCount: noClickCount,
		buttonText: noMessages[noClickCount] || 'No',
	});

	if (noClickCount >= 30) {
		trackInteraction('reset_triggered', { reason: 'max_no_clicks_reached' });
		alert("Okay, okay! Let's start fresh! 💕");
		resetPage();
		return;
	}

	// Increase Yes button size
	yesButtonSize += 0.5;
	yesBtn.style.fontSize = `${yesButtonSize}rem`;
	yesBtn.style.padding = `${15 + noClickCount * 3}px ${30 + noClickCount * 5}px`;

	// Change No button text
	noBtn.textContent = noMessages[noClickCount];

	// Add shake animation to Yes button
	yesBtn.style.animation = 'none';
	setTimeout(() => {
		yesBtn.style.animation = 'shake 0.5s';
	}, 10);
});

// Add shake animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);

function resetPage() {
	trackInteraction('page_reset');
	noClickCount = 0;
	yesButtonSize = 1.5;

	yesBtn.style.fontSize = '1.5rem';
	yesBtn.style.padding = '15px 30px';
	noBtn.textContent = 'No';
	gif.src = normalGif;
}
