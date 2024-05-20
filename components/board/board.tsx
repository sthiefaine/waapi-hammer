"use client";

import React, { useState, useEffect } from "react";
import {
  GameStateEnum,
  gameConstants,
  useGameStore,
} from "@/zustand/store/game";
import Mole from "../mole/mole";
import styles from "./board.module.css";
import confetti from "canvas-confetti";
import gsap from "gsap";
import InGameActionButton from "../InGameActionButton/inGameActionButton";
import { Countdown } from "../countdown/countdown";
import { randomIntFromInterval } from "@/helpers/numbers";

const bombsList = [
  { img: "/targets/bomb1.png", alt: "bomb", isBomb: true },
  { img: "/targets/bomb2.png", alt: "bomb", isBomb: true },
];

const devPicture = [
  { img: "/targets/thief.png", alt: "developer picture thief", isBomb: false },
];

const imagesList = [...devPicture];

const generateMoles = (amount: number) => {
  return new Array(amount).fill(true).map(() => ({
    speed: gsap.utils.random(0.5, 1),
    delay: gsap.utils.random(0.5, 4),
    points: gameConstants.MOLE_SCORE,
    image:
      Math.random() < 0.2
        ? bombsList[randomIntFromInterval(0, bombsList.length - 1)]
        : imagesList[0],
  }));
};

export function Board() {
  const { gameState, score, setScore, setTimeLeft, timeLeft, maxPlayTime } =
    useGameStore();
  const [moles, setMoles] = useState(
    generateMoles(gameConstants.NUMBER_OF_MOLES)
  );
  const [holes, setHoles] = useState(
    new Array(gameConstants.NUMBER_OF_HOLES).fill(null)
  );

  const changeMole = (index: number) => {
    const timeElapsed = (maxPlayTime - timeLeft) / maxPlayTime;
    const newMole = {
      speed: gsap.utils.random(0.5, 1 - timeElapsed),
      delay: gsap.utils.random(
        0.5,
        4 - timeElapsed * gameConstants.TIME_MULTIPLIER
      ),
      points: gameConstants.MOLE_SCORE,
      image:
        Math.random() < 0.2
          ? bombsList[randomIntFromInterval(0, bombsList.length - 1)]
          : imagesList[0],
    };
    setMoles((prevMoles) => {
      const newMoles = [...prevMoles];
      newMoles[index] = newMole;
      return newMoles;
    });
  };

  const onWhack = (
    points: number,
    isGolden: boolean,
    isBomb: boolean,
    index: number
  ) => {
    if (isBomb) {
      setScore(score - 300);
      setTimeLeft(timeLeft - 1);
    } else {
      setScore(score + points);
      if (isGolden) {
        confetti();
      }
    }
    setTimeout(
      () => changeMole(index),
      gsap.utils.random(200, 700),
      clearTimeout
    );
  };

  useEffect(() => {
    if (gameState === GameStateEnum.PLAYING) {
      setMoles(generateMoles(gameConstants.NUMBER_OF_MOLES));
    }
  }, [gameState]);

  return (
    <>
      <section className={styles.section}>
        <div className={styles.gridContainer}>
          {holes.map((_, index) => (
            <div key={index} className={styles.holeContainer}>
              <div className={styles.hole}>
                {gameState !== GameStateEnum.INIT && (
                  <Mole
                    changeMole={() => changeMole(index)}
                    key={index}
                    onWhack={(points, isGolden, isBomb) =>
                      onWhack(points, isGolden, isBomb, index)
                    }
                    points={moles[index].points}
                    delay={moles[index].delay}
                    speed={moles[index].speed}
                    image={moles[index].image}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
        {gameState === GameStateEnum.INIT && <Countdown />}
      </section>
      <InGameActionButton />
    </>
  );
}
