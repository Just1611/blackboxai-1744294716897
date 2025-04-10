// Server data structure
const servers = [
    {
        id: 1,
        name: 'Server 1',
        channels: {
            text: [
                { id: 1, name: 'general', messages: [] },
                { id: 2, name: 'announcements', messages: [] }
            ],
            voice: [
                { id: 3, name: 'General Voice' }
            ]
        },
        members: [
            { id: 1, name: 'User1', status: 'online' },
            { id: 2, name: 'User2', status: 'offline' }
        ]
    }
];

// Current state
let currentServer = servers[0];
let currentChannel = currentServer.channels.text[0];

// DOM Elements
const messageInput = document.querySelector('input[type="text"]');
const messagesContainer = document.querySelector('.overflow-y-auto');

// Event Listeners
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && messageInput.value.trim()) {
        sendMessage(messageInput.value);
        messageInput.value = '';
    }
});

// Functions
function sendMessage(content) {
    const message = {
        id: Date.now(),
        content,
        author: 'User1',
        timestamp: new Date().toISOString()
    };
    
    currentChannel.messages.push(message);
    displayMessage(message);
}

function displayMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'mb-4';
    messageElement.innerHTML = `
        <div class="flex items-start">
            <div class="w-10 h-10 rounded-full bg-[#36393f] mr-4"></div>
            <div>
                <div class="flex items-center">
                    <span class="font-semibold text-white">${message.author}</span>
                    <span class="text-xs text-[#72767d] ml-2">${new Date(message.timestamp).toLocaleTimeString()}</span>
                </div>
                <div class="text-[#dcddde]">${message.content}</div>
            </div>
        </div>
    `;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Server switching functionality
function switchServer(serverId) {
    currentServer = servers.find(s => s.id === serverId);
    currentChannel = currentServer.channels.text[0];
    updateUI();
}

// Channel switching functionality
function switchChannel(channelId) {
    const channel = [
        ...currentServer.channels.text,
        ...currentServer.channels.voice
    ].find(c => c.id === channelId);
    
    if (channel) {
        currentChannel = channel;
        updateUI();
    }
}

function updateUI() {
    // Update server name
    document.querySelector('h2').textContent = currentServer.name;
    
    // Clear messages
    messagesContainer.innerHTML = '';
    
    // Display channel messages
    if (currentChannel.messages) {
        currentChannel.messages.forEach(displayMessage);
    }
    
    // Update channel name in header
    document.querySelector('.font-bold.text-white').textContent = currentChannel.name;
}

// Initialize UI
updateUI();
