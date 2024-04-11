"use client";
import Head from "next/head";
import styles from "./Hangeul.module.css"; // Make sure to create this CSS module
import { useRouter } from "next/navigation";
import { description } from "./description";

export default function Hangeul() {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push("http://localhost:3000/hangeul/660362d0df7accac3e119df4");
  };

  return (
    <div className={styles.container}>
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
          {/* Add your photo here. For example, using an img tag */}
          <img
            src="/hangeulPreview.webp"
            alt="Hangeul Example"
            className={styles.image}
          />
          <div>
            <p className={styles.description}>{description}</p>
          </div>

          <button className={styles.nextButton} onClick={handleButtonClick}>
            Go to Hangeul Lesson
          </button>
        </div>
      </main>
    </div>
  );
}
