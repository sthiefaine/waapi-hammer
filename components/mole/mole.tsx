import React, { useState, useEffect, useRef } from "react";
import styles from "../board/board.module.css";
import gsap from "gsap";
import {
  GameStateEnum,
  gameConstants,
  useGameStore,
} from "@/zustand/store/game";
import Image from "next/image";
import { playHitBombSound, playPunchSound } from "@/helpers/sounds";
import { randomIntFromInterval } from "@/helpers/numbers";

// EVERYTHING IS AWNESOME WITH COLORS !!!!!
const pointColorsArray = [
  "#ffbe0b",
  "#fb5607",
  "#ff006e",
  "#8338ec",
  "#06d6a0",
];

type MoleProps = {
  changeMole: () => void;
  onWhack: (points: number, isGolden: boolean, isBomb: boolean) => void;
  points: number;
  delay: number;
  speed: number;
  pointsMin?: number;
  image: {
    img: string;
    alt: string;
    isBomb: boolean;
  };
};

const Mole = ({
  changeMole,
  onWhack,
  points,
  delay,
  speed,
  pointsMin = 10,
  image,
}: MoleProps) => {
  const { gameState } = useGameStore();
  const [whacked, setWhacked] = useState(false);
  const bobRef = useRef<any>(null);
  const pointsRef = useRef(points);
  const buttonRef = useRef(null);
  const [showPoints, setShowPoints] = useState(false);
  const [pointsDisplay, setPointsDisplay] = useState(0);
  const [pointsPosition, setPointsPosition] = useState("left");
  const [pointsColor, setPointsColor] = useState(pointColorsArray[0]);
  const [appearanceTime, setAppearanceTime] = useState(0);
  useEffect(() => {
    if (buttonRef.current) {
      gsap.set(buttonRef.current, {
        yPercent: 100,
        display: "block",
      });

      bobRef.current = gsap.to(buttonRef.current, {
        yPercent: 0,
        duration: speed,
        yoyo: true,
        repeat: 1,
        delay: delay,
        repeatDelay: delay,
        repeatRefresh: true,
        onStart: () => {
          setAppearanceTime(Date.now());
        },
        onRepeat: () => {
          setTimeout(
            () => {
              changeMole();
            },
            500,
            clearTimeout
          );
        },
      });

      return () => {
        if (bobRef.current) {
          bobRef.current.kill();
        }
      };
    }
  }, [pointsMin, delay, speed, image]);

  useEffect(() => {
    if (gameState === GameStateEnum.PAUSED || gameState === GameStateEnum.END) {
      bobRef.current.pause();
    } else if (!whacked) {
      bobRef.current.resume();
    }

    if (whacked) {
      pointsRef.current = points;
      bobRef.current.pause();
      gsap.to(buttonRef.current, {
        yPercent: 100,
        duration: 0.1,
        onComplete: () => {
          setWhacked(false);
          bobRef.current.kill();
        },
      });
    }
  }, [whacked, gameState, points]);

  const whack = () => {
    if (gameState !== GameStateEnum.PLAYING) return;

    if (image.isBomb) {
      playHitBombSound();
    } else {
      playPunchSound();
    }

    const clickTime = Date.now();
    const reactionTime = (clickTime - appearanceTime) / 1000;
    const adjustedPoints =
      reactionTime < 1 ? 100 : points - Math.floor(reactionTime * 20);

    setWhacked(true);
    setPointsDisplay(adjustedPoints);
    setShowPoints(true);
    setPointsPosition(Math.random() > 0.5 ? "left" : "right");
    setPointsColor(
      pointColorsArray[randomIntFromInterval(0, pointColorsArray.length - 1)]
    );
    setTimeout(() => setShowPoints(false), 1000);
    onWhack(adjustedPoints, false, image.isBomb);
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
        src={image.img}
        alt={image.alt}
        width={80}
        height={100}
        className={styles.mole}
        ref={buttonRef}
        onClick={whack}
      />
    </div>
  );
};

export default Mole;
