"use client";
import { GameStateEnum, useGameStore } from "@/zustand/store/game";
import styles from "./board.module.css";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

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

  const [visibleMoles, setVisibleMoles] = useState(
    lv1.map((row) => row.map(() => false))
  );

  useEffect(() => {
    if (gameState === GameStateEnum.PLAYING) {
      const intervals = lv1.flatMap((row, i) =>
        row.map((_, j) => {
          return setInterval(() => {
            setVisibleMoles((prev) => {
              const newVisibleMoles = prev.map((row, rowIndex) =>
                row.map((isVisible: boolean, colIndex: number) =>
                  rowIndex === i && colIndex === j
                    ? Math.random() < 0.5
                    : isVisible
                )
              );
              return newVisibleMoles;
            });
          }, Math.random() * 2000 + 500);
        })
      );

      return () => {
        intervals.forEach(clearInterval);
      };
    }

    if (gameState === GameStateEnum.PAUSED) {
      setVisibleMoles((prev) => prev.map((row) => row.map(() => false)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);

  const handleOnClick = (i: number, j: number) => {
    if (gameState !== GameStateEnum.PLAYING) return;
    setScore(score + 1);
    setVisibleMoles((prev) => {
      const newVisibleMoles = prev.map((row, rowIndex) =>
        row.map((isVisible: boolean, colIndex: number) =>
          rowIndex === i && colIndex === j ? false : isVisible
        )
      );
      return newVisibleMoles;
    });
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
                  <div key={j} className={styles.hole}>
                    {GameStateEnum.PLAYING === gameState &&
                      visibleMoles[i][j] && (
                        <motion.span
                          onClick={() => handleOnClick(i, j)}
                          className={styles.mole}
                          initial={{ scale: 0, y: 50 }}
                          animate={{ scale: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                        ></motion.span>
                      )}
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
