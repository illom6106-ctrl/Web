/* ==========================================================================
   NexusEscrow P2P Exchange - Client-Side Interactive Controller
   Manages View Transitions, 4-Phase Escrow State, Credential Masking,
   Live Chat Simulation, and Telegram Bot Log Forwarding.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // Initial Setup on Page Load
    initApp();
});

// Application State Store
const appState = {
    currentScreen: 'authScreen',
    user: {
        name: 'Alex_Gamer',
        email: 'alex@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
        balance: 1250.00,
        role: 'Buyer'
    },
    trade: {
        roomId: '8921-TX',
        amount: 45.00,
        currency: 'USD',
        currentPhase: 2, // 1: Escrow, 2: Asset Delivery, 3: Verification, 4: Completed
        credentials: {
            email: 'gamer_seller99@gmail.com',
            pass: 'pubg_conqueror_9921#X'
        },
        isMasked: true,
        disputeActive: false
    }
};

function initApp() {
    // Default launch view control
    showScreen('authScreen');
    setupEventListeners();
}

// Screen Switcher Utility
function showScreen(screenId) {
    const screens = ['authScreen', 'dashboardScreen', 'tradeRoomScreen'];
    screens.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            if (id === screenId) {
                el.classList.remove('hidden');
                if (id === 'tradeRoomScreen') {
                    el.classList.add('grid');
                }
            } else {
                el.classList.add('hidden');
                if (id === 'tradeRoomScreen') {
                    el.classList.remove('grid');
                }
            }
        }
    });
    appState.currentScreen = screenId;
}

// Event Listeners Setup
function setupEventListeners() {
    // Chat input 'Enter' key support
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
}

// 1. Google OAuth Authentication Simulation
function loginWithGoogle() {
    // Simulate successful Google Auth & profile auto-creation
    console.log("Google OAuth Authenticated. User profile synchronized.");
    showScreen('dashboardScreen');
    updateUIProfile();
}

function updateUIProfile() {
    const nameEl = document.getElementById('navUserName');
    const emailEl = document.getElementById('navUserEmail');
    const avatarEl = document.getElementById('navUserAvatar');

    if (nameEl) nameEl.innerText = appState.user.name;
    if (emailEl) emailEl.innerText = appState.user.email;
    if (avatarEl) avatarEl.src = appState.user.avatar;
}

// 2. Dashboard Navigation to Trade Room
function switchToTradeRoom() {
    showScreen('tradeRoomScreen');
    renderTradeStepper();
}

// 3. Credential Masking & Unmasking Logic
function toggleMask() {
    appState.trade.isMasked = !appState.trade.isMasked;
    const passEl = document.getElementById('credPass');
    const eyeIcon = document.getElementById('eyeIcon');

    if (!passEl || !eyeIcon) return;

    if (appState.trade.isMasked) {
        passEl.innerText = "••••••••••••";
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    } else {
        passEl.innerText = appState.trade.credentials.pass;
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
        
        // Log sensitive credential exposure action to simulated Telegram Bot
        logToTelegramBot("ALERT: Credential unmasked by User A in Room #" + appState.trade.roomId);
    }
}

// 4. Click-to-Copy Resource Package & Telegram Forwarding
function copyCredentials() {
    const payload = `Gmail: ${appState.trade.credentials.email}\nPassword: ${appState.trade.credentials.pass}`;
    
    navigator.clipboard.writeText(payload).then(() => {
        alert('Credential package copied to clipboard and securely broadcasted to Telegram Bot logs.');
        logToTelegramBot("SUCCESS: Credential package copied by Buyer in Room #" + appState.trade.roomId);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

// 5. Live Chat & Telegram Bot Integration Feed
function sendMessage() {
    const input = document.getElementById('chatInput');
    if (!input || input.value.trim() === '') return;

    const messageText = input.value.trim();
    const chatFeed = document.getElementById('chatFeed');

    // Append user message to chat UI
    const msgDiv = document.createElement('div');
    msgDiv.className = "flex flex-col space-y-1 items-end";
    msgDiv.innerHTML = `
        <div class="flex items-center space-x-2">
            <span class="text-[10px] text-slate-500">Just now</span>
            <span class="font-bold text-xs text-purple-400">${appState.user.name}</span>
        </div>
        <p class="bg-purple-600/20 p-3 rounded-xl border border-purple-500/30 text-slate-200 text-xs">${escapeHtml(messageText)}</p>
    `;
    
    chatFeed.appendChild(msgDiv);
    chatFeed.scrollTop = chatFeed.scrollHeight;
    
    // Forward input directly to Telegram Bot simulation feed without filtering
    logToTelegramBot(`[Telegram Raw Feed] Message in Room #${appState.trade.roomId}: ${messageText}`);

    input.value = '';
}

// Simulated Telegram Bot Webhook Integration
function logToTelegramBot(logMessage) {
    console.log(`%c[Telegram Bot Dispatcher]: ${logMessage}`, 'color: #229ED9; font-weight: bold;');
}

// 6. Emergency Dispute / Trade Freeze Handler
function triggerDispute() {
    const confirmation = confirm("Are you sure you want to trigger an emergency dispute freeze? This will lock funds and alert platform admins.");
    if (confirmation) {
        appState.trade.disputeActive = true;
        logToTelegramBot(`CRITICAL DISPUTE TRIGGERED in Room #${appState.trade.roomId} by ${appState.user.name}`);
        alert("Trade successfully frozen. Admin intervention ticket opened.");
        
        // Update UI state to reflect frozen dispute
        const chatFeed = document.getElementById('chatFeed');
        if (chatFeed) {
            const alertDiv = document.createElement('div');
            alertDiv.className = "flex flex-col space-y-1 items-center my-2";
            alertDiv.innerHTML = `
                <div class="bg-red-500/20 border border-red-500/40 text-red-400 text-xs p-2.5 rounded-xl w-full text-center font-bold">
                    <i class="fa-solid fa-triangle-exclamation mr-1"></i> Trade Frozen by Emergency Dispute Protocol. Funds locked in escrow.
                </div>
            `;
            chatFeed.appendChild(alertDiv);
            chatFeed.scrollTop = chatFeed.scrollHeight;
        }
    }
}

// 7. Stepper State Manager
function renderTradeStepper() {
    console.log("Rendering Trade Phase State:", appState.trade.currentPhase);
}

// Security Helper: Prevent XSS when injecting chat strings
function escapeHtml(str) {
    return str.replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#039;");
}
