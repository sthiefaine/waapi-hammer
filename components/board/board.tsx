"use client";

import {
  GameStateEnum,
  gameConstants,
  useGameStore,
} from "@/zustand/store/game";
import React, { useState } from "react";
import Mole from "../mole/mole";
import styles from "./board.module.css";
import confetti from "canvas-confetti";
import gsap from "gsap";
import InGameActionButton from "../InGameActionButton/inGameActionButton";
import { Countdown } from "../countdown/countdown";

const generateMoles = (amount: number) => {
  return new Array(amount).fill(true).map((i) => ({
    speed: gsap.utils.random(0.5, 1),
    delay: gsap.utils.random(0.5, 4),
    points: gameConstants.MOLE_SCORE,
  }));
};

export function Board() {
  const { gameState, score, setScore } = useGameStore();

  const [moles, setMoles] = useState(
    generateMoles(gameConstants.NUMBER_OF_MOLES)
  );

  const [holes, setHoles] = useState(
    new Array(gameConstants.NUMBER_OF_HOLES).fill(null)
  );

  const onWhack = (points: number, isGolden: boolean) => {
    setScore(score + points);
    if (isGolden) {
      confetti();
    }
  };

  return (
    <>
      <>
        <>
          <section className={styles.section}>
            <div className={styles.gridContainer}>
              {holes.map((_, index) => (
                <div key={index} className={styles.holeContainer}>
                  <div className={styles.hole}>
                    {" "}
                    {gameState !== GameStateEnum.INIT && (
                      <>
                        <Mole
                          key={index}
                          onWhack={onWhack}
                          points={moles[index].points}
                          delay={moles[index].delay}
                          speed={moles[index].speed}
                        />{" "}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {gameState === GameStateEnum.INIT && (
              <>
                {" "}
                <Countdown />
              </>
            )}
          </section>
          <InGameActionButton />
        </>
      </>
    </>
  );
}
