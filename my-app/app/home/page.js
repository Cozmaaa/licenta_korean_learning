// components/MainMenu.js
'use client';

import styles from "./Home.module.css";
import { useEffect, useState } from 'react';

const MainMenu = () => {
    const [username, setUsername] = useState('');

    useEffect(() => {
        // Define the function to fetch the user's name
        async function fetchUsername() {
          try {
            // Replace `backend-url` with the actual URL of your Express server
            const res = await fetch('http://localhost:5000/user/me', {
              credentials: 'include', // Needed to include the cookie
            });
    
            if (!res.ok) {
              throw new Error('Failed to fetch user data');
            }
    
            const data = await res.json();
            setUsername(data.username);
          } catch (error) {
            console.error("An error occurred while fetching the user's name:", error);
            setUsername('user');
          }
        }
            // Call the function
    fetchUsername();
}, []);

  return (
    <div className={styles.mainMenuWrapper}>
      <div className={styles.greeting}>
        <h1 className={styles.heading}>Hello {username || ''}!</h1>
      </div>
      <div className={styles.menuContainer}>
        <div className={styles.menuItem}>
          <h2 className={styles.heading}>Stories</h2>
          {/* Additional content goes here */}
        </div>
        <div className={styles.menuItem}>
          <h2 className={styles.heading}>Hangeul</h2>
          {/* Additional content goes here */}
        </div>
        <div className={styles.menuItem}>
          <h2 className={styles.heading}>Flashcards</h2>
          {/* Additional content goes here */}
        </div>
        <div className={styles.menuItem}>
          <h2 className={styles.heading}>Chatting</h2>
          {/* Additional content goes here */}
        </div>
      </div>
    </div>
  );
};

export default MainMenu;
