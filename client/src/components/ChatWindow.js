// src/components/ChatWindow.js
import React, { useState, useRef, useEffect } from "react";
import { FaMicrophone } from "react-icons/fa";
import ReactMarkdown from 'react-markdown';
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { LightAsync as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import "./ChatWindow.css";

import axios from "axios"; 

function ChatWindow({ messages, onChatTurnCompleted }) {
  const [question, setQuestion] = useState("");
  const inputRef = useRef(null);
  const chatEndRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false); // New state for loading indicator
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [uploadedFileText, setUploadedFileText] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null); // Ref to hold the SpeechRecognition instance


 useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false; // Listen for a single utterance
      recognitionRef.current.lang = "en-US";
      recognitionRef.current.interimResults = false; // Only return final results

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log("You said: " + transcript);
        setQuestion(transcript); // Set the recognized text into the input field
        setIsListening(false); // Stop listening after result is received
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        setIsListening(false); // Ensure listening state is reset on error
        console.error("Speech recognition error:", event.error);
        if (event.error === 'not-allowed') {
          alert("Microphone access denied. Please enable it in your browser settings (e.g., Chrome: Site Settings -> Microphone).");
        } else if (event.error === 'no-speech') {
            alert("No speech detected. Please try speaking louder or more clearly.");
        } else if (event.error === 'network') {
            alert("Network error during speech recognition. Check your internet connection.");
        } else if (event.error === 'aborted') {
            alert("Speech recognition aborted (e.g., by user click).");
        }
      };
    } else {
      alert("Speech recognition not supported in this browser. Please use Chrome or Edge.");
    }

    return () => {
      if (recognitionRef.current && isListening) { // Only stop if it's currently active
        recognitionRef.current.stop();
        setIsListening(false);
      }
    };
  }, [isListening]); // Added isListening to dependency array to ensure cleanup runs when state changes

  // --- Microphone Click Handler ---
  const handleMicClick = () => {
    if (!recognitionRef.current) {
        console.warn("Speech recognition API is not available or initialized.");
        return;
    }

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error("Error stopping speech recognition:", error);
      }
    } else {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error("Failed to start speech recognition:", error);
        if (error.name === 'InvalidStateError') {
          console.warn("Speech recognition is already active or in an invalid state. This should ideally not happen if 'isListening' is managed correctly. Attempting to stop and restart.");
          try {
              recognitionRef.current.stop();
              setTimeout(() => recognitionRef.current.start(), 100);
          } catch (restartError) {
              console.error("Failed to restart speech recognition after InvalidStateError:", restartError);
          }
        }
      }
    }
  };

