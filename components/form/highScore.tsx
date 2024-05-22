"use client";
import { addHighScore } from "@/app/action/highScores.action";

import { useFormState } from "react-dom";

import styles from "./highScore.module.css";
import { useEffect } from "react";
import { useGameStore } from "@/zustand/store/game";

const initialState = {
  message: "",
};

export function HighScoreForm() {
  const {
    score,
    setUserName,
    userName,
    setHighScoreSubmitted,
    highScoreSubmitted,
  } = useGameStore();

  const addHighScoreWithValues = addHighScore.bind(null, {
    score,
  });

  // https://fr.react.dev/reference/react-dom/hooks/useFormState
  const [formState, formAction] = useFormState(addHighScoreWithValues, null);

  useEffect(() => {
    if (formState) {
      if (formState?.success) {
        setHighScoreSubmitted(true);
        if (formState?.name) {
          setUserName(formState.name);
        }
      }
    }
  }, [formState]);

  if (highScoreSubmitted) {
    return (
      <div className={styles.form}>
        <p>Votre score à été partagé. 🎉</p>
      </div>
    );
  }

  return (
    <form id="highScore" className={styles.form} action={formAction}>
      <div className={styles.container}>
        <label className={styles.label} htmlFor="name">
          Votre nom:
        </label>
        <input
          className={styles.input}
          id="name"
          type="text"
          name="name"
          placeholder="Name"
          autoComplete="off"
          autoFocus={false}
          defaultValue={userName}
        />
      </div>
      <p className={styles.error}>{formState?.message}</p>

      <input
        className={`${styles.input} ${styles.azerty}`}
        type="text"
        name="azerty"
        placeholder="azerty"
      />
    </form>
  );
}
