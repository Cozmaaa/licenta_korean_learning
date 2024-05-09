"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Chat.module.css";
import { useRouter } from "next/navigation";
import { getUserByCookie } from "@/utils/getUserByCookie";

const ChatPage = () => {
  const [inputText, setInputText] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router= useRouter();

  useEffect(() => {
    const checkUserType = async () => {
      try {
        const userId = await getUserByCookie();
        
        if (!userId) {
          router.push("/login");
        }
        setIsLoggedIn(true); 
      } catch (error) {
        console.error("Error checking user login status", error);
        router.push("/login");
      }
    };
  
    checkUserType();
  }, []);

  if(!isLoggedIn){
    return null;
  }

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
      <button
        className={styles.homeButton}
        onClick={() => router.push("/home")}
      >
        Back to Home
      </button>
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
