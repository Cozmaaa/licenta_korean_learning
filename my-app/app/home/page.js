// components/MainMenu.js
"use client";

import styles from "./Home.module.css";
import { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import { useRouter } from "next/navigation";
import updateHangeulKnowledge from "./updateHangeulKnowledge";
import { getUserByCookie } from "@/utils/getUserByCookie";

const MainMenu = () => {
  const [username, setUsername] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkCredentials() {
      try {
        const response = await fetch(
          "http://localhost:5000/session/checkSession",
          {
            method: "POST",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to verify session");
        }
      } catch (error) {
        console.error("An error occurred:", error);
        router.push("/login");
      }
    }
    checkCredentials();
  }, []);

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

  const redirectToLastKoreanLetter = async () => {
    try {
      const userId = await getUserByCookie();
      const response = await fetch(
        "http://localhost:5000/user/getLastHangeulLetter",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: userId }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const { lastHangeulLetter } = await response.json();

      // Redirect to the page for the last Hangeul letter
      router.push(`/hangeul/${lastHangeulLetter}`);
    } catch (error) {
      console.error("Error:", error);
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
      <div className={styles.greetingContainer}>
        <div className={styles.greetingBox}>
          <h1 className={styles.greetingText}>
            안녕하세요 {username}
          </h1>
        </div>
      </div>
      <div className={styles.menuContainer}>
        <div className={`${styles.menuItem} ${styles.color1}`}>
          <h2 className={styles.heading}>
            Stories
            <button
              className={`${styles.button} ${styles.color1}`}
              onClick={() => router.push("/stories")}
            >
              Browse Stories
            </button>
          </h2>
        </div>
        <div className={`${styles.menuItem} ${styles.color2}`}>
          <h2 className={styles.heading}>
            Hangeul
            <button
              className={`${styles.button} ${styles.color2}`}
              onClick={() => router.push("/hangeul")}
            >
              Learn Hangeul
            </button>
            <button
              className={`${styles.button} ${styles.color2}`}
              onClick={redirectToLastKoreanLetter}
            >
              Continue from where you left off
            </button>
          </h2>
        </div>
        <div className={`${styles.menuItem} ${styles.color3}`}>
          <h2 className={styles.heading}>
            Flashcards
            <button
              className={`${styles.button} ${styles.color3}`}
              onClick={() => router.push("/flashcards")}
            >
              Review Words
            </button>
          </h2>
        </div>
        <div className={`${styles.menuItem} ${styles.color4}`}>
          <h2 className={styles.heading}>
            Chatting
            <button
              className={`${styles.button} ${styles.color4}`}
              onClick={() => router.push("/chat")}
            >
              Train Writing
            </button>
          </h2>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;
