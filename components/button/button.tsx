"use client";
import styles from "./button.module.css";
import { GameStateEnum, useGameStore } from "@/zustand/store/game";

type ButtonProps = {
  icon: React.ReactNode;
  text: string;
  onClick?: () => void;
  gameState?: GameStateEnum;
};

export function Button({ icon, text, onClick, gameState }: ButtonProps) {
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
    <button className={styles.button} onClick={handleOnClick}>
      <span className={styles.icon}>{icon}</span>{" "}
      <span className={styles.text}>{text}</span>
    </button>
  );
}
