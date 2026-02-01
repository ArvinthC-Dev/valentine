let noClickCount = 0;
let yesButtonSize = 1.5;

const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const gif = document.getElementById('gif');

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
	'Last chance! ⭐',
];

// GIF URLs for different stages
const normalGif = 'https://media.giphy.com/media/MDJ9IbxxvDUQM/giphy.gif';

yesBtn.addEventListener('click', function () {
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

	if (noClickCount >= 15) {
		alert("Okay, okay! Let's start fresh! 💕");
		resetPage();
		return;
	}

	// Increase Yes button size
	yesButtonSize += 0.3;
	yesBtn.style.fontSize = `${yesButtonSize}rem`;
	yesBtn.style.padding = `${15 + noClickCount * 2}px ${30 + noClickCount * 3}px`;

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
	noClickCount = 0;
	yesButtonSize = 1.5;

	yesBtn.style.fontSize = '1.5rem';
	yesBtn.style.padding = '15px 30px';
	noBtn.textContent = 'No';
	gif.src = normalGif;
}
