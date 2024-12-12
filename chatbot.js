const API_URL = 'https://3543-191-177-193-123.ngrok-free.app/chat';

document.addEventListener("DOMContentLoaded", function () {
    // Configuração da interface (mantém o design atual)
    const chatbotButton = document.createElement("div");
    chatbotButton.id = "chatbot-button";
    chatbotButton.style.position = "fixed";
    chatbotButton.style.left = "20px";
    chatbotButton.style.bottom = "20px";
    chatbotButton.style.width = "60px";
    chatbotButton.style.height = "60px";
    chatbotButton.style.borderRadius = "50%";
    chatbotButton.style.backgroundColor = "#007bff";
    chatbotButton.style.cursor = "pointer";
    document.body.appendChild(chatbotButton);

    const chatWindow = document.createElement("div");
    chatWindow.id = "chat-window";
    chatWindow.style.position = "fixed";
    chatWindow.style.left = "20px";
    chatWindow.style.bottom = "90px";
    chatWindow.style.width = "300px";
    chatWindow.style.height = "400px";
    chatWindow.style.backgroundColor = "#fff";
    chatWindow.style.display = "none";
    document.body.appendChild(chatWindow);

    chatbotButton.addEventListener("click", () => {
        chatWindow.style.display = chatWindow.style.display === "none" ? "block" : "none";
    });

    // Função para enviar mensagem
    async function sendMessage() {
        const userMessage = document.getElementById("chatInput").value.trim();
        if (!userMessage) {
            console.error("Mensagem vazia");
            return;
        }

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user_message: userMessage }),
            });

            const data = await response.json();

            if (data && data.response) {
                console.log("Resposta recebida:", data.response);
            } else {
                console.error("Resposta inválida recebida.");
            }
        } catch (error) {
            console.error("Erro ao se comunicar com o backend:", error);
        }
    }
});
