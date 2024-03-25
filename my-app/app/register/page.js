"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./Register.module.css";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "An error occurred during registration"
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className={styles.fullPage}>
      <div className={styles.container}>
        <h1 className={styles.title}>Register</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username" className={styles.label}>
            Username:
          </label>
          <input
            type="username"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.inputField}
          />
          <label htmlFor="email" className={styles.label}>
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.inputField}
          />

          <label htmlFor="password" className={styles.label}>
            Password:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.inputField}
          />

          <button type="submit" className={styles.submitButton}>
            Register
          </button>
        </form>
        <p>
          Already have an account?{" "}
          <Link href="/login" className={styles.link}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
