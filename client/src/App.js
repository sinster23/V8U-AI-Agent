import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import "./App.css";

function App() {
  const [chats, setChats] = useState(() => {
  const savedChats = localStorage.getItem("chats");
  return savedChats ? JSON.parse(savedChats) : [];
});
  const [selectedChatIndex, setSelectedChatIndex] = useState(() => {
  const savedIndex = localStorage.getItem("selectedChatIndex");
  return savedIndex !== null ? JSON.parse(savedIndex) : -1;
});


  useEffect(() => {
  localStorage.setItem("chats", JSON.stringify(chats));
  localStorage.setItem("selectedChatIndex", JSON.stringify(selectedChatIndex));
}, [chats, selectedChatIndex]);

const handleRenameChat = (index, newTitle) => {
  const updatedChats = [...chats];
  updatedChats[index].title = newTitle;
  setChats(updatedChats);
  localStorage.setItem("chats", JSON.stringify(updatedChats)); // If you're persisting
};


 const handleNewChat = () => {
  // Don't create a new chat if already on the default screen (no chats and none selected)
  if (selectedChatIndex === -1 && chats.length === 0) {
    return;
  }

  setChats(prevChats => {
    const newChats = [...prevChats, { title: "New Chat", messages: [] }];
    setSelectedChatIndex(newChats.length - 1); // Focus new chat
    return newChats;
  });
};


  const handleSelectChat = (index) => {
    setSelectedChatIndex(index);
  };

  const handleDeleteChat = (indexToDelete) => {
    setChats(prevChats => {
      const updatedChats = prevChats.filter((_, i) => i !== indexToDelete);

      // Adjust the selectedChatIndex after deletion to prevent issues
      let newSelectedIndex = selectedChatIndex;
      if (indexToDelete === newSelectedIndex) {
        // If the deleted chat was selected, default to the first chat or -1 if no chats left
        newSelectedIndex = updatedChats.length > 0 ? 0 : -1;
      } else if (indexToDelete < newSelectedIndex) {
        // If a chat before the selected one was deleted, decrement selected index
        newSelectedIndex--;
      }
      setSelectedChatIndex(newSelectedIndex);
      return updatedChats;
    });
  };


const handleChatTurnCompleted = (userMessageText, botResponseText) => {
  setChats(prevChats => {
    let newChats = [...prevChats];
    let currentIndex = selectedChatIndex;

    // If no chat selected, create a new chat and select it
    if (currentIndex === -1) {
       newChats.push({ title: userMessageText.slice(0, 30), messages: [] });
      currentIndex = newChats.length - 1;
      setSelectedChatIndex(currentIndex);
    }

    const currentChat = newChats[currentIndex];
    const messages = currentChat.messages;

    // Duplicate check as before
    if (messages.length >= 2) {
      const lastUserMessage = messages[messages.length - 2];
      const lastBotMessage = messages[messages.length - 1];

      if (
        lastUserMessage?.type === 'user' && lastUserMessage.text === userMessageText &&
        lastBotMessage?.type === 'bot' && lastBotMessage.text === botResponseText
      ) {
        console.log("Duplicate messages detected, skipping update.");
        return prevChats;
      }
    }

    // Append new user and bot messages
    if (userMessageText) {
      currentChat.messages.push({ type: "user", text: userMessageText });
    }
    if (botResponseText) {
      currentChat.messages.push({ type: "bot", text: botResponseText });
    }
    return newChats;
  });
};

  // Determine which messages to display in the ChatWindow based on selectedChatIndex
  const currentChatMessages = selectedChatIndex !== -1 && chats[selectedChatIndex]
    ? chats[selectedChatIndex].messages
    : []; // If no chat selected, pass an empty array (triggers welcome message in ChatWindow)

  return (
    <div className="app">
      <Sidebar
        chats={chats}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        onRenameChat={handleRenameChat}
        selectedChatIndex={selectedChatIndex} // Pass selected index to Sidebar for active styling
      />

      <ChatWindow
        messages={currentChatMessages} // Pass messages for the currently selected chat
        onChatTurnCompleted={handleChatTurnCompleted} // Pass callback for completed user/bot turns
      />
    </div>
  );

}


export default App;
