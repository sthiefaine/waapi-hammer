import React, { useState, useEffect, useRef } from "react";
import styles from "../board/board.module.css";
import gsap from "gsap";
import {
  GameStateEnum,
  gameConstants,
  useGameStore,
} from "@/zustand/store/game";

import Image from "next/image";
import { playPunchSound } from "@/helpers/sounds";
import { randomIntFromInterval } from "@/helpers/numbers";

type MoleProps = {
  onWhack: (points: number, isGolden: boolean) => void;
  points: number;
  delay: number;
  speed: number;
  pointsMin?: number;
};
const pointColorsArray = [
  "#ffbe0b",
  "#fb5607",
  "#ff006e",
  "#8338ec",
  "#06d6a0",
];

const Mole = ({ onWhack, points, delay, speed, pointsMin = 10 }: MoleProps) => {
  const { gameState } = useGameStore();
  const [whacked, setWhacked] = useState(false);
  const bobRef = useRef<any>(null);
  const pointsRef = useRef(points);
  const buttonRef = useRef(null);
  const [showPoints, setShowPoints] = useState(false);
  const [pointsDisplay, setPointsDisplay] = useState(0);
  const [pointsPosition, setPointsPosition] = useState("left");
  const [pointsColor, setPointsColor] = useState(pointColorsArray[0]);
  useEffect(() => {
    gsap.set(buttonRef.current, {
      yPercent: 100,
      display: "block",
    });
    bobRef.current = gsap.to(buttonRef.current, {
      yPercent: 0,
      duration: speed,
      yoyo: true,
      repeat: -1,
      delay: delay,
      repeatDelay: delay,
      onRepeat: () => {
        pointsRef.current = Math.floor(
          Math.max(
            pointsRef.current * gameConstants.POINTS_MULTIPLIER,
            pointsMin
          )
        );
      },
    });
    return () => {
      if (bobRef.current) bobRef.current.kill();
    };
  }, [pointsMin, delay, speed]);

  useEffect(() => {
    if (gameState === GameStateEnum.PAUSED || gameState === GameStateEnum.END) {
      bobRef.current.pause();
    }
    if (whacked) {
      pointsRef.current = points;
      bobRef.current.pause();
      gsap.to(buttonRef.current, {
        yPercent: 100,
        duration: 0.1,
        onComplete: () => {
          gsap.delayedCall(gsap.utils.random(1, 4), () => {
            setWhacked(false);
            bobRef.current
              .restart()
              .timeScale(
                bobRef.current.timeScale() * gameConstants.TIME_MULTIPLIER
              );
          });
        },
      });
    }
  }, [whacked]);

  useEffect(() => {
    if (gameState === GameStateEnum.PAUSED || gameState === GameStateEnum.END) {
      bobRef.current.pause();
    } else {
      bobRef.current.resume();
    }
  }, [gameState]);

  const whack = () => {
    if (gameState !== GameStateEnum.PLAYING) return;
    playPunchSound();
    setWhacked(true);
    setPointsDisplay(pointsRef.current);
    setShowPoints(true);
    setPointsPosition(Math.random() > 0.5 ? "left" : "right");
    setPointsColor(
      pointColorsArray[randomIntFromInterval(0, pointColorsArray.length - 1)]
    );
    setTimeout(() => setShowPoints(false), 1000);
    onWhack(pointsRef.current, false);
  };

  return (
    <div className={styles.moleContainer}>
      {showPoints && (
        <span
          style={{
            color: pointsRef.current > 0 ? pointsColor : "red",
            left: pointsPosition === "left" ? "15px" : "85px",
          }}
          className={styles.pointsDisplay}
        >
          +{pointsDisplay}
        </span>
      )}
      <Image
        src="/targets/thief.png"
        alt="mole"
        width={80}
        height={100}
        className={styles.mole}
        ref={buttonRef}
        onClick={whack}
      ></Image>
    </div>
  );
};

export default Mole;
