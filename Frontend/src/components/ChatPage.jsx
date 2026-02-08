import React, { useEffect, useRef, useState } from "react";
import { MdAttachFile, MdSend } from "react-icons/md";
import { useChatContext } from "../context/ChatContext";
import { useNavigate } from "react-router";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import toast from "react-hot-toast";
import { baseURL } from "../config/AxiosHelper";
import { getMessagess } from "../services/RoomService";
import { timeAgo } from "../config/helper";
const ChatPage = () => {
  const {
    roomId,
    currentUser,
    connected,
    setConnected,
    setRoomId,
    setCurrentUser,
    darkMode,
    setDarkMode,
  } = useChatContext();
  // console.log(roomId);
  // console.log(currentUser);
  // console.log(connected);

  const navigate = useNavigate();
  useEffect(() => {
    if (!connected) {
      navigate("/");
    }
  }, [connected, roomId, currentUser]);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const chatBoxRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);

  //page init:
  //messages ko load karne honge

  useEffect(() => {
    async function loadMessages() {
      try {
        const messages = await getMessagess(roomId);
        // console.log(messages);
        setMessages(messages);
      } catch (error) {}
    }
    if (connected) {
      loadMessages();
    }
  }, []);

  //scroll down

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scroll({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  //stompClient ko init karne honge
  //subscribe

  useEffect(() => {
    const connectWebSocket = () => {
      ///SockJS
      const sock = new SockJS(`${baseURL}/chat`);
      const client = Stomp.over(sock);

      client.connect({}, () => {
        setStompClient(client);

        toast.success("connected");

        client.subscribe(`/topic/room/${roomId}`, (message) => {
          console.log(message);

          const newMessage = JSON.parse(message.body);

          setMessages((prev) => [...prev, newMessage]);

          //rest of the work after success receiving the message
        });
      });
    };

    if (connected) {
      connectWebSocket();
    }

    //stomp client
  }, [roomId]);

  //send message handle

  const sendMessage = async () => {
    if (stompClient && connected && input.trim()) {
      console.log(input);

      const message = {
        sender: currentUser,
        content: input,
        roomId: roomId,
      };

      stompClient.send(
        `/app/sendMessage/${roomId}`,
        {},
        JSON.stringify(message)
      );
      setInput("");
    }

    //
  };

  function handleLogout() {
    stompClient.disconnect();
    setConnected(false);
    setRoomId("");
    setCurrentUser("");
    navigate("/");
  }

  return (
    <div className={`min-h-screen ${
      darkMode 
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black" 
        : "bg-gradient-to-br from-gray-50 via-white to-gray-100"
    }`}>
      {/* this is a header */}
      <header className={`fixed w-full top-0 z-50 backdrop-blur-xl shadow-lg ${
        darkMode 
          ? "bg-white/5 border-b border-gray-700" 
          : "bg-white/80 border-b border-gray-200"
      }`}>
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* room name container */}
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              darkMode 
                ? "bg-gradient-to-r from-gray-600 to-gray-700" 
                : "bg-gradient-to-r from-blue-500 to-blue-600"
            }`}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>Room</h1>
              <p className={`text-sm font-mono ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{roomId}</p>
            </div>
          </div>
          
          {/* username container */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <h1 className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>{currentUser}</h1>
              <p className="text-sm text-green-400">● Online</p>
            </div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              darkMode 
                ? "bg-gradient-to-r from-gray-600 to-gray-700" 
                : "bg-gradient-to-r from-blue-500 to-purple-600"
            }`}>
              <span className="text-white font-bold text-lg">
                {currentUser.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center gap-3">
            {/* Dark mode toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-3 rounded-xl transition-all duration-200 ${
                darkMode 
                  ? "bg-gray-800 text-yellow-400 hover:bg-gray-700" 
                  : "bg-white text-gray-700 hover:bg-gray-100 shadow-lg border border-gray-200"
              }`}
            >
              {darkMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            
            {/* Leave room button */}
            <button
              onClick={handleLogout}
              className={`font-semibold py-2 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-2 ${
                darkMode 
                  ? "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white" 
                  : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Leave Room
            </button>
          </div>
        </div>
      </header>

      <main
        ref={chatBoxRef}
        className="container mx-auto px-6 pt-24 pb-32 h-screen overflow-auto"
      >
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.sender === currentUser ? "justify-end" : "justify-start"
              } animate-fade-in`}
            >
              <div
                className={`max-w-xs lg:max-w-md p-4 rounded-2xl shadow-lg transform transition-all duration-200 hover:scale-105 ${
                  message.sender === currentUser 
                    ? (darkMode 
                        ? "bg-gradient-to-r from-gray-600 to-gray-700" 
                        : "bg-gradient-to-r from-blue-500 to-blue-600")
                    : (darkMode 
                        ? "bg-white/5 backdrop-blur-xl border border-gray-700" 
                        : "bg-white border border-gray-200")
                }`}
              >
                <div className={`flex items-start gap-3 ${message.sender === currentUser ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender === currentUser 
                      ? (darkMode ? "bg-white/20" : "bg-white/30")
                      : (darkMode 
                          ? "bg-gradient-to-r from-gray-600 to-gray-700" 
                          : "bg-gradient-to-r from-purple-500 to-pink-500")
                  }`}>
                    <span className="text-sm font-bold text-white">
                      {message.sender.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className={`flex-1 ${message.sender === currentUser ? "text-right" : "text-left"}`}>
                    <p className={`text-xs font-semibold mb-1 ${
                      message.sender === currentUser 
                        ? (darkMode ? "text-gray-200" : "text-blue-100")
                        : (darkMode ? "text-gray-300" : "text-gray-700")
                    }`}>
                      {message.sender}
                    </p>
                    <p className={`text-sm ${darkMode ? "text-white" : "text-gray-800"}`}>
                      {message.content}
                    </p>
                    <p className={`text-xs mt-1 ${
                      message.sender === currentUser 
                        ? (darkMode ? "text-gray-300" : "text-blue-200")
                        : (darkMode ? "text-gray-400" : "text-gray-500")
                    }`}>
                      {timeAgo(message.timeStamp)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      
      {/* input message container */}
      <div className={`fixed bottom-0 left-0 right-0 p-4 backdrop-blur-xl ${
        darkMode 
          ? "bg-white/5 border-t border-gray-700" 
          : "bg-white/80 border-t border-gray-200"
      }`}>
        <div className="container mx-auto max-w-4xl">
          <div className={`flex items-center gap-3 backdrop-blur-xl rounded-2xl p-2 ${
            darkMode 
              ? "bg-white/5 border border-gray-700" 
              : "bg-white border border-gray-300"
          }`}>
            <button className={`p-3 rounded-xl transition-all duration-200 ${
              darkMode 
                ? "text-gray-400 hover:text-white hover:bg-gray-700/50" 
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}>
              <MdAttachFile size={20} />
            </button>
            <input
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              type="text"
              placeholder="Type your message here..."
              className={`flex-1 px-4 py-2 focus:outline-none ${
                darkMode 
                  ? "bg-transparent text-white placeholder-gray-400" 
                  : "bg-transparent text-gray-800 placeholder-gray-500"
              }`}
            />
            <button
              onClick={sendMessage}
              className={`p-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg ${
                darkMode 
                  ? "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white" 
                  : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
              }`}
            >
              <MdSend size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
