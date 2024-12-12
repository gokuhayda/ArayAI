// const API_URL = 'https://3543-191-177-193-123.ngrok-free.app/chat';
const API_URL =  https://chatbot-backend-zduj.onrender.com
document.addEventListener("DOMContentLoaded", () => {
    // Criação de elementos com atributos e estilos personalizados
    const createElement = (type, attributes = {}, styles = {}, innerHTML = "") => {
        const element = document.createElement(type);
        Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
        Object.assign(element.style, styles);
        element.innerHTML = innerHTML;
        return element;
    };

    // Criação do botão flutuante
    const chatbotButton = createElement("div", { id: "chatbot-button" }, {
        position: "fixed", left: "20px", bottom: "20px", width: "60px", height: "60px",
        borderRadius: "50%", backgroundColor: "#007bff", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: "9999",
    });

    const chatbotIcon = createElement("img", {
        src: "https://cdn-icons-png.flaticon.com/512/4712/4712027.png",
        alt: "Chatbot",
    }, { width: "40px", height: "40px" });
    chatbotButton.appendChild(chatbotIcon);
    document.body.appendChild(chatbotButton);

    // Criação da janela de chat
    const chatWindow = createElement("div", { id: "chat-window" }, {
        position: "fixed", left: "20px", bottom: "90px", width: "300px", height: "400px",
        backgroundColor: "#fff", border: "1px solid #ccc", borderRadius: "8px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", display: "none", zIndex: "9999",
        display: "flex", flexDirection: "column",
    });

    const chatHeader = createElement("div", {}, {
        backgroundColor: "#007bff", color: "#fff", padding: "10px", display: "flex",
        justifyContent: "space-between", alignItems: "center", borderTopLeftRadius: "8px", borderTopRightRadius: "8px",
    });
    const chatTitle = createElement("span", {}, {}, "Assistente Virtual");
    const closeChat = createElement("span", {}, { cursor: "pointer" }, "✖");
    chatHeader.append(chatTitle, closeChat);
    chatWindow.appendChild(chatHeader);

    const chatBody = createElement("div", { id: "chat-body" }, {
        flex: "1", padding: "10px", overflowY: "auto", maxHeight: "300px",
    }, "<p>Bem-vindo! Como posso ajudá-lo?</p>");
    chatWindow.appendChild(chatBody);

    const chatInputContainer = createElement("div", {}, {
        padding: "10px", borderTop: "1px solid #ccc", display: "flex",
    });
    const chatInput = createElement("input", { type: "text", placeholder: "Digite sua mensagem..." }, {
        flex: "1", padding: "5px", marginRight: "10px", border: "1px solid #ccc", borderRadius: "4px",
    });
    const sendButton = createElement("button", {}, {
        padding: "5px 10px", backgroundColor: "#007bff", color: "#fff", border: "none",
        borderRadius: "50%", cursor: "pointer", fontSize: "16px",
    }, "➤");
    chatInputContainer.append(chatInput, sendButton);
    chatWindow.appendChild(chatInputContainer);

    document.body.appendChild(chatWindow);

    // Lógica de abertura e fechamento
    chatbotButton.addEventListener("click", () => {
        chatWindow.style.display = chatWindow.style.display === "none" ? "block" : "none";
    });

    closeChat.addEventListener("click", () => {
        chatWindow.style.display = "none";
    });

    // Função para exibir mensagens no chat
    const displayMessage = (message, align = "left", color = "#333") => {
        const messageElement = createElement("p", {}, { textAlign: align, color });
        messageElement.textContent = message;
        chatBody.appendChild(messageElement);
        chatBody.scrollTop = chatBody.scrollHeight;
    };

    // Envio de mensagens para a API
    const sendMessage = async () => {
        const userMessage = chatInput.value.trim();
        if (!userMessage) {
            displayMessage("Por favor, insira uma mensagem.", "left", "red");
            return;
        }
    
        displayMessage(userMessage, "right", "#007bff");
        chatInput.value = "";
    
        try {
            console.log("Enviando mensagem para a API:", userMessage);
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_message: userMessage }),
            });
    
            console.log("Resposta recebida:", response);
    
            if (!response.ok) throw new Error(`Erro na API: ${response.status}`);
    
            const data = await response.json();
            console.log("Dados da resposta:", data);
    
            if (data?.response) {
                displayMessage(data.response, "left", "#333");
            } else {
                displayMessage("Erro: Resposta inválida do servidor.", "left", "red");
            }
        } catch (error) {
            console.error("Erro ao se comunicar com o backend:", error);
            displayMessage(`Erro ao processar sua mensagem: ${error.message}`, "left", "red");
        }
    };

    sendButton.addEventListener("click", sendMessage);

    chatInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") sendMessage();
    });
});
