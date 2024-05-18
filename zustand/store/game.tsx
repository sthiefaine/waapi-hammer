"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export enum GameStateEnum {
  INIT = "INIT",
  PLAYING = "PLAYING",
  PAUSED = "PAUSED",
  END = "END",
}
type GameState = {
  gameState: GameStateEnum;
  currentPlayTime: number;
  score: number;
};

export type GameActions = {
  setGameState: (gameState: GameStateEnum) => void;
  setScore: (score: number) => void;
  setCurrentPlayTime: (currentPlayTime: number) => void;
  setClearGameStore: () => void;
};

export type GameStore = GameState & GameActions;

export const defaultInitState: GameState = {
  gameState: GameStateEnum.INIT,
  currentPlayTime: 0,
  score: 0,
};

export const useGameStore = create(
  persist(
    (set, get) => ({
      ...defaultInitState,
      setGameState: (gameState: GameStateEnum) => set({ gameState }),
      setScore: (score: number) => set({ score }),
      setCurrentPlayTime: (currentPlayTime: number) => set({ currentPlayTime }),
      setClearGameStore: () => set(defaultInitState),
    }),
    {
      name: "game-store",
      partialize: (state: GameStore) => ({
        gameState:
          state.gameState === GameStateEnum.PLAYING
            ? GameStateEnum.PAUSED
            : state.gameState,
        currentPlayTime: state.currentPlayTime,
        score: state.score,
      }),
      onRehydrateStorage: (state) => {
        return (state, error) => {
          if (error) {
            console.log("an error happened during hydration");
          } else {
            console.log("rehydrated state", state);

            if (state?.gameState === GameStateEnum.PLAYING) {
              state.gameState = GameStateEnum.PAUSED;
            }
            if (
              state?.currentPlayTime === 0 &&
              state?.gameState !== GameStateEnum.END
            ) {
              state.currentPlayTime = 30;
            }
          }
        };
      },
    }
  )
);
