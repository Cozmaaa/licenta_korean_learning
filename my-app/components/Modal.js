// components/Modal.js

import React from 'react';
import styles from './Modal.module.css'; // Assuming you have a CSS module for styling

const Modal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <button onClick={onClose} className={styles.closeButton}>&times;</button>
        </div>
        <div className={styles.modalContent}>
          <p>Do you know 한글 (Hangeul)?</p>
        </div>
        <div className={styles.modalActions}>
          <button onClick={onConfirm} className={styles.confirmButton}>Yes</button>
          <button onClick={onClose} className={styles.cancelButton}>No</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
