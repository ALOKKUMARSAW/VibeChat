import React, { useState } from "react";
import chatIcon from "../assets/chat.png";
import toast from "react-hot-toast";
import { createRoomApi, joinChatApi } from "../services/RoomService";
import { useChatContext } from "../context/ChatContext";
import { useNavigate } from "react-router";
const JoinCreateChat = () => {
  const [detail, setDetail] = useState({
    roomId: "",
    userName: "",
  });

  const { roomId, userName, setRoomId, setCurrentUser, setConnected, darkMode, setDarkMode } =
    useChatContext();
  const navigate = useNavigate();

  function handleFormInputChange(event) {
    setDetail({
      ...detail,
      [event.target.name]: event.target.value,
    });
  }

  function validateForm() {
    if (detail.roomId === "" || detail.userName === "") {
      toast.error("Invalid Input !!");
      return false;
    }
    return true;
  }

  async function joinChat() {
    if (validateForm()) {
      //join chat

      try {
        const room = await joinChatApi(detail.roomId);
        toast.success("joined..");
        setCurrentUser(detail.userName);
        setRoomId(room.roomId);
        setConnected(true);
        navigate("/chat");
      } catch (error) {
        if (error.status == 400) {
          toast.error(error.response.data);
        } else {
          toast.error("Error in joining room");
        }
        console.log(error);
      }
    }
  }

  async function createRoom() {
    if (validateForm()) {
      //create room
      console.log(detail);
      // call api to create room on backend
      try {
        const response = await createRoomApi(detail.roomId);
        console.log(response);
        toast.success("Room Created Successfully !!");
        //join the room
        setCurrentUser(detail.userName);
        setRoomId(response.roomId);
        setConnected(true);

        navigate("/chat");

        //forward to chat page...
      } catch (error) {
        console.log(error);
        if (error.status == 400) {
          toast.error("Room  already exists !!");
        } else {
          toast("Error in creating room");
        }
      }
    }
  }

  return (
    <div className={`min-h-screen flex items-center justify-center ${
      darkMode 
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black" 
        : "bg-gradient-to-br from-gray-50 via-white to-gray-100"
    }`}>
      {/* Dark mode toggle */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-3 rounded-xl transition-all duration-200 ${
            darkMode 
              ? "bg-gray-800 text-yellow-400 hover:bg-gray-700" 
              : "bg-white text-gray-700 hover:bg-gray-100 shadow-lg border border-gray-200"
          }`}
        >
          {darkMode ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </div>

      <div className="p-8 w-full flex flex-col gap-6 max-w-md">
        {/* Glass morphism card */}
        <div className={`backdrop-blur-xl rounded-3xl shadow-2xl p-8 animate-slide-up ${
          darkMode 
            ? "bg-white/5 border border-gray-700" 
            : "bg-white/80 border border-gray-200"
        }`}>
          {/* Icon with gradient background */}
          <div className="flex justify-center mb-6">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg ${
              darkMode 
                ? "bg-gradient-to-r from-gray-600 to-gray-700" 
                : "bg-gradient-to-r from-blue-500 to-blue-600"
            }`}>
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </div>

          <h1 className={`text-3xl font-bold text-center mb-8 ${
            darkMode ? "text-white" : "text-gray-800"
          }`}>
            Join or Create a Room
          </h1>
          
          {/* name div */}
          <div className="mb-6">
            <label htmlFor="name" className={`block text-sm font-medium mb-2 ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}>
              Your Name
            </label>
            <div className="relative">
              <input
                onChange={handleFormInputChange}
                value={detail.userName}
                type="text"
                id="name"
                name="userName"
                placeholder="Enter your name"
                className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                  darkMode 
                    ? "bg-gray-800/50 border border-gray-600 text-white placeholder-gray-400 focus:ring-gray-500" 
                    : "bg-white border border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-blue-500"
                }`}
              />
            </div>
          </div>

          {/* room id div */}
          <div className="mb-8">
            <label htmlFor="roomId" className={`block text-sm font-medium mb-2 ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}>
              Room ID
            </label>
            <div className="relative">
              <input
                name="roomId"
                onChange={handleFormInputChange}
                value={detail.roomId}
                type="text"
                id="roomId"
                placeholder="Enter room ID or create new"
                className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                  darkMode 
                    ? "bg-gray-800/50 border border-gray-600 text-white placeholder-gray-400 focus:ring-gray-500" 
                    : "bg-white border border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-blue-500"
                }`}
              />
            </div>
          </div>

          {/* button  */}
          <div className="flex gap-3">
            <button
              onClick={joinChat}
              className={`flex-1 font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg ${
                darkMode 
                  ? "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white" 
                  : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
              }`}
            >
              Join Room
            </button>
            <button
              onClick={createRoom}
              className={`flex-1 font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg ${
                darkMode 
                  ? "bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white" 
                  : "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
              }`}
            >
              Create Room
            </button>
          </div>
        </div>
        
        {/* Footer text */}
        <p className={`text-center text-sm ${
          darkMode ? "text-gray-400" : "text-gray-600"
        }`}>
          Connect and chat in real-time
        </p>
      </div>
    </div>
  );
};

export default JoinCreateChat;
