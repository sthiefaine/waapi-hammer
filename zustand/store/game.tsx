"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const gameConstants = {
  TIME_LIMIT: 30000,
  MOLE_SCORE: 100,
  POINTS_MULTIPLIER: 0.9,
  TIME_MULTIPLIER: 1.2,
  NUMBER_OF_HOLES: 9,
  NUMBER_OF_MOLES: 9,
  REGULAR_SCORE: 100,
  GOLDEN_SCORE: 1000,
  COUNTDOWN: 3000,
};

export enum GameStateEnum {
  NONE = "NONE",
  INIT = "INIT",
  PLAYING = "PLAYING",
  PAUSED = "PAUSED",
  END = "END",
  RESET = "RESET",
}
type GameState = {
  debug?: boolean;
  gameState: GameStateEnum;
  timeLeft: number;
  maxPlayTime: number;
  score: number;
};

export type GameActions = {
  setGameState: (gameState: GameStateEnum) => void;
  setScore: (score: number) => void;
  setTimeLeft: (timeLeft: number) => void;
  setClearGameStore: () => void;
  setMaxPlayTime: (maxPlayTime: number) => void;
};

export type GameStore = GameState & GameActions;

export const defaultInitState: GameState = {
  debug: false,
  gameState: GameStateEnum.INIT,
  timeLeft: 0,
  maxPlayTime: 30,
  score: 0,
};

export const useGameStore = create(
  persist(
    (set, get) => ({
      ...defaultInitState,
      setGameState: (gameState: GameStateEnum) => set({ gameState }),
      setScore: (score: number) => set({ score }),
      setTimeLeft: (timeLeft: number) => set({ timeLeft }),
      setClearGameStore: () => set(defaultInitState),
      setMaxPlayTime: (maxPlayTime: number) => set({ maxPlayTime }),
    }),
    {
      name: "game-store",
      partialize: (state: GameStore) => ({
        gameState:
          state.gameState === GameStateEnum.PLAYING
            ? GameStateEnum.PAUSED
            : state.gameState,
        timeLeft: state.timeLeft,
        score: state.score,
        maxPlayTime: state.maxPlayTime,
      }),
      onRehydrateStorage: (state) => {
        return (state, error) => {
          if (error) {
            console.log("an error happened during hydration");
          } else {
            if (state?.gameState === GameStateEnum.PLAYING) {
              state.gameState = GameStateEnum.PAUSED;
            }
            if (
              state?.timeLeft === 0 &&
              state?.gameState !== GameStateEnum.END
            ) {
              state.timeLeft = state.maxPlayTime;
            }
          }
        };
      },
    }
  )
);
