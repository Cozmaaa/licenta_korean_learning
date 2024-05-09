"use client";
import React, { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import styles from "./WordStats.module.css";
import { getUserByCookie } from "@/utils/getUserByCookie";
import { useRouter } from "next/navigation";

const WordStats = () => {
  const [wordData, setWordData] = useState([]);
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
    // Fetch word data from the backend
    const fetchWordData = async () => {
      try {
        const response = await fetch("http://localhost:5000/word/getAllWords");
        const data = await response.json();
        setWordData(data);
      } catch (error) {
        console.error("Error fetching word data:", error);
      }
    };

    fetchWordData();
  }, []);

  const filteredWordData = wordData.filter((word) => word.totalGuesses > 1);

  const chartData = {
    labels: filteredWordData.map((word) => word.word),
    datasets: [
      {
        label: "Correct Guesses",
        data: filteredWordData.map((word) => word.correctGuesses),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Total Guesses",
        data: filteredWordData.map((word) => word.totalGuesses),
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

   return (
    <div className={styles.wrapper}>
      <button
        className={styles.homeButton}
        onClick={() => router.push("/home")}
      >
        Back to Home
      </button>
      <div className={styles.container}>
        <h1 className={styles.heading}>Word Stats</h1>
        <div className={styles.chartContainer}>
          <Bar data={chartData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>
    </div>
  );
};

export default WordStats;
