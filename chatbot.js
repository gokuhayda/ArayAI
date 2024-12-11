// URL do backend do chatbot no Render
const backendUrl = "https://chatbot-backend-zduj.onrender.com/api/chat";

// Função para enviar mensagem do usuário para o backend
async function sendMessageToBot(userMessage) {
    try {
        const response = await fetch(backendUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_message: userMessage }),
        });

        if (response.ok) {
            const data = await response.json();
            return data.response; // Retorna a resposta do bot
        } else {
            console.error("Erro ao se comunicar com o backend:", response.status);
            return "Desculpe, não foi possível processar sua solicitação.";
        }
    } catch (error) {
        console.error("Erro de rede:", error);
        return "Erro ao se comunicar com o servidor. Por favor, tente novamente mais tarde.";
    }
}

// Cria a interface gráfica do chatbot
function createChatbotUI() {
    const chatbotContainer = document.createElement("div");
    chatbotContainer.id = "chatbotContainer";
    chatbotContainer.style.width = "400px";
    chatbotContainer.style.height = "600px";
    chatbotContainer.style.border = "2px solid #0078d7";
    chatbotContainer.style.borderRadius = "10px";
    chatbotContainer.style.overflow = "hidden";
    chatbotContainer.style.display = "flex";
    chatbotContainer.style.flexDirection = "column";
    chatbotContainer.style.backgroundColor = "#f4f4f9";
    chatbotContainer.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.2)";
    chatbotContainer.style.fontFamily = "Arial, sans-serif";

    const chatHeader = document.createElement("div");
    chatHeader.style.backgroundColor = "#0078d7";
    chatHeader.style.color = "#fff";
    chatHeader.style.padding = "10px";
    chatHeader.style.textAlign = "center";
    chatHeader.style.fontWeight = "bold";
    chatHeader.textContent = "Chatbot";

    const chatContainer = document.createElement("div");
    chatContainer.id = "chatContainer";
    chatContainer.style.flexGrow = "1";
    chatContainer.style.padding = "10px";
    chatContainer.style.overflowY = "auto";
    chatContainer.style.backgroundColor = "#e9ecef";

    const chatInputContainer = document.createElement("div");
    chatInputContainer.style.display = "flex";
    chatInputContainer.style.borderTop = "1px solid #ccc";
    chatInputContainer.style.padding = "10px";
    chatInputContainer.style.backgroundColor = "#fff";

    const userInput = document.createElement("input");
    userInput.id = "userInput";
    userInput.type = "text";
    userInput.placeholder = "Digite sua mensagem...";
    userInput.style.flexGrow = "1";
    userInput.style.border = "1px solid #ccc";
    userInput.style.borderRadius = "5px";
    userInput.style.padding = "10px";
    userInput.style.marginRight = "10px";
    userInput.style.fontSize = "14px";

    const sendButton = document.createElement("button");
    sendButton.id = "sendButton";
    sendButton.textContent = "Enviar";
    sendButton.style.backgroundColor = "#0078d7";
    sendButton.style.color = "#fff";
    sendButton.style.border = "none";
    sendButton.style.borderRadius = "5px";
    sendButton.style.padding = "10px 15px";
    sendButton.style.cursor = "pointer";
    sendButton.style.fontSize = "14px";

    sendButton.addEventListener("mouseenter", () => {
        sendButton.style.backgroundColor = "#005bb5";
    });

    sendButton.addEventListener("mouseleave", () => {
        sendButton.style.backgroundColor = "#0078d7";
    });

    chatInputContainer.appendChild(userInput);
    chatInputContainer.appendChild(sendButton);

    chatbotContainer.appendChild(chatHeader);
    chatbotContainer.appendChild(chatContainer);
    chatbotContainer.appendChild(chatInputContainer);

    document.body.appendChild(chatbotContainer);
}

// Função para exibir a resposta do bot na interface
function displayBotResponse(response) {
    const chatContainer = document.getElementById("chatContainer");
    const botMessage = document.createElement("div");
    botMessage.style.backgroundColor = "#0078d7";
    botMessage.style.color = "#fff";
    botMessage.style.padding = "10px";
    botMessage.style.borderRadius = "10px";
    botMessage.style.marginBottom = "10px";
    botMessage.style.alignSelf = "flex-start";
    botMessage.style.maxWidth = "75%";
    botMessage.style.fontSize = "14px";
    botMessage.textContent = response;
    chatContainer.appendChild(botMessage);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Função para lidar com o envio de mensagens
async function handleSendMessage() {
    const userInput = document.getElementById("userInput");
    const userMessage = userInput.value.trim();

    if (!userMessage) {
        return;
    }

    const chatContainer = document.getElementById("chatContainer");
    const userMessageElement = document.createElement("div");
    userMessageElement.style.backgroundColor = "#e1e1e1";
    userMessageElement.style.color = "#000";
    userMessageElement.style.padding = "10px";
    userMessageElement.style.borderRadius = "10px";
    userMessageElement.style.marginBottom = "10px";
    userMessageElement.style.alignSelf = "flex-end";
    userMessageElement.style.maxWidth = "75%";
    userMessageElement.style.fontSize = "14px";
    userMessageElement.textContent = userMessage;
    chatContainer.appendChild(userMessageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    userInput.value = "";

    const botResponse = await sendMessageToBot(userMessage);
    displayBotResponse(botResponse);
}

// Inicializar a interface do chatbot
createChatbotUI();

// Adicionar eventos aos elementos
document.getElementById("sendButton").addEventListener("click", handleSendMessage);
document.getElementById("userInput").addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        handleSendMessage();
    }
});
