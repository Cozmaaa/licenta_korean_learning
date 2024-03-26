"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./Login.module.css";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) {
        console.log("NOT OK");
        throw new Error(
          data.message || "An error occurred during registration"
        );
      }
      router.push('/home');
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className={styles.fullPage}>
      <div className={styles.container}>
        <h1 className={styles.title}>Login</h1>
        <form onSubmit={handleSubmit}>
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
            Login
          </button>
        </form>
        <p>
          Don't have an account?{" "}
          <Link href="/register" className={styles.link}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
