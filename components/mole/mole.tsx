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
  imageData: {
    img: string;
    alt: string;
    isBomb?: boolean;
    isGolden?: boolean;
  };
};

const Mole = ({
  changeMole,
  onWhack,
  points,
  delay,
  speed,
  pointsMin = 10,
  imageData,
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
        repeatDelay: delay / 4,
        onStart: () => {
          setAppearanceTime(Date.now());
        },
        onComplete: () => {
          if (gameState === GameStateEnum.PLAYING) {
            changeMole();
          }
        },
      });

      return () => {
        if (bobRef.current) {
          bobRef.current.kill();
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pointsMin, delay, speed, imageData]);

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

    if (imageData.isBomb) {
      playHitBombSound();
    } else {
      playPunchSound();
    }

    const clickTime = Date.now();
    const reactionTime = (clickTime - appearanceTime) / 1000;
    const adjustedPoints =
      reactionTime < 1 ? 100 : points - Math.floor(reactionTime * 20);

    const specialsPoints = {
      golden: gameConstants.GOLDEN_SCORE,
      bomb: -300,
    };

    const specialsColors = {
      golden: "gold",
      bomb: "red",
    };

    // COLOR DISPLAY
    if (Boolean(imageData?.isBomb)) {
      setPointsColor(specialsColors.bomb);
    } else if (Boolean(imageData.isGolden)) {
      setPointsColor(specialsColors.golden);
    } else {
      setPointsColor(
        pointColorsArray[randomIntFromInterval(0, pointColorsArray.length - 1)]
      );
    }

    // POINTS DISPLAY
    if (Boolean(imageData?.isGolden)) {
      setPointsDisplay(specialsPoints.golden);
    } else if (Boolean(imageData?.isBomb)) {
      setPointsDisplay(specialsPoints.bomb);
    } else {
      setPointsDisplay(pointsMin > adjustedPoints ? pointsMin : adjustedPoints);
    }
    setWhacked(true);
    setShowPoints(true);
    setPointsPosition(Math.random() > 0.5 ? "left" : "right");
    setTimeout(() => setShowPoints(false), 700);
    onWhack(
      pointsDisplay,
      Boolean(imageData?.isGolden),
      Boolean(imageData?.isBomb)
    );
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
          {pointsDisplay > 0 ? "+" : null}
          {pointsDisplay}
        </span>
      )}
      <Image
        src={imageData.img}
        alt={imageData.alt}
        width={80}
        height={100}
        className={` ${styles.mole} ${imageData.isBomb ? null : null}`}
        ref={buttonRef}
        onClick={whack}
      />
    </div>
  );
};

export default Mole;
