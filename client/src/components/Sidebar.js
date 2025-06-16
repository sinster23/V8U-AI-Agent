import React, { useState } from "react";
import "./Sidebar.css";
import { FaTrash, FaPen } from "react-icons/fa";

function Sidebar({ chats, onNewChat, onSelectChat, onDeleteChat, onRenameChat, selectedChatIndex }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [tempTitle, setTempTitle] = useState("");

  const handleRename = (index) => {
    setEditingIndex(index);
    setTempTitle(chats[index].title);
  };

  const handleRenameSubmit = (index) => {
    if (tempTitle.trim() !== "") {
      onRenameChat(index, tempTitle.trim());
    }
    setEditingIndex(null);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <button className="new-chat-btn" onClick={onNewChat}>+ New Chat</button>
      </div>

      <div className="chat-list">
        {chats.map((chat, index) => (
          <div
            key={index}
            className={`chat-item ${index === selectedChatIndex ? "selected" : ""}`}
            onClick={() => onSelectChat(index)}
          >
            {editingIndex === index ? (
              <input
                className="rename-input"
                value={tempTitle}
                autoFocus
                onChange={(e) => setTempTitle(e.target.value)}
                onBlur={() => handleRenameSubmit(index)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleRenameSubmit(index);
                  } else if (e.key === "Escape") {
                    setEditingIndex(null);
                  }
                }}
                onClick={(e) => e.stopPropagation()} // prevent triggering chat select
              />
            ) : (
              <span className="chat-title">{chat.title}</span>
            )}

            <div
              className="chat-actions"
              onClick={(e) => e.stopPropagation()}
            >
              <FaPen
                className="chat-icon"
                title="Rename"
                onClick={() => handleRename(index)}
              />
              <FaTrash
                className="chat-icon delete"
                title="Delete"
                onClick={() => onDeleteChat(index)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
