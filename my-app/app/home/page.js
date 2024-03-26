// components/MainMenu.js
"use client";

import styles from "./Home.module.css";
import { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import { useRouter } from "next/navigation";
import updateHangeulKnowledge from "./updateHangeulKnowledge";

const MainMenu = () => {
  const [username, setUsername] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchUsername() {
      try {
        const res = await fetch("http://localhost:5000/user/me", {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await res.json();
        setUsername(data.username);
      } catch (error) {
        console.error(
          "An error occurred while fetching the user's name:",
          error
        );
        setUsername("user");
      }
    }

    fetchUsername();
  }, []);

  useEffect(() => {
    // Ensure username is not empty before fetching additional information
    if (username) {
      async function fetchInformation() {
        try {
          const res = await fetch("http://localhost:5000/user/findInfo", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username }),
            credentials: "include",
          });

          if (!res.ok) {
            throw new Error("Failed to fetch user data");
          }
          const data = await res.json();

          if (data.knowsHangeul === false) {
            setIsModalOpen(true);
          }

          console.log(data);
        } catch (error) {
          console.log(error);
        }
      }

      fetchInformation();
    }
  }, [username]); // Dependency array includes username

  const handleModalClose = () => {
    setIsModalOpen(false);
    updateHangeulKnowledge(username);
    router.push("/hangeul");
  };

  const handleModalConfirm = async () => {
    setIsModalOpen(false);
    updateHangeulKnowledge(username);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/session/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to logout");
      }

      localStorage.removeItem("session_token");

      router.push("/login");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className={styles.mainMenuWrapper}>
      <div className={styles.logoutButtonContainer}>
        <button className={styles.logoutButton} onClick={handleLogout}>
          Log out
        </button>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
      />
      <div className={styles.greeting}>
        <h1 className={styles.heading}>Hello {username || ""}!</h1>
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
