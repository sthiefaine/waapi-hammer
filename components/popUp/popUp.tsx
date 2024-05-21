import { GameStateEnum, useGameStore } from "@/zustand/store/game";
import styles from "./popUp.module.css";
import { use, useEffect, useState } from "react";
import { Button } from "../button/button";
import { Play, RotateCcw } from "lucide-react";

export function PopUp() {
  const { gameState, score } = useGameStore();

  const [text, setText] = useState("");

  useEffect(() => {
    switch (gameState) {
      case "GAME_OVER":
        setText("Perdu");
        break;
      case "FINISH":
        setText("Partie Terminée");
        break;
      case "PAUSED":
        setText("Pause");
        break;
      case "END":
        setText("Fin de Partie");
        break;
      default:
        setText(gameState);
        break;
    }
  }, [gameState]);

  return (
    <div className={styles.popUp}>
      <div className={styles.header}>
        <h2 className={styles.title}>{text}</h2>
        <p>Score: {score}</p>
      </div>
      <div className={styles.body}>
        <div className={styles.text}></div>
      </div>
      <div className={styles.footer}>
        {gameState === GameStateEnum.END && (
          <>
            <Button
              icon={<RotateCcw />}
              text="Rejouer"
              gameState={GameStateEnum.RESET}
            />
          </>
        )}
        {gameState === GameStateEnum.PAUSED && (
          <>
            <Button
              icon={<Play />}
              text="Reprendre"
              gameState={GameStateEnum.PLAYING}
            />
          </>
        )}
        {gameState === GameStateEnum.GAME_OVER && (
          <>
            <Button
              icon={<RotateCcw />}
              text="Rejouer"
              gameState={GameStateEnum.RESET}
            />
          </>
        )}
        {gameState === GameStateEnum.FINISH && (
          <>
            <Button
              icon={<RotateCcw />}
              text="Rejouer"
              gameState={GameStateEnum.RESET}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default PopUp;
