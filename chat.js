// Webview chat script
const vscode = acquireVsCodeApi();

const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const messages = document.getElementById('messages');

sendButton.onclick = sendMessage;
messageInput.onkeypress = (e) => {
    if (e.key === 'Enter') sendMessage();
};

function sendMessage() {
    const prompt = messageInput.value.trim();
    if (!prompt) return;

    addMessage(prompt, 'user');
    messageInput.value = '';
    sendButton.disabled = true;

    // Send to extension
    vscode.postMessage({
        command: 'askZai',
        prompt: prompt
    });

    // Simulate typing
    const aiTyping = document.createElement('div');
    aiTyping.className = 'message ai-message';
    aiTyping.innerHTML = '<div>جاري التفكير...</div>';
    messages.appendChild(aiTyping);
    messages.scrollTop = messages.scrollHeight;
}

function addMessage(text, type) {
    const msg = document.createElement('div');
    msg.className = `message ${type}-message`;
    msg.textContent = text;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
}

// Listen for responses
window.addEventListener('message', event => {
    const message = event.data;
    if (message.command === 'zaiResponse') {
        sendButton.disabled = false;
        // Remove typing indicator
        const typing = messages.querySelector('.ai-message:last-child');
        if (typing) typing.remove();
        addMessage(message.answer, 'ai');
    }
});

