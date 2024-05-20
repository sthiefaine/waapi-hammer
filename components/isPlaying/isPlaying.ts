/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { GameStateEnum, useGameStore } from "@/zustand/store/game";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function IsPlaying() {
  const {
    gameState,
    setGameState,
    setTimeLeft,
    setScore,
    setClearGameStore,
    timeLeft,
    maxPlayTime,
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
          break;
        case GameStateEnum.PLAYING: {
          setScore(0);
          setTimeLeft(maxPlayTime);
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
    if (gameState === GameStateEnum.PLAYING) {
      if (timeLeft < 0) {
        setTimeLeft(0);
      }
      const interval = setInterval(() => {
        if (timeLeft === 1) {
          setGameState(GameStateEnum.END);
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
