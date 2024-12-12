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

async function sendMessage() {
    const userMessage = chatInput.value.trim();
    if (!userMessage) {
        const errorMessageElement = document.createElement("p");
        errorMessageElement.textContent = "Por favor, insira uma mensagem.";
        errorMessageElement.style.color = "red";
        chatBody.appendChild(errorMessageElement);
        return;
    }

    // Exibe a mensagem do usuário
    const userMessageElement = document.createElement("p");
    userMessageElement.textContent = userMessage;
    userMessageElement.style.textAlign = "right";
    userMessageElement.style.color = "#007bff";
    chatBody.appendChild(userMessageElement);

    chatInput.value = "";

    try {
        console.log("Enviando mensagem:", userMessage); // Log para depuração
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_message: userMessage }),
        });

        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status}`);
        }

        const data = await response.json();
        console.log("Resposta recebida:", data); // Log para depuração

        if (data && data.response) {
            const botMessageElement = document.createElement("p");
            botMessageElement.textContent = data.response;
            botMessageElement.style.textAlign = "left";
            botMessageElement.style.color = "#333";
            chatBody.appendChild(botMessageElement);
        } else {
            const errorMessageElement = document.createElement("p");
            errorMessageElement.textContent = "Erro: Resposta inválida do servidor.";
            errorMessageElement.style.color = "red";
            chatBody.appendChild(errorMessageElement);
        }
    } catch (error) {
        console.error("Erro ao se comunicar com o backend:", error);
        const errorMessageElement = document.createElement("p");
        errorMessageElement.textContent = "Erro ao processar sua mensagem.";
        errorMessageElement.style.color = "red";
        chatBody.appendChild(errorMessageElement);
    }

    chatBody.scrollTop = chatBody.scrollHeight; // Garante que a rolagem fique no final
}

