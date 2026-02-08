import React, { createContext, useContext, useState } from "react";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [roomId, setRoomId] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [connected, setConnected] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <ChatContext.Provider
      value={{
        roomId,
        setRoomId,
        currentUser,
        setCurrentUser,
        connected,
        setConnected,
        darkMode,
        setDarkMode,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

const useChatContext = () => {
  return useContext(ChatContext);
};

export { ChatProvider, useChatContext };
