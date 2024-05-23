"use client";
import { CircleArrowUp, Eye } from "lucide-react";
import styles from "./button.module.css";
import { GameStateEnum, useGameStore } from "@/zustand/store/game";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

type ButtonProps = {
  icon: React.ReactNode;
  text?: string;
  onClick?: () => void;
  gameState?: GameStateEnum;
  shake?: boolean;
};

export function Button({
  icon,
  text,
  onClick,
  gameState,
  shake = false,
}: ButtonProps) {
  const { setGameState } = useGameStore();

  const handleOnClick = () => {
    if (onClick) {
      onClick();
    }
    if (gameState) {
      setGameState(gameState);
    }
  };
  return (
    <button
      className={`${text ? styles.button : styles.buttonSmall} ${
        shake ? styles.shake : ""
      }`}
      onClick={handleOnClick}
    >
      <span className={styles.icon}>{icon}</span>{" "}
      {text && <span className={styles.text}>{text}</span>}
    </button>
  );
}

export function HighScoresSubmit() {
  const router = useRouter();
  const { highScoreSubmitted } = useGameStore((state) => state);

  const handleNavigateHighScores = () => {
    router.push("/highscores");
  };

  if (highScoreSubmitted) {
    return (
      <button className={styles.button} onClick={handleNavigateHighScores}>
        {" "}
        <span className={styles.icon}>
          <Eye />
        </span>{" "}
        <span className={styles.text}>Voir le classement</span>
      </button>
    );
  }

  return (
    <button
      className={styles.button}
      type="submit"
      disabled={highScoreSubmitted}
      form="highScore"
    >
      <span className={styles.icon}>
        <CircleArrowUp />
      </span>{" "}
      <span className={styles.text}>Envoyer votre score</span>
    </button>
  );
}
