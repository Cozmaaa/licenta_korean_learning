//TODO : Make it need cookies

"use client";
import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import styles from "../Hangeul.module.css";
import { getUserByCookie } from "@/utils/getUserByCookie";

export default function HangeulLetterPage({ params }) {
  const [hangeulLetter, setHangeulLetter] = useState(null);
  const id = params.id; // 'id' is now directly available as a prop
  const router = useRouter();

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const response = await fetch(`http://localhost:5000/hangeul/${id}`);
          if (!response.ok) {
            throw new Error(
              `Data fetching failed with status ${response.status}`
            );
          }
          const data = await response.json();
          setHangeulLetter(data);
        } catch (error) {
          console.error("Fetching error:", error);
        }
      };

      fetchData();
    }
  }, [id]); // Run the effect when the 'id' changes

  const goToNextLetter = async () => {
    try {
      // Fetch the next letter's ID from your backend
      const response = await fetch(`http://localhost:5000/hangeul/${id}/next`);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch the next letter: ${response.statusText}`
        );
      }
      const { nextId } = await response.json();

      updateLastHangeulLetter();
      // Navigate to the next letter's page
      router.push(`/hangeul/${nextId}`);
    } catch (error) {
      console.error("Error fetching next letter:", error);
      // Handle error (e.g., show an error message)
    }
  };

  const updateLastHangeulLetter = async () => {
    try {
      const userId = await getUserByCookie();
      const response = await fetch(
        "http://localhost:5000/user/setLastHangeulLetter",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            lastLetter: id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to update last Hangeul letter: ${response.statusText}`
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Hangeul Letter: {hangeulLetter?.letter}</title>
        <meta
          name="description"
          content={`Learn about the Hangeul letter ${hangeulLetter?.letter}`}
        />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>{hangeulLetter?.letter}</h1>
        <p className={styles.description}>{hangeulLetter?.meaning}</p>
        <button onClick={goToNextLetter} className={styles.nextButton}>
          Next Letter
        </button>
      </main>
    </div>
  );
}

// This is where Next.js passes the dynamic route parameter `id` to your page
export async function getServerComponent({ params }) {
  return {
    props: { params },
  };
}
