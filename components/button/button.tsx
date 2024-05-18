"use client";
import { Play } from "lucide-react";
import styles from "./button.module.css";

type ButtonProps = {
  icon: React.ReactNode;
  text: string;
  onClick?: () => void;
};

export function Button({ icon, text, onClick }: ButtonProps) {
  const handleOnClick = () => {
    if (onClick) {
      onClick();
    }
  };
  return (
    <button className={styles.button} onClick={handleOnClick}>
      <span className={styles.icon}>{icon}</span>{" "}
      <span className={styles.text}>{text}</span>
    </button>
  );
}
