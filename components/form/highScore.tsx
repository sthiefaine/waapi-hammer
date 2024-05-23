"use client";
import { addHighScore } from "@/app/action/highScores.action";

import { useFormState } from "react-dom";

import styles from "./highScore.module.css";
import { use, useEffect } from "react";
import { useGameStore } from "@/zustand/store/game";
import { useShallow } from "zustand/react/shallow";

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
  } = useGameStore(
    useShallow((state) => {
      return {
        score: state.score,
        setUserName: state.setUserName,
        userName: state.userName,
        setHighScoreSubmitted: state.setHighScoreSubmitted,
        highScoreSubmitted: state.highScoreSubmitted,
      };
    })
  );

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
