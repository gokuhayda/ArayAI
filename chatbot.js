import os
import logging
import random
from difflib import get_close_matches
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Imports do projeto
from sessions_manager import save_conversation, create_session, load_session_history, enqueue_message, is_processing, set_processing, get_next_message
from indexing import create_index
from data_ingestion import scrape_web_pages, process_documents
from chat_history_manager import manage_history
from utils_tools.config_loader import load_config
from core.query_router import FAQQueryRouter

def is_saudacao(msg, lista_salutations, threshold=0.8):
    msg_clean = msg.strip().lower()
    match = get_close_matches(msg_clean, lista_salutations, n=1, cutoff=threshold)
    return bool(match)

# Configuração de logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# Carregar variáveis do .env
load_dotenv()

# Carregar configuração do YAML
try:
    CONFIG_PATH = load_config()
except Exception as e:
    logger.error(f"Erro ao carregar o arquivo de configuração: {e}")
    exit(1)

# Caminhos e mensagens
SESSIONS_PATH = CONFIG_PATH['storage']['sessions_path']
CONVERSATIONS_PATH = CONFIG_PATH['storage']['conversations_path']
NOTIFICATION_WARNING = CONFIG_PATH['notification_warning_bot']
WELCOME_MESSAGES = CONFIG_PATH['welcome_messages']
SALUTATIONS = CONFIG_PATH['salutations']
REFORCO = CONFIG_PATH["messages"].get("prompt_reforco", "")

# App Flask
app = Flask(__name__, template_folder="../templates")
CORS(app, resources={r"/*": {"origins": "https://gokuhayda.github.io"}})

@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "https://gokuhayda.github.io"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    return response

# Pré-processamento
try:
    logger.info("Iniciando processamento de dados e criação do índice...")
    process_documents(CONFIG_PATH)
    scrape_web_pages(CONFIG_PATH)
    index = create_index(CONFIG_PATH)
    logger.info("Processamento de dados e criação do índice concluídos com sucesso.")
except Exception as e:
    logger.error(f"Erro no processamento inicial: {e}")
    exit(1)

router = FAQQueryRouter(index)

@app.route("/chat", methods=["POST", "OPTIONS"])
def chat_alternative():
    try:
        if request.method == "OPTIONS":
            return jsonify({"message": "CORS preflight successful"}), 200

        if not request.is_json:
            logger.warning("Requisição inválida: não é um JSON.")
            return jsonify({"error": "Requisição inválida. Esperado JSON."}), 400

        data = request.json
        user_message = data.get("user_message", "").strip()
        session_id = data.get("session_id", create_session(SESSIONS_PATH))

        logger.info(f"Mensagem recebida: {user_message}, Session ID: {session_id}")

        if not user_message:
            logger.warning("Mensagem do usuário não fornecida.")
            return jsonify({"error": "Mensagem não fornecida."}), 400

        if is_processing(session_id):
            return jsonify({"response": "Aguarde, estou processando sua pergunta anterior..."})

        set_processing(session_id, True)

        if is_saudacao(user_message, SALUTATIONS):
            response = random.choice(WELCOME_MESSAGES)
        else:
            user_message = f"{user_message}{REFORCO}"
            response = router.responder(user_message)

        set_processing(session_id, False)

        save_conversation(session_id, user_message, response, SESSIONS_PATH, CONVERSATIONS_PATH)
        session_history = load_session_history(session_id, SESSIONS_PATH)
        session_history = manage_history(session_history, user_message, response, token_limit=1000, summary_percentage=0.5)

        logger.info(f"Resposta gerada: {response}")
        return jsonify({"session_id": session_id, "response": str(response)}), 200

    except Exception as e:
        logger.exception("Erro no processamento do chatbot")
        return jsonify({"error": "Erro ao processar a consulta. Verifique os logs para mais detalhes."}), 500

# ✅ Rota base para lidar com OPTIONS / e GET /
@app.route("/", methods=["GET", "OPTIONS"])
def root():
    if request.method == "OPTIONS":
        return jsonify({"message": "CORS preflight OK"}), 200
    return jsonify({"message": "API do chatbot está online"}), 200

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
