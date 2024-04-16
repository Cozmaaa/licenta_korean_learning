"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./StoryPage.module.css";
import BoldedWordModal from "./BoldedWordModal";

export default function StoryPage({ params }) {
  const [story, setStoryLetter] = useState(null);
  const id = params.id;
  const router = useRouter();
  const [clickedWord, setClickedWord] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const response = await fetch(`http://localhost:5000/story/${id}`);
          console.log(response);
          if (!response.ok) {
            throw new Error(
              `Data fetching failed with status ${response.status}`
            );
          }
          const data = await response.json();
          setStoryLetter(data);
        } catch (error) {
          console.log(error);
        }
      };

      fetchData();
    }
  }, [id]);

  const handleWordClick = (word) => {
    const clickedWord = story.highlightedWords.find(
      (highlightedWord) => highlightedWord.word === word
    );
    if (clickedWord) {
      setClickedWord(clickedWord);
      setShowPopup(true);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const renderHighlightedContent = () => {
    if (!story) return null;

    const highlightedWords = story.highlightedWords.map((word) => word.word);
    const parts = story.content.split(/([^\s!.,]+)/);
    console.log(parts);

    return parts.map((part, index) => {
      const trimmedPart = part.trim();
      if (highlightedWords.includes(trimmedPart)) {
        return (
          <span
            key={index}
            onClick={() => handleWordClick(trimmedPart)}
            className={styles.highlightedWord}
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  if (!story) {
    return <div></div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{story.title}</h1>
      <div className={styles.storyBox}>
        <p>{renderHighlightedContent()}</p>
      </div>
      {showPopup && clickedWord && (
        <BoldedWordModal
          word={clickedWord.word}
          translation={clickedWord.translation}
          onClose={handleClosePopup}
        />
      )}
      <button className={styles.redirectButton} onClick={() => router.back()}>
        Back to Stories
      </button>
    </div>
  );
}

export async function getServerComponent({ params }) {
  return {
    props: { params },
  };
}
