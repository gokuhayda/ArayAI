const API_URL = 'https://cfc2-2804-7f0-8417-8046-dc9d-a7c-ad6e-1279.ngrok-free.app/chat';
let sessionId = null;

document.addEventListener("DOMContentLoaded", function () {
    const chatbotButton = document.createElement("div");
    chatbotButton.id = "chatbot-button";
    chatbotButton.style = `
        position: fixed; left: 20px; bottom: 20px; width: 60px; height: 60px;
        border-radius: 50%; background-color: #007bff; box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 1000;
    `;

    const chatbotIcon = document.createElement("img");
    chatbotIcon.src = "https://cdn-icons-png.flaticon.com/512/4712/4712027.png";
    chatbotIcon.alt = "Chatbot";
    chatbotIcon.style = "width: 40px; height: 40px;";
    chatbotButton.appendChild(chatbotIcon);
    document.body.appendChild(chatbotButton);

    const chatWindow = document.createElement("div");
    chatWindow.id = "chat-window";
    chatWindow.style = `
        position: fixed; left: 20px; bottom: 90px; width: 300px; height: 400px;
        background-color: #fff; border: 1px solid #ccc; border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1); display: none; z-index: 1000;
        display: flex; flex-direction: column;
    `;

    const chatHeader = document.createElement("div");
    chatHeader.style = `
        background-color: #007bff; color: #fff; padding: 10px;
        border-top-left-radius: 8px; border-top-right-radius: 8px;
        display: flex; justify-content: space-between; align-items: center;
    `;

    const chatTitle = document.createElement("span");
    chatTitle.textContent = "Assistente Virtual";
    chatTitle.style.fontWeight = "bold";

    const closeChat = document.createElement("span");
    closeChat.textContent = "✖";
    closeChat.style.cursor = "pointer";

    chatHeader.appendChild(chatTitle);
    chatHeader.appendChild(closeChat);
    chatWindow.appendChild(chatHeader);

    const chatBody = document.createElement("div");
    chatBody.style = `
        flex: 1; padding: 10px; overflow-y: auto; height: 300px;
    `;
    chatBody.innerHTML = `<p>Bem-vindo! Como posso ajudá-lo?</p>`;
    chatWindow.appendChild(chatBody);

    const chatInputContainer = document.createElement("div");
    chatInputContainer.style = `
        padding: 10px; border-top: 1px solid #ccc; display: flex;
    `;

    const chatInput = document.createElement("input");
    chatInput.type = "text";
    chatInput.placeholder = "Digite sua mensagem...";
    chatInput.style = `
        flex: 1; padding: 5px; margin-right: 10px;
        border: 1px solid #ccc; border-radius: 4px;
    `;

    const sendButton = document.createElement("button");
    sendButton.textContent = "➤";
    sendButton.style = `
        padding: 5px 10px; background-color: #007bff; color: #fff;
        border: none; border-radius: 50%; cursor: pointer; font-size: 16px;
    `;

    chatInputContainer.appendChild(chatInput);
    chatInputContainer.appendChild(sendButton);
    chatWindow.appendChild(chatInputContainer);
    document.body.appendChild(chatWindow);

    chatbotButton.addEventListener("click", () => {
        chatWindow.style.display = chatWindow.style.display === "none" ? "block" : "none";
    });

    closeChat.addEventListener("click", () => {
        chatWindow.style.display = "none";
    });

    async function sendMessage() {
        const userMessage = chatInput.value.trim();
        if (!userMessage) {
            alert("Por favor, insira uma mensagem.");
            return;
        }

        const userMessageElement = document.createElement("p");
        userMessageElement.textContent = userMessage;
        userMessageElement.style.textAlign = "right";
        chatBody.appendChild(userMessageElement);
        chatInput.value = "";

        try {
            console.log("🔁 Enviando para API:", API_URL);
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_message: userMessage,
                    session_id: sessionId
                }),
            });

            if (!response.ok) throw new Error(`Erro na API: ${response.status}`);

            const data = await response.json();
            sessionId = data.session_id;

            const botMessageElement = document.createElement("p");
            botMessageElement.textContent = data.response;
            chatBody.appendChild(botMessageElement);
        } catch (error) {
            console.error("❌ Erro ao se comunicar com o backend:", error);
            const errorMessageElement = document.createElement("p");
            errorMessageElement.textContent = "Erro ao processar sua mensagem.";
            chatBody.appendChild(errorMessageElement);
        }

        chatBody.scrollTop = chatBody.scrollHeight;
    }

    sendButton.addEventListener("click", sendMessage);
    chatInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            sendMessage();
        }
    });
});
