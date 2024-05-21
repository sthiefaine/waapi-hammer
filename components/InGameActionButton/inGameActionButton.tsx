import { GameStateEnum, useGameStore } from "@/zustand/store/game";
import { Button } from "../button/button";
import { CirclePause, CircleStop, Play, RotateCcw } from "lucide-react";
import styles from "./inGameActionButton.module.css";

export default function InGameActionButton() {
  const { gameState } = useGameStore();
  return (
    <div className={styles.container}>
      {gameState === GameStateEnum.PLAYING && (
        <>
          <Button
            icon={<CircleStop />}
            text="Arreter"
            gameState={GameStateEnum.END}
          />

          <Button
            icon={<CirclePause />}
            text="Pause"
            gameState={GameStateEnum.PAUSED}
          />
        </>
      )}
    </div>
  );
}
