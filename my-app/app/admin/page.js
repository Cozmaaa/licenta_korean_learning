"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import styles from "./AdminPage.module.css";
import { getUserByCookie } from "@/utils/getUserByCookie";


const AdminPage = () => {
  const [word, setWord] = useState("");
  const [translation, setTranslation] = useState("");
  const [randomMeanings, setRandomMeanings] = useState([]);
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState(1);
  const [content, setContent] = useState("");
  const [highlightedWords, setHighlightedWords] = useState([]);
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkUserType = async () => {
      try {
        const userId = await getUserByCookie();
        console.log(userId)
  
        // Send the user ID to the backend to check user type
        const response = await axios.post(
          "http://localhost:5000/user/isAdmin",
          {
            userId: userId,
          }
        );
  
        const { isAdmin } = response.data;
        setIsAdmin(isAdmin);
  
        if (!isAdmin) {
          router.push("/home");
        }
      } catch (error) {
        console.error("Error checking user type:", error);
        router.push("/home");
      }
    };
  
    checkUserType();
  }, []);

  if (!isAdmin) {
    return null; // Render nothing while checking user type
  }

  const handleAddWord = async () => {
    try {
      const response = await axios.post("http://localhost:5000/word/", {
        word,
        translation,
        randomMeanings,
      });
      console.log("Word added:", response.data);
      setWord("");
      setTranslation("");
      setRandomMeanings([]);
    } catch (error) {
      console.error("Error adding word:", error);
    }
  };

  const handleAddStory = async () => {
    try {
      const response = await axios.post("http://localhost:5000/story/", {
        title,
        level,
        content,
        highlightedWords: highlightedWords.map((word) => word.trim()), // Send the array of word strings
      });
      console.log("Story added:", response.data);
      setTitle("");
      setLevel(1);
      setContent("");
      setHighlightedWords([]);
    } catch (error) {
      console.error("Error adding story:", error);
    }
  };

  return (
    <div className={styles.adminPageWrapper}>
      <div className={styles.sectionContainer}>
        <h2 className={styles.sectionHeading}>Add Word</h2>
        <div className={styles.formGroupContainer}>
          <label className={styles.labelElement}>Word:</label>
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            className={styles.inputElement}
          />
        </div>
        <div className={styles.formGroupContainer}>
          <label className={styles.labelElement}>Translation:</label>
          <input
            type="text"
            value={translation}
            onChange={(e) => setTranslation(e.target.value)}
            className={styles.inputElement}
          />
        </div>
        <div className={styles.formGroupContainer}>
          <label className={styles.labelElement}>
            Random Meanings (comma-separated):
          </label>
          <input
            type="text"
            value={randomMeanings.join(", ")}
            onChange={(e) => setRandomMeanings(e.target.value.split(", "))}
            className={styles.inputElement}
          />
        </div>
        <button className={styles.buttonElement} onClick={handleAddWord}>
          Add Word
        </button>
      </div>

      <div className={styles.sectionContainer}>
        <h2 className={styles.sectionHeading}>Add Story</h2>
        <div className={styles.formGroupContainer}>
          <label className={styles.labelElement}>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.inputElement}
          />
        </div>
        <div className={styles.formGroupContainer}>
          <label className={styles.labelElement}>Level:</label>
          <input
            type="number"
            value={level}
            onChange={(e) => setLevel(parseInt(e.target.value))}
            className={styles.inputElement}
          />
        </div>
        <div className={styles.formGroupContainer}>
          <label className={styles.labelElement}>Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={styles.textAreaElement}
          />
        </div>
        <div className={styles.formGroupContainer}>
          <label className={styles.labelElement}>
            Highlighted Words (comma-separated):
          </label>
          <input
            type="text"
            value={highlightedWords.join(", ")}
            onChange={(e) =>
              setHighlightedWords(
                e.target.value.split(",").map((word) => word.trim())
              )
            }
            className={styles.inputElement}
          />
        </div>
        <button className={styles.buttonElement} onClick={handleAddStory}>
          Add Story
        </button>
      </div>
    </div>
  );
};

export default AdminPage;
