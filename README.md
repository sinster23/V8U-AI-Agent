# 🤖 V8U – Your All-in-One AI Study Assistant

V8U is a sleek, intelligent AI agent that helps you study better, faster, and smarter. It supports text input, file uploads (PDFs, DOCX, TXT, Excel, images), speech-to-text via microphone, and delivers answers with beautifully rendered math equations and code blocks — all in a clean chat interface.

![V8U Screenshot](./screenshot.png) <!-- Optional: Add a real screenshot -->

---

## ✨ Features

- 🎤 **Voice Input** – Ask questions by speaking with built-in speech recognition
- 🧠 **AI-Powered Answers** – Ask anything, from math to programming to theory
- 📎 **File Upload Support** – Upload documents and ask questions related to them
- 🧮 **LaTeX Math Rendering** – Get clean, readable math equations
- 💻 **Code Syntax Highlighting** – Great for programming help
- 💬 **Chat History Memory** – Retains context of previous messages
- 🖼️ **Image and Document Support** – Accepts PDF, DOCX, TXT, XLSX, PNG, JPEG

---

## 🛠️ Tech Stack

```
| Frontend | Backend | AI/UX |
|----------|---------|-------|
| React + CSS | Node.js + Express | OpenAI API / LLM |
| React Markdown + KaTeX | File Parsing (pdf-parse, mammoth, etc.) | Speech Recognition API |
| Axios | Multer (for file upload) | |
```

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/sinster23/V8U-Ai-Agent.git
cd V8U-Ai-Agent
```
###2. Start the Backend
```bash
cd server
npm install
node server.js
```
###3. Start the Frontend
```bash
cd client
npm install
npm start
```
###4. Upload Files + Ask Away!
- Click the + icon to upload a document

- Ask your question in the input field or via microphone

- Hit Send and watch the magic 🪄

---

## 📂 Folder Structure

```
.
├── frontend/
│   ├── src/components/ChatWindow.js
│   └── ...
├── backend/
│   ├── index.js
│   └── fileHandlers.js
```

---

## 🧠 Example Prompts
"Explain Newton's Laws with equations"

"How to reverse a linked list in C++?"

"Summarize this uploaded PDF"

"What is a neural network?"

---

## ⚙️ Future Features
🔁 Auto-scroll toggle

🧵 Threaded chat view

🌐 Cloud document sync

🎨 Custom themes

---
