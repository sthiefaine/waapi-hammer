"use client";
import { GameStateEnum, useGameStore } from "@/zustand/store/game";
import styles from "./board.module.css";

export function Board() {
  const {
    gameState,
    score,
    setScore,
    setGameState,
    setClearGameStore,
    setCurrentPlayTime,
  } = useGameStore();

  const lv1 = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ];

  const handleOnClick = () => {
    if (gameState !== GameStateEnum.PLAYING) return;
    setScore(score + 1);
  };

  const handlePlayGame = () => {
    setGameState(GameStateEnum.PLAYING);
  };

  const handlePauseGame = () => {
    setGameState(GameStateEnum.PAUSED);
  };

  const handleStartGame = () => {
    setClearGameStore();
    setGameState(GameStateEnum.PLAYING);
    setCurrentPlayTime(30);
  };

  return (
    <section className={styles.section}>
      <div className={styles.gridContainer}>
        {lv1.map((row, i) => (
          <div key={i} className={styles.row}>
            {row.map((cell, j) => {
              if (cell === 0) {
                return <div key={j} className={styles.cell}></div>;
              }

              if (cell === 1) {
                return (
                  <div key={j} className={styles.hole} onClick={handleOnClick}>
                    <span className={styles.mole}></span>
                  </div>
                );
              }
            })}
          </div>
        ))}
      </div>

      <div className={styles.options}>
        {(gameState === GameStateEnum.PAUSED ||
          gameState === GameStateEnum.INIT) && (
          <button onClick={() => handlePlayGame()}>Play</button>
        )}

        {gameState === GameStateEnum.PLAYING && (
          <button onClick={() => handlePauseGame()}>Pause</button>
        )}

        {gameState === GameStateEnum.END && (
          <button onClick={() => handleStartGame()}>Restart</button>
        )}
      </div>
    </section>
  );
}
