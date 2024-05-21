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
import { ImageType, bombsList, devPicture, imagesList } from "@/data/images";

type MoleType = {
  speed: number;
  delay: number;
  points: number;
  imageData: ImageType;
};

const generateMoles = (amount: number): MoleType[] => {
  return new Array(amount).fill(true).map(() => ({
    speed: gsap.utils.random(1, 2),
    delay: gsap.utils.random(0.5, 3),
    points: gameConstants.MOLE_SCORE,
    imageData: imagesList[randomIntFromInterval(0, imagesList.length - 1)],
  }));
};
export function Board() {
  const {
    gameState,
    score,
    setScore,
    setTimeLeft,
    timeLeft,
    maxPlayTime,
    setAnimateTime,
  } = useGameStore();

  const [moles, setMoles] = useState(
    generateMoles(gameConstants.NUMBER_OF_MOLES)
  );
  const [holes, setHoles] = useState(
    new Array(gameConstants.NUMBER_OF_HOLES).fill(null)
  );

  const changeMole = (index: number) => {
    // Calcule le temps écoulé en proportion du temps maximum de jeu
    // ex 15 : ( 30s - 15s) / 30s = 0.5
    // ex 5 : ( 30s - 5s) / 30s = 0.833
    const timeElapsed = (maxPlayTime - timeLeft) / maxPlayTime;

    // Multiplie le temps écoulé par un multiplicateur de temps
    // ex 15 : 0.5 * 1.2 = 0.6
    // ex 5 : 0.833 * 1.2 = 1
    // minumum 0.5
    const timeMultiplier =
      timeElapsed * gameConstants.TIME_MULTIPLIER < 0.5
        ? 0.5
        : timeElapsed * gameConstants.TIME_MULTIPLIER;

    const newMole = {
      speed: gsap.utils.random(0.5, 2 - timeMultiplier),
      delay: gsap.utils.random(0.5, 4 - timeMultiplier * 3),
      points: gameConstants.MOLE_SCORE,
      imageData:
        Math.random() < (timeMultiplier >= 0.8 ? 0.4 : timeMultiplier - 0.1)
          ? bombsList[randomIntFromInterval(0, bombsList.length - 1)]
          : Math.random() > 0.985
          ? devPicture[0]
          : imagesList[randomIntFromInterval(0, imagesList.length - 1)],
    };
    setMoles((prevMoles) => {
      const newMoles = [...prevMoles];
      newMoles[index] = newMole;
      return newMoles;
    });
  };

  const onWhack = (
    points: number,
    isGolden: boolean = false,
    isBomb: boolean = false,
    index: number
  ) => {
    if (isBomb) {
      setScore(score - 200);
      setAnimateTime(true);
      setTimeLeft(timeLeft - 1);
    } else {
      if (isGolden) {
        setScore(score + gameConstants.GOLDEN_SCORE);
        setAnimateTime(true);
        setTimeLeft(timeLeft + 2);
        confetti();
      }

      if (!isGolden) {
        setScore(score + points);
      }
    }
    setTimeout(() => changeMole(index), gsap.utils.random(100, 400));
  };

  useEffect(() => {
    if (gameState === GameStateEnum.INIT) {
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
                    imageData={moles[index].imageData}
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
