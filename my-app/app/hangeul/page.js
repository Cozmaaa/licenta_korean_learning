"use client";
import Head from "next/head";
import styles from "./Hangeul.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Hangeul() {
  const [hangeulLetters, setHangeulLetters] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchHangeulLetters = async () => {
      const res = await fetch("http://localhost:5000/hangeul");
      const data = await res.json();
      setHangeulLetters(data);
    };

    fetchHangeulLetters();
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <button
          className={styles.homeButton}
          onClick={() => router.push("/home")}
        >
          Back to Home
        </button>
        <Head>
          <title>Hangeul Learning Page</title>
          <meta
            name="description"
            content="Learn about Hangeul, the Korean alphabet"
          />
          <link rel="webp" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <div className={styles.mainDiv}>
            <img
              src="/hangeulPreview.webp"
              alt="Hangeul Example"
              className={styles.image}
            />

            <div className={styles.letterGrid}>
              {hangeulLetters.map((letter) => (
                <Link key={letter._id} href={`/hangeul/${letter._id}`}>
                  <div className={styles.letterSquare}>{letter.letter}</div>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
