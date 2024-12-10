const API_URL = "https://seu-backend.onrender.com/api";

// Enviar mensagem para o backend

function sendMessage() {
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    if (chatInput.value.trim()) {
        const message = document.createElement('div');
        message.textContent = chatInput.value;
        message.style.padding = '10px';
        message.style.margin = '5px 0';
        message.style.backgroundColor = '#007bff';
        message.style.color = 'white';
        message.style.borderRadius = '5px';
        message.style.textAlign = 'right';
        chatMessages.appendChild(message);
        chatInput.value = '';
    }
}

// Alternar exibição do chatbot
function toggleChat() {
    const chatBody = document.getElementById('chat-body');
    chatBody.style.display = chatBody.style.display === 'none' || chatBody.style.display === '' ? 'block' : 'none';
}

// Evento para enviar mensagem com Enter
document.getElementById("chat-input").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        sendMessage();
        event.preventDefault();
    }
});
