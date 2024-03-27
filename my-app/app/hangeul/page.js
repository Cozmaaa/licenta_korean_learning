import Head from 'next/head';
import styles from './Hangeul.module.css'; // Make sure to create this CSS module

export default function Hangeul() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Hangeul Learning Page</title>
                <meta name="description" content="Learn about Hangeul, the Korean alphabet" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <div className={styles.mainDiv}>
                    {/* Add your photo here. For example, using an img tag */}
                    <img src="/path-to-your-image.jpg" alt="Hangeul Example" className={styles.image} />
                    <p className={styles.description}>
                        Here is some text about Hangeul. You might include history, usage, or interesting facts here.
                    </p>
                </div>
            </main>
        </div>
    );
}
