import {
  GameStateEnum,
  gameConstants,
  useGameStore,
} from "@/zustand/store/game";
import styles from "./popUp.module.css";
import { useEffect, useState } from "react";
import { Button, HighScoresSubmit } from "../button/button";
import { Play, RotateCcw } from "lucide-react";
import { HighScoreForm } from "../form/highScore";
import { playFinishSound, playNewHihScoreSound } from "@/helpers/sounds";
import { useShallow } from "zustand/react/shallow";

export function PopUp() {
  const { gameState, score, isHighScore, highScoreSubmitted, setSoundSrc } =
    useGameStore(
      useShallow((state) => {
        return {
          gameState: state.gameState,
          score: state.score,
          isHighScore: state.isHighScore,
          highScoreSubmitted: state.highScoreSubmitted,
          setSoundSrc: state.setSoundSrc,
        };
      })
    );

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

  useEffect(() => {
    if (
      gameState === GameStateEnum.FINISH &&
      isHighScore &&
      !highScoreSubmitted
    ) {
      setSoundSrc(playNewHihScoreSound);
    } else if (
      gameState === GameStateEnum.FINISH &&
      !isHighScore &&
      !highScoreSubmitted
    ) {
      setSoundSrc(playFinishSound);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHighScore, highScoreSubmitted]);

  const DisplayHighScore = () => {
    const text = ["Nouveau", "Record !"];

    if (isHighScore) {
      return (
        <h1 className={styles.titlehighscore}>
          {text.map((word, index) => (
            <span key={index} className={styles.word} data-word={word}>
              {word.split("").map((letter, index) => (
                <span
                  key={index}
                  className={styles.letter}
                  style={{
                    color: `hsl(calc((360 / 13) * ${index}), 70%, 65%)`,
                    animation: `jump 0.4s calc(${
                      !!(index % 2) ? 0.1 : 0.13
                    } * -1s) infinite`,
                  }}
                >
                  {letter}
                </span>
              ))}
            </span>
          ))}
        </h1>
      );
    }
  };

  return (
    <div className={styles.popUp}>
      {" "}
      <div className={styles.header}>
        {isHighScore && <DisplayHighScore />}
        {!isHighScore && (
          <>
            <h2 className={styles.title}>{text}</h2>
            <p>Score: {score}</p>
          </>
        )}
      </div>
      <div className={styles.body}>
        {gameState === GameStateEnum.FINISH &&
          score >= gameConstants.MINIMUM_SCORE && <HighScoreForm />}
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
            {score >= gameConstants.MINIMUM_SCORE && <HighScoresSubmit />}
          </>
        )}
      </div>
    </div>
  );
}

export default PopUp;
