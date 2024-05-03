"use client";
import { useEffect, useState } from "react";
import styles from "./Flashcards.module.css";
import { getUserByCookie } from "@/utils/getUserByCookie";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import arrayShuffle from "array-shuffle";

export default function SavedWordsQuiz() {
  const [savedWords, setSavedWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [result, setResult] = useState(null);
  const [randomMeanings, setRandomMeanings] = useState([]);
  const [options, setOptions] = useState([]);
  const [hasGuessed, setHasGuessed] = useState(false);
  const [isAdmin,setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchSavedWords = async () => {
      try {
        const userId = await getUserByCookie(); // Replace with the actual user ID
        console.log(userId);
        const response = await fetch(
          `http://localhost:5000/user/${userId}/savedWords`
        );
        if (!response.ok) {
          throw new Error(
            `Fetching saved words failed with status ${response.status}`
          );
        }
        const data = await response.json();
        const shuffledData = arrayShuffle(data);

        setSavedWords(shuffledData);
      } catch (error) {
        console.error("Error fetching saved words:", error);
      }
    };

    const checkUserType = async () => {
      try {
        const userId  = await getUserByCookie();
        console.log("User ID:", userId);

        const response = await axios.post(
          "http://localhost:5000/user/isAdmin",
          {
            userId: userId,
          }
        );

        const { isAdmin } = response.data;
        setIsAdmin(isAdmin);
      } catch (error) {
        console.error("Error checking user type:", error);
      }
    };

    fetchSavedWords();
    checkUserType();
  }, []);

  useEffect(() => {
    if (savedWords.length > 0 && currentWordIndex < savedWords.length) {
      const currentWord = savedWords[currentWordIndex];
      const meanings =
        currentWord.randomMeanings?.length > 0
          ? currentWord.randomMeanings
          : getRandomMeanings(2);
      setRandomMeanings(meanings);
    }
  }, [savedWords, currentWordIndex]);

  useEffect(() => {
    if (savedWords.length > 0 && currentWordIndex < savedWords.length) {
      const currentWord = savedWords[currentWordIndex];
      const randomizedOptions = [
        currentWord.translation,
        ...randomMeanings,
      ].sort(() => Math.random() - 0.5);
      setOptions(randomizedOptions);
    }
  }, [savedWords, currentWordIndex, randomMeanings]);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const getRandomMeanings = (count) => {
    const predefinedMeanings = [
      "Apple",
      "Banana",
      "Cat",
      "Dog",
      "Elephant",
      "Flower",
      "Guitar",
      "House",
      "Island",
      "Jacket",
      "King",
      "Lemon",
      "Moon",
      "Notebook",
      "Ocean",
      "Piano",
      "Queen",
      "Rainbow",
      "Sunshine",
      "Tree",
      "Umbrella",
      "Violin",
      "Waterfall",
      "Xylophone",
      "Yogurt",
      "Zebra",
    ];

    const shuffledMeanings = predefinedMeanings.sort(() => 0.5 - Math.random());
    return shuffledMeanings.slice(0, count);
  };

  const handleCheckAnswer = async () => {
    const currentWord = savedWords[currentWordIndex];
    const isCorrect = selectedOption === currentWord.translation;
    setHasGuessed(true);
    try {
      await fetch("http://localhost:5000/word/updateGuesses", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wordId: currentWord._id,
          isCorrect,
        }),
      });

      if (isCorrect) {
        setResult("Correct!");
      } else {
        setResult("Wrong!");
      }
    } catch (error) {
      console.error("Error updating word guesses:", error);
    }
  };

  const removeSavedWord = async() =>{
    const currentDeletedWord = savedWords[currentWordIndex];
    const userId = await getUserByCookie();
    try {
      await fetch("http://localhost:5000/user/removeSavedWord", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          wordId:currentDeletedWord._id,
        }),
      });
      const updatedSavedWords = savedWords.filter((word, index) => index !== currentWordIndex);
      setSavedWords(updatedSavedWords);
  
      // Reset the current word index to 0
      setCurrentWordIndex(0);
      setSelectedOption(null);
      setResult(null);
      setHasGuessed(false);
  } catch (error) {
    console.error("Error updating word guesses:", error);
  }
}

  const handleNextWord = () => {
    setCurrentWordIndex((prevIndex) => prevIndex + 1);
    setSelectedOption(null);
    setResult(null);
    setHasGuessed(false);
  };

  if (savedWords.length === 0) {
    return <div className={styles.parentNoWords}>
      <h1 className={styles.textNoWords}>No more words to be reviewed, add some!</h1>
      <button
        className={styles.homeButtonNoWords}
        onClick={() => router.push("/home")}
      >
        Back to Home
      </button>
    </div>;
  }

  if (currentWordIndex >= savedWords.length) {
    return <div>
      <button
        className={styles.homeButton}
        onClick={() => router.push("/home")}
      >
        Back to Home
      </button>
    </div>;
  }


  const currentWord = savedWords[currentWordIndex];
  return (
    <div className={styles.container}>
      <button
        className={styles.homeButton}
        onClick={() => router.push("/home")}
      >
        Back to Home
      </button>
      {isAdmin && (<Link href="/graphs">
        <button className={styles.isAdminButton}>Check graphs</button>
      </Link>)}
      <h1 className={styles.title}>Saved Words Quiz</h1>
      <div className={styles.questionBox}>
        <h2 className={styles.word}>{currentWord.word}</h2>
        <div className={styles.options}>
          {options.map((option, index) => (
            <button
              key={index}
              className={`${styles.optionButton} ${
                selectedOption === option ? styles.selectedOption : ""
              }`}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </button>
          ))}
        </div>
        {selectedOption && (
          <div className={styles.resultBox}>
            {!hasGuessed ? (
              <button
                className={styles.checkButton}
                onClick={handleCheckAnswer}
              >
                Check Answer
              </button>
            ) : (
              <p className={styles.result}>{result}</p>
            )}
          </div>
        )}
      </div>
      {currentWordIndex < savedWords.length - 1 && (
        <button className={styles.nextButton} onClick={handleNextWord}>
          Next Word
        </button>
      )}
      <button className={styles.removeWord} onClick={removeSavedWord}>
        Remove word
      </button>
    </div>
  );
}
