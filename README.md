# Chatbot Project 🧠💬

Questo repository contiene un progetto multi-modulo per un'applicazione chatbot full-stack, composta da:

- 🔌 **PythonProject1** – Backend principale in FastAPI
- 💬 **nest-chat** – Backend real-time per la chat (NestJS + WebSocket)
- 💻 **my-chat-app** – Frontend interattivo per gli utenti (React)

---

## 📁 Struttura del progetto

chatbot/
├── my-chat-app/ # Frontend React
├── nest-chat/ # Chat backend in NestJS
├── fast-api/ # API principale in FastAPI
├── .gitignore
├── README.md



---

## 🔧 Requisiti

- Python 3.10+
- Node.js (v18+)
- pnpm o npm
- Git

---

## 🚀 Come avviare i moduli

### 🔌 Backend FastAPI (`fast-api/`)

```bash
cd fast-api
python -m venv .venv
. .venv/Scripts/activate  # oppure source .venv/bin/activate su Linux/Mac
pip install -r requirements.txt
uvicorn main:app --reload

💬 Backend NestJS (nest-chat/)
bash
Copia
Modifica
cd nest-chat
npm install
npm run start:dev


💻 Frontend React (my-chat-app/)
bash
Copia
Modifica
cd my-chat-app
npm install
npm start



🔐 Variabili d’ambiente
Assicurati di creare un file .env in fast-api/ con le tue chiavi API, es:

env
Copia
Modifica
OPENAI_API_KEY=sk-xxxxxx
