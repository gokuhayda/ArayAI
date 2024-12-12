const API_URL = 'https://b67d-191-177-193-123.ngrok-free.app';

document.addEventListener("DOMContentLoaded", function () {
    // Cria o botão flutuante para o chatbot
    const chatbotButton = document.createElement("div");
    chatbotButton.id = "chatbot-button";
    chatbotButton.style.position = "fixed";
    chatbotButton.style.left = "20px";
    chatbotButton.style.bottom = "20px";
    chatbotButton.style.width = "60px";
    chatbotButton.style.height = "60px";
    chatbotButton.style.borderRadius = "50%";
    chatbotButton.style.backgroundColor = "#007bff";
    chatbotButton.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
    chatbotButton.style.cursor = "pointer";
    chatbotButton.style.display = "flex";
    chatbotButton.style.alignItems = "center";
    chatbotButton.style.justifyContent = "center";
    chatbotButton.style.zIndex = "1000";

    // Ícone do robô no botão
    const chatbotIcon = document.createElement("img");
    chatbotIcon.src = "https://cdn-icons-png.flaticon.com/512/4712/4712027.png"; // Substitua pela URL do ícone desejado
    chatbotIcon.alt = "Chatbot";
    chatbotIcon.style.width = "40px";
    chatbotIcon.style.height = "40px";
    chatbotButton.appendChild(chatbotIcon);

    // Adiciona o botão ao corpo da página
    document.body.appendChild(chatbotButton);

    // Cria a janela de chat
    const chatWindow = document.createElement("div");
    chatWindow.id = "chat-window";
    chatWindow.style.position = "fixed";
    chatWindow.style.left = "20px";
    chatWindow.style.bottom = "90px";
    chatWindow.style.width = "300px";
    chatWindow.style.height = "400px";
    chatWindow.style.backgroundColor = "#fff";
    chatWindow.style.border = "1px solid #ccc";
    chatWindow.style.borderRadius = "8px";
    chatWindow.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
    chatWindow.style.display = "none";
    chatWindow.style.zIndex = "1000";

    // Cabeçalho do chat
    const chatHeader = document.createElement("div");
    chatHeader.style.backgroundColor = "#007bff";
    chatHeader.style.color = "#fff";
    chatHeader.style.padding = "10px";
    chatHeader.style.borderTopLeftRadius = "8px";
    chatHeader.style.borderTopRightRadius = "8px";
    chatHeader.style.display = "flex";
    chatHeader.style.justifyContent = "space-between";
    chatHeader.style.alignItems = "center";

    const chatTitle = document.createElement("span");
    chatTitle.textContent = "Assistente Virtual";
    chatTitle.style.fontWeight = "bold";

    const closeChat = document.createElement("span");
    closeChat.textContent = "✖";
    closeChat.style.cursor = "pointer";

    chatHeader.appendChild(chatTitle);
    chatHeader.appendChild(closeChat);
    chatWindow.appendChild(chatHeader);

    // Corpo do chat
    const chatBody = document.createElement("div");
    chatBody.style.flex = "1";
    chatBody.style.padding = "10px";
    chatBody.style.overflowY = "auto";
    chatBody.style.height = "300px";
    chatBody.innerHTML = `<p>Bem-vindo! Como posso ajudá-lo?</p>`;
    chatWindow.appendChild(chatBody);

    // Campo de entrada
    const chatInputContainer = document.createElement("div");
    chatInputContainer.style.padding = "10px";
    chatInputContainer.style.borderTop = "1px solid #ccc";
    chatInputContainer.style.display = "flex";

    const chatInput = document.createElement("input");
    chatInput.type = "text";
    chatInput.placeholder = "Digite sua mensagem...";
    chatInput.style.flex = "1";
    chatInput.style.padding = "5px";
    chatInput.style.marginRight = "10px";
    chatInput.style.border = "1px solid #ccc";
    chatInput.style.borderRadius = "4px";

    const sendButton = document.createElement("button");
    sendButton.textContent = "➤"; // Ícone de envio estilo WhatsApp
    sendButton.style.padding = "5px 10px";
    sendButton.style.backgroundColor = "#007bff";
    sendButton.style.color = "#fff";
    sendButton.style.border = "none";
    sendButton.style.borderRadius = "50%";
    sendButton.style.cursor = "pointer";
    sendButton.style.fontSize = "16px";

    chatInputContainer.appendChild(chatInput);
    chatInputContainer.appendChild(sendButton);
    chatWindow.appendChild(chatInputContainer);

    // Adiciona a janela de chat ao corpo
    document.body.appendChild(chatWindow);

    // Lógica de abertura e fechamento
    chatbotButton.addEventListener("click", () => {
        chatWindow.style.display = chatWindow.style.display === "none" ? "block" : "none";
    });

    closeChat.addEventListener("click", () => {
        chatWindow.style.display = "none";
    });

    // Função para enviar mensagem
    function sendMessage() {
        const userMessage = chatInput.value.trim();
        if (userMessage) {
            const userMessageElement = document.createElement("p");
            userMessageElement.textContent = `Você: ${userMessage}`;
            userMessageElement.style.textAlign = "right";
            userMessageElement.style.margin = "5px 0";
            chatBody.appendChild(userMessageElement);
            chatInput.value = "";

            // Simula a resposta do bot (integre com o backend aqui)
            setTimeout(() => {
                const botMessageElement = document.createElement("p");
                botMessageElement.textContent = `Bot: Esta é uma resposta simulada.`;
                botMessageElement.style.textAlign = "left";
                botMessageElement.style.margin = "5px 0";
                chatBody.appendChild(botMessageElement);
                chatBody.scrollTop = chatBody.scrollHeight;
            }, 1000);
        }
    }

    // Evento de clique no botão de envio
    sendButton.addEventListener("click", sendMessage);

    // Evento para envio ao pressionar Enter
    chatInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            sendMessage();
        }
    });
});



async function sendMessageToAPI(data) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error communicating with API:", error);
        throw error;
    }
}
