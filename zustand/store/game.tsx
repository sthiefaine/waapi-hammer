"use client";
import { animate } from "framer-motion";
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
  MINIMUM_SCORE: 1000,
};

export enum GameStateEnum {
  NONE = "NONE",
  INIT = "INIT",
  PLAYING = "PLAYING",
  PAUSED = "PAUSED",
  END = "END",
  FINISH = "FINISH",
  RESET = "RESET",
  GAME_OVER = "GAME_OVER",
}

type AnimateTime = "-" | "+" | "";
type GameState = {
  debug?: boolean;
  gameState: GameStateEnum;
  timeLeft: number;
  maxPlayTime: number;
  score: number;
  animateTime?: AnimateTime;
  highScoreSubmitted?: boolean;
  isHighScore?: boolean;
  soundSrc?: string;
};

type GameDefaultState = {
  userName: string;
  localHighScore: number;
  sound: boolean;
};

export type GameActions = {
  setGameState: (gameState: GameStateEnum) => void;
  setScore: (score: number) => void;
  setTimeLeft: (timeLeft: number) => void;
  setClearGameStore: () => void;
  setMaxPlayTime: (maxPlayTime: number) => void;
  setAnimateTime: (animateTime: AnimateTime) => void;
  setUserName: (userName: string) => void;
  setHighScoreSubmitted: (highScoreSubmitted: boolean) => void;
  setLocalHighScore: (localHighScore: number) => void;
  setIsHighScore: (ishighScore: boolean) => void;
  setSound: (sound: boolean) => void;
  setSoundSrc: (soundSrc: string) => void;
};

export type GameStore = GameState & GameActions & GameDefaultState;

export const defaultInitState: GameState = {
  debug: false,
  gameState: GameStateEnum.INIT,
  timeLeft: 0,
  maxPlayTime: 30,
  score: 0,
  animateTime: "",
  highScoreSubmitted: false,
  isHighScore: false,
  soundSrc: "",
};

export const defaultState: GameDefaultState = {
  userName: "",
  localHighScore: 0,
  sound: true,
};

export const useGameStore = create(
  persist(
    (set, get) => ({
      ...defaultInitState,
      ...defaultState,
      setGameState: (gameState: GameStateEnum) => set({ gameState }),
      setScore: (score: number) => set({ score }),
      setTimeLeft: (timeLeft: number) => set({ timeLeft }),
      setClearGameStore: () => set(defaultInitState),
      setMaxPlayTime: (maxPlayTime: number) => set({ maxPlayTime }),
      setAnimateTime: (animateTime: AnimateTime) => set({ animateTime }),
      setUserName: (userName: string) => set({ userName }),
      setHighScoreSubmitted: (highScoreSubmitted: boolean) =>
        set({ highScoreSubmitted }),
      setLocalHighScore: (localHighScore: number) => set({ localHighScore }),
      setIsHighScore: (isHighScore: boolean) => set({ isHighScore }),
      setSound: (sound: boolean) => set({ sound }),
      setSoundSrc: (soundSrc: string) => set({ soundSrc }),
    }),

    {
      name: "waapi-hammer-game-store",
      partialize: (state: GameStore) => ({
        gameState:
          state.gameState === GameStateEnum.PLAYING
            ? GameStateEnum.PAUSED
            : state.gameState,
        timeLeft: state.timeLeft,
        score: state.score,
        maxPlayTime: state.maxPlayTime,
        userName: state.userName,
        localHighScore: state.localHighScore,
        sound: state.sound,
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
              state?.gameState !== GameStateEnum.END &&
              state?.gameState !== GameStateEnum.FINISH
            ) {
              state.timeLeft = state.maxPlayTime;
            }
            if (state?.gameState === GameStateEnum.FINISH) {
              state.gameState = GameStateEnum.END;
            }
          }
        };
      },
    }
  )
);

// SAME BUT NEED A PROVIDER TO WORK
// Path: zustand/store/game.tsx
// Thats was for testing purposes
/* export const createGameStore = (initState: GameState = defaultInitState) => {
  return createStore<GameStore>()(
    persist(
      (set, get) => ({
        ...defaultInitState,
        ...defaultState,
        setGameState: (gameState: GameStateEnum) => set({ gameState }),
        setScore: (score: number) => set({ score }),
        setTimeLeft: (timeLeft: number) => set({ timeLeft }),
        setClearGameStore: () => set(defaultInitState),
        setMaxPlayTime: (maxPlayTime: number) => set({ maxPlayTime }),
        setAnimateTime: (animateTime: boolean) => set({ animateTime }),
        setUserName: (userName: string) => set({ userName }),
        setHighScoreSubmitted: (highScoreSubmitted: boolean) =>
          set({ highScoreSubmitted }),
        setLocalHighScore: (localHighScore: number) => set({ localHighScore }),
        setIsHighScore: (isHighScore: boolean) => set({ isHighScore }),
        setSound: (sound: boolean) => set({ sound }),
        setSoundSrc: (soundSrc: string) => set({ soundSrc }),
      }),

      {
        name: "waapi-hammer-game-store",
        partialize: (state: GameStore) => ({
          gameState:
            state.gameState === GameStateEnum.PLAYING
              ? GameStateEnum.PAUSED
              : state.gameState,
          timeLeft: state.timeLeft,
          score: state.score,
          maxPlayTime: state.maxPlayTime,
          userName: state.userName,
          localHighScore: state.localHighScore,
          sound: state.sound,
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
                state?.gameState !== GameStateEnum.END &&
                state?.gameState !== GameStateEnum.FINISH
              ) {
                state.timeLeft = state.maxPlayTime;
              }
              if (state?.gameState === GameStateEnum.FINISH) {
                state.gameState = GameStateEnum.END;
              }
              console.log("rehydrated state", state);
            }
          };
        },
      }
    )
  );
}; */
