import { useGameStore } from "@/zustand/store/game";
import styles from "./page.module.css";
import { Board } from "@/components/board/board";
export default function Game() {
  return (
    <>
      <h1 className={styles.title}>Completement marteau !</h1>
      <Board />
    </>
  );
}
