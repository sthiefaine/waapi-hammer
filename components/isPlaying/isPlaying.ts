/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { GameStateEnum, useGameStore } from "@/zustand/store/game";
import { usePathname } from "next/navigation";
import { use, useEffect } from "react";

export function IsPlaying() {
  const { gameState, setGameState, setCurrentPlayTime, currentPlayTime } =
    useGameStore();
  const pathName = usePathname();

  useEffect(() => {
    if (pathName === "/game") {
    } else {
      setGameState(GameStateEnum.INIT);
    }
  }, [pathName, setGameState, gameState]);

  useEffect(() => {
    if (gameState === GameStateEnum.PLAYING) {
      if (currentPlayTime < 0) {
        setCurrentPlayTime(0);
      }
      const interval = setInterval(() => {
        if (currentPlayTime === 1) {
          setGameState(GameStateEnum.END);
          setCurrentPlayTime(0);
          clearInterval(interval);
          return;
        }
        setCurrentPlayTime(currentPlayTime - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [gameState, currentPlayTime, setCurrentPlayTime]);

  return null;
}