const askBot = async () => {
  if ((!question.trim() && !uploadedFileText) || isLoading) return;

  setIsLoading(true);

  let userMessageText = question.trim();

  if (uploadedFileName) {
    userMessageText += `\n📎 *${uploadedFileName} uploaded* `;
  }


  if (!userMessageText) {
    userMessageText = "Refer to the uploaded file.";
  }

  const localHistory = [
    ...messages,
    { type: "user", text: userMessageText },
  ].map((msg) => ({
    role: msg.type === "user" ? "user" : "assistant",
    content: msg.text,
  }));

  // Clear input and file info before sending
  setQuestion("");
  setUploadedFileName(null);

  try {
    const res = await axios.post("http://localhost:3001/ask", {
      question: userMessageText,
      history: localHistory,
      context: uploadedFileText || "",
    });

    const botResponseText = res.data.answer;
    onChatTurnCompleted(userMessageText, botResponseText);
  } catch (err) {
    console.error("Error getting response from backend:", err);
    onChatTurnCompleted(userMessageText, "⚠️ Error getting response from bot.");
  } finally {
    setIsLoading(false);
  }
};


  const handleFileUpload = async (e) => {
    console.log("File upload triggered");
    const file = e.target.files[0];
    if (!file) return;

     const supportedTypes = [
       "application/pdf",
       "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
       "text/plain",
       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
       "image/png",
       "image/jpeg",
     ];

     if (!supportedTypes.includes(file.type)) {
       console.warn("Unsupported file type:", file.type);
       setUploadedFileName(file.name);
       setUploadedFileText(
         `The uploaded file type (${file.type}) is not supported. Please try a different file type.`
       );
       return;
     }

    setUploadedFileName(file.name);

    const formData = new FormData();
    formData.append("file", file); 

    try {
      const res = await axios.post(
        "http://localhost:3001/api/upload-file",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );


      setUploadedFileText(res.data.text);
      console.log("File uploaded successfully:", res.data.text);
    } catch (err) {
      console.error("Upload failed:", err);
      setUploadedFileName(null);
      setUploadedFileText(null);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent new line in textarea
      askBot(); // Trigger sending message

    }
  };

  // Scroll to bottom when messages change (messages is now a prop)
   useEffect(() => {
    // Use optional chaining for chatEndRef.current to prevent errors if ref is null
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-size textarea based on content
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto"; // Reset height to recalculate scrollHeight
      const currentScrollHeight = inputRef.current.scrollHeight;
      const maxHeight = 200; // Matches CSS max-height

      if (currentScrollHeight > maxHeight) {
        inputRef.current.style.height = `${maxHeight}px`;
        inputRef.current.style.overflowY = "auto"; // Enable scrollbar
      } else {
        inputRef.current.style.height = `${currentScrollHeight}px`;
        inputRef.current.style.overflowY = "hidden"; // Hide scrollbar
      }
    }
  }, [question]); // Re-run when input question changes

  return (
    <div className="chat-window">
      <div className="messages">
        {messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-text">Hi, I am V8U 😎
              <div className="subtext">
              Need help with any specific topic ?{" "}
              <span role="img" aria-label="thinking face">
                🤔
              </span></div>
            </div>
            <div className="suggestions">
              {[
                "How do I prepare for my exam ?",
                "How do LLMs work?",
                "What makes you different from other LLMs?",
                "Can you explain the concept of recursion?",
              ].map((text, index) => (
                <button
                  key={index}
                  className="suggestion-btn"
                  onClick={() => setQuestion(text)} // Set question from suggestion
                  disabled={isLoading} // Disable suggestions while loading
                >
                  {text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="messages-content">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`message ${msg.type === "user" ? "user" : "bot"}`}
              >
                <div className="markdown-block">
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={{
                      p({ node, children }) {
                        return (
                          <div style={{ margin: 0, padding: 0 }}>
                            {children}
                          </div>
                        );
                      },
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={atomOneDark}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      <div className="input-wrapper">
        <div className="input-inner">
          {" "}
          <input
            type="file"
            id="file-upload"
            accept=".pdf, .docx, .txt, .xlsx, .png, .jpg, .jpeg"
            style={{ display: "none" }}
            onChange={handleFileUpload}
          />
          {!uploadedFileName && (
            <label className="upload-button">
              +
              <input
                type="file"
                id="file-upload"
                accept=".pdf, .docx, .txt, .xlsx, .png, .jpg, .jpeg"
                style={{ display: "none" }}
                onChange={handleFileUpload}
              />
            </label>
          )}
          <div
            className={`file-pill-wrapper ${
              uploadedFileName ? "fade-in" : "fade-out"
            }`}
          >
            {uploadedFileName && (
              <div className="file-pill">
                📄 {uploadedFileName}
                <button
                  className="remove-file"
                  onClick={() => {
                    setUploadedFileName(null);
                    setUploadedFileText(null);
                  }}
                >
                  ✖
                </button>
              </div>
            )}
          </div>
          <textarea
            className="chat-input"
            placeholder="Send a message..."
            rows={1}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            ref={inputRef}
            disabled={isLoading} // Disable textarea while loading
          />
          <button  className={isListening ? "listening" : "mic-button"} onClick={handleMicClick} disabled={isLoading}> 
            <FaMicrophone size={18} />
          </button>
          <button
            className="send-button"
            onClick={askBot}
            disabled={isLoading || !question.trim()} // Disable button while loading or if input is empty
          >
            {isLoading ? (
              <span className="spinner">◌</span> // Simple spinner
            ) : (
              "➤"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;
