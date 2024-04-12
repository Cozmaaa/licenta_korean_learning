import React from "react";
import styles from "./BoldedWordModal.module.css";

const BoldedWordModal = ({ word, translation, onClose }) => {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal}>
        <h2>{word}</h2>
        <p>{translation}</p>
        <button onClick={onClose} className={styles.button}>Close</button>
      </div>
    </div>
  );
};

export default BoldedWordModal;