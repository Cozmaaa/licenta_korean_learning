"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Chat.module.css";

const ChatPage = () => {
  const [inputText, setInputText] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  // This effect will only run on the client after the component has mounted.
  // Any code that relies on the window or other browser-specific APIs should go here.
  useEffect(() => {
    // Here you can do any client-specific initialization
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(inputText);
      const response = await axios.post(
        "http://localhost:5000/api/generate-response",
        { text: inputText }
      );
      const responseData = response.data.response;
      setChatHistory((currentChatHistory) => [
        ...currentChatHistory,
        { text: inputText, isUser: true },
        { text: responseData, isUser: false },
      ]);
      setInputText("");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className={styles.chatWrapper}>
      <div className={styles.chatContainer}>
        <h1 className={styles.chatHeader}>Chat with a Korean seller</h1>
        <div className={styles.chatHistory}>
          {chatHistory.map((message, index) => (
            <div
              key={index}
              className={`${styles.message} ${
                message.isUser ? styles.userMessage : styles.botMessage
              }`}
            >
              <p>{message.text}</p>
            </div>
          ))}
        </div>
        <form className={styles.chatForm} onSubmit={handleSubmit}>
          <input
            type="text"
            className={styles.chatInput}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button type="submit" className={styles.chatButton}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
