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
    speed: gsap.utils.random(0.5, 3),
    delay: gsap.utils.random(0.5, 4),
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
    const timeElapsed = (maxPlayTime - timeLeft) / maxPlayTime;

    const timeMultiplier =
      timeElapsed * gameConstants.TIME_MULTIPLIER > 0.5
        ? 0.5
        : timeElapsed * gameConstants.TIME_MULTIPLIER;

    const newMole = {
      speed: gsap.utils.random(0.5, 2 - timeElapsed),
      delay: gsap.utils.random(
        0.5,
        4.5 - timeElapsed * gameConstants.TIME_MULTIPLIER
      ),
      points: gameConstants.MOLE_SCORE,
      imageData:
        Math.random() < timeMultiplier
          ? bombsList[randomIntFromInterval(0, bombsList.length - 1)]
          : Math.random() > 0.975
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
