"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./StoriesPage.module.css";
import { useRouter } from "next/navigation";
import axios from "axios";
import { getUserByCookie } from "@/utils/getUserByCookie";

export default function StoriesPage() {
  const [stories, setStories] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUserType = async () => {
      try {
        const userId = await getUserByCookie();

        if (!userId) {
          router.push("/login");
        }
      } catch (error) {
        console.error("Error checking user login status", error);
        router.push("/login");
      }
    };

    checkUserType();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/story/");
        console.log(response);
        if (!response.ok) {
          throw new Error(
            `Data fetching failed with status ${response.status}`
          );
        }
        const data = await response.json();
        setStories(data);
      } catch (error) {
        console.log(error);
      }
    };

    const checkUserType = async () => {
      try {
        const userId = await getUserByCookie();
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

    fetchData();
    checkUserType();
  }, []);

  const handleLevelChange = (event) => {
    setSelectedLevel(event.target.value);
  };

  const filteredStories =
    selectedLevel === "all"
      ? stories
      : stories.filter((story) => story.level === parseInt(selectedLevel));

  const levels = [...new Set(stories.map((story) => story.level))];

  const handleHomeClick = () => {
    router.push("/home");
  };

  const handleDeleteStory = async (storyId) => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete this story?"
      );
      if (confirmed) {
        const response = await axios.delete(
          `http://localhost:5000/story/${storyId}`
        );
        setStories(stories.filter((story) => story._id !== storyId));
      }
    } catch (error) {
      console.log(error);
      // Display an error message to the user
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Stories</h1>

      <div className={styles.filterContainer}>
        <label className={styles.labelText}>Filter by Level: </label>
        <select
          id="levelFilter"
          value={selectedLevel}
          onChange={handleLevelChange}
          className={styles.filterSelector}
        >
          <option value="all">All</option>
          {levels.map((level) => (
            <option key={level} value={level} className={styles.filterOptions}>
              Level {level}
            </option>
          ))}
        </select>
      </div>

      {isAdmin && (
        <Link href="/admin">
          <button className={styles.addStoriesButton}>Add Stories</button>
        </Link>
      )}

      <div className={styles.storyGrid}>
        {filteredStories.map((story) => (
          <div key={story._id} className={styles.storyBox}>
            <Link href={`/stories/${story._id}`}>
              <h2 className={styles.storyTitle}>{story.title}</h2>
              <p className={styles.storyLevel}>Level: {story.level}</p>
            </Link>
            {isAdmin && (
              <button
                className={styles.deleteStoryButton}
                onClick={() => handleDeleteStory(story._id)}
              >
                Delete Story
              </button>
            )}
          </div>
        ))}
      </div>

      <button className={styles.homeButton} onClick={handleHomeClick}>
        Go to Home
      </button>
    </div>
  );
}
