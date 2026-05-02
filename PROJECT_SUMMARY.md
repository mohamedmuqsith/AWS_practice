# 📚 Grammar GPT: Interactive AI English Tutor

## 🎯 Project Motive & Idea
**Grammar GPT** is a high-performance, bilingual AI chatbot designed to make English grammar learning accessible, engaging, and personal. 

The core motive is to bridge the language gap for **Tamil speakers** by providing an AI tutor that can explain complex English rules in both English and Tamil. It combines a structured curriculum (from a local database) with the reasoning power of world-class Large Language Models (LLMs).

---

## 🤖 The "Quad-Engine" AI Architecture
To ensure the bot is always available for students, it uses a sophisticated **Failover System** across four different layers of intelligence:

1.  **Primary Engine (Hugging Face)**: Uses `google/gemma-2-2b-it`. Optimized for fast, free-tier serverless inference.
2.  **High-Speed Fallback (Groq)**: Uses `llama-3.3-70b-versatile`. This is the "brain" of the app, providing near-instant responses with Llama 3.3's advanced reasoning.
3.  **Reliability Fallback (Google Gemini)**: Uses `gemini-1.5-flash`. A reliable backup that ensures the bot stays online even during peak global traffic.
4.  **The Foundation (Local RAG)**: If all AI services are unavailable, the bot performs **Retrieval-Augmented Generation** from its own **MySQL Database**. It searches its curated grammar curriculum to provide verified lessons and patterns.

---

## 🛠️ Technology Stack
### Frontend
*   **React 19**: Modern UI framework for a smooth, single-page experience.
*   **Vite**: Next-generation frontend tooling for lightning-fast development.
*   **TailwindCSS**: Premium, modern styling with dark mode and custom animations.
*   **Lucide React**: High-quality SVG icons for a professional look.

### Backend
*   **Node.js & Express**: Scalable server architecture.
*   **MySQL (AWS RDS)**: Persistent storage for grammar lessons, examples, and chat history.
*   **REST API**: Secure communication between the chat interface and the AI engines.

### Infrastructure & Deployment
*   **Sevalla**: Used for hosting the web application and backend.
*   **Nixpacks**: For optimized build and deployment cycles.
*   **Environment Security**: Robust handling of API tokens and DB credentials.

---

## 🌍 Languages Supported
*   **User Languages**: English & Tamil.
*   **Programming**: 100% JavaScript (ES Modules).
*   **Data Format**: JSON & SQL.

---

## 💡 Key Features
*   **Bilingual Tutoring**: Ask a question in Tamil, get a detailed explanation in both Tamil and English.
*   **Contextual Learning**: The bot automatically looks up the relevant lesson in the database before answering.
*   **Admin Control Panel**: Manage the grammar curriculum, add new lessons, and monitor the bot's health.
*   **History Persistence**: Chat history is saved to the database per session, allowing students to continue where they left off.

---
*Created with ❤️ by Antigravity AI for mohamedmuqsith*
