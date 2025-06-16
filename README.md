# 🤖 V8U – Your All-in-One AI Study Assistant

V8U is a sleek, intelligent AI agent that helps you study better, faster, and smarter. It supports text input, file uploads (PDFs, DOCX, TXT, Excel, images), speech-to-text via microphone, and delivers answers with beautifully rendered math equations and code blocks — all in a clean chat interface.

<p align="center">
  <img src="https://github.com/sinster23/Screenshots/blob/main/V8U%20project%20ss/ss1.png" alt="ss1" width="75%" style="margin-right: 10px;" />
  <img src="https://github.com/sinster23/Screenshots/blob/main/V8U%20project%20ss/ss2.png" alt="ss2" width="75%" />
</p>

---

## ✨ Features

- 🎤 **Voice Input** – Ask questions by speaking with built-in speech recognition
- 🧠 **AI-Powered Answers** – Ask anything, from math to programming to theory
- 📎 **File Upload Support** – Upload documents and ask questions related to them
- 🧮 **LaTeX Math Rendering** – Get clean, readable math equations
- 💻 **Code Syntax Highlighting** – Great for programming help
- 💬 **Chat History Memory** – Retains context of previous messages
- 🖼️ **Image and Document Support** – Accepts PDF, DOCX, TXT, XLSX, PNG, JPEG
- ⚙️ **LLM Backend** - Powered by Groq

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
### 2. Create a .env file in the server/ directory with the following:

```env
GROQ_API_KEY=your_groq_api_key_here
```

### 3. Start the Backend
```bash
cd server
npm install
node server.js
```
### 4. Start the Frontend
```bash
cd client
npm install
npm start
```
### 5. Upload Files + Ask Away!
✅ Click the + icon to upload a document

✅ Ask your question in the input field or via microphone

✅ Hit Send and watch the magic 🪄

---

## 📂 Folder Structure

```
.
├── frontend/
│   ├── src/components/ChatWindow.js
│   └── ...
├── backend/
│   ├── server.js
│   └── prompt.js
```

---

## 🧠 Example Prompts
- "Explain Newton's Laws with equations"

- "How to reverse a linked list in C++?"

- "Summarize this uploaded PDF"

- "What is a neural network?"

---

## ⚙️ Future Features
🔁 Auto-scroll toggle

🧵 Threaded chat view

🌐 Cloud document sync

🎨 Custom themes

---


## 📣 Contribute / Support

If you like this tool, consider giving it a ⭐ and checking out my other work:

👉 [My GitHub Profile](https://github.com/sinster23)

---

## 📄 License

MIT License. Feel free to use, modify, or share!

---
