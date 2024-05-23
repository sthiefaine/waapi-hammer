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
import PopUp from "../popUp/popUp";
import { useShallow } from "zustand/react/shallow";
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
    setGameState,
  } = useGameStore(
    useShallow((state) => {
      return {
        gameState: state.gameState,
        score: state.score,
        setScore: state.setScore,
        setTimeLeft: state.setTimeLeft,
        timeLeft: state.timeLeft,
        maxPlayTime: state.maxPlayTime,
        setAnimateTime: state.setAnimateTime,
        setGameState: state.setGameState,
      };
    })
  );

  const [moles, setMoles] = useState(
    generateMoles(gameConstants.NUMBER_OF_MOLES)
  );
  const [holes, setHoles] = useState(
    new Array(gameConstants.NUMBER_OF_HOLES).fill(true)
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
      delay: gsap.utils.random(0.5, 4 - timeMultiplier * 3.2),
      points: gameConstants.MOLE_SCORE,
      imageData:
        Math.random() < (timeMultiplier >= 0.5 ? 0.3 : timeMultiplier - 0.2)
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
      setAnimateTime("-");
      setTimeLeft(timeLeft - 1);

      if (timeLeft - 1 <= 0) {
        setTimeLeft(0);
        setGameState(GameStateEnum.FINISH);
      }
    } else {
      if (isGolden) {
        setScore(score + gameConstants.GOLDEN_SCORE);

        setTimeLeft(timeLeft + 2);
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

  const displayPopUp =
    gameState === GameStateEnum.GAME_OVER ||
    gameState === GameStateEnum.FINISH ||
    gameState === GameStateEnum.END ||
    gameState === GameStateEnum.PAUSED;

  useEffect(() => {
    if (
      displayPopUp &&
      gameState === GameStateEnum.FINISH &&
      score >= gameConstants.MINIMUM_SCORE
    ) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        {displayPopUp && <PopUp />}
        {gameState === GameStateEnum.INIT && <Countdown />}
      </section>
      <InGameActionButton />
    </>
  );
}
