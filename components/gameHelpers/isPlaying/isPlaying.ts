/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useGameStore } from "@/zustand/store/game";
import { GameStateEnum } from "@/zustand/store/game";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useAudio } from "../../../hooks/useAudio";

export function IsPlaying() {
  const {
    gameState,
    setGameState,
    setTimeLeft,
    setScore,
    setClearGameStore,
    timeLeft,
    maxPlayTime,
    setHighScoreSubmitted,
    localHighScore,
    setLocalHighScore,
    setIsHighScore,
    score,
  } = useGameStore();
  const pathName = usePathname();

  useEffect(() => {
    if (pathName === "/game") {
      if (
        gameState === GameStateEnum.END ||
        gameState === GameStateEnum.RESET ||
        gameState === GameStateEnum.NONE
      ) {
        setGameState(GameStateEnum.INIT);
      }
      switch (gameState) {
        case GameStateEnum.INIT:
          setTimeLeft(maxPlayTime);
          setScore(0);
          setHighScoreSubmitted(false);
          setIsHighScore(false);
          break;
        case GameStateEnum.PLAYING: {
          break;
        }
        case GameStateEnum.END:
          setGameState(GameStateEnum.END);
          break;
        case GameStateEnum.RESET: {
          setClearGameStore();
          setGameState(GameStateEnum.INIT);
          setTimeLeft(maxPlayTime);
          break;
        }
        case GameStateEnum.PAUSED: {
          setGameState(GameStateEnum.PAUSED);
          break;
        }
        default:
          break;
      }
    } else {
      setGameState(GameStateEnum.NONE);
    }
  }, [pathName, setGameState, gameState]);

  useEffect(() => {
    if (score > localHighScore) {
      setLocalHighScore(score);
      setIsHighScore(true);
    }
    if (gameState === GameStateEnum.PLAYING) {
      if (timeLeft < 0) {
        setTimeLeft(0);
      }

      if (timeLeft === 0) {
        setGameState(GameStateEnum.FINISH);
      }
      const interval = setInterval(() => {
        if (timeLeft === 1) {
          setTimeLeft(0);
          clearInterval(interval);
          return;
        }
        setTimeLeft(timeLeft - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [gameState, timeLeft, setTimeLeft]);

  return null;
}
