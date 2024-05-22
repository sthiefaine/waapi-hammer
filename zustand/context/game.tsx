"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { type StoreApi, useStore } from "zustand";

import { type GameStore } from "@/zustand/store/game";

// this any is for testing purposes
export const GameStoreContext = createContext<StoreApi<GameStore> | null | any>(
  null
);

export interface GameStoreProviderProps {
  children: ReactNode;
}

export const GameStoreProvider = ({ children }: GameStoreProviderProps) => {
  const storeRef = useRef<StoreApi<GameStore>>();
  if (!storeRef.current) {
    // storeRef.current = createGameStore();
  }

  return (
    <GameStoreContext.Provider value={storeRef.current}>
      {children}
    </GameStoreContext.Provider>
  );
};

export const useGameStore = <T,>(
  selector: (store: GameStore & any) => T
): T => {
  const gameStoreContext = useContext(GameStoreContext);

  if (!gameStoreContext) {
    throw new Error(`useGameStore must be use within GameStoreProvider`);
  }

  return useStore(gameStoreContext, selector);
};
