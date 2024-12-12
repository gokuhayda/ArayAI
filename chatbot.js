
const API_URL = "https://b67d-191-177-193-123.ngrok-free.app/api/chat";

document.addEventListener("DOMContentLoaded", function () {
    const chatInput = document.getElementById("chat-input");
    const sendButton = document.getElementById("send-button");
    const chatContainer = document.getElementById("chat-container");

    function appendMessage(sender, message) {
        const messageElement = document.createElement("div");
        messageElement.className = sender === "user" ? "user-message" : "bot-message";
        messageElement.textContent = message;
        chatContainer.appendChild(messageElement);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    async function sendMessage() {
        const userMessage = chatInput.value.trim();
        if (!userMessage) {
            alert("Por favor, insira uma mensagem.");
            return;
        }

        appendMessage("user", userMessage);
        chatInput.value = "";

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user_message: userMessage }),
            });

            if (!response.ok) {
                throw new Error(`Erro na API: ${response.status}`);
            }

            const data = await response.json();
            appendMessage("bot", data.response);
        } catch (error) {
            console.error("Erro ao se comunicar com o backend:", error);
            appendMessage("bot", "Desculpe, não foi possível processar sua mensagem.");
        }
    }

    sendButton.addEventListener("click", sendMessage);

    chatInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            sendMessage();
        }
    });
});
