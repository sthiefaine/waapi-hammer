import React, { useState, useEffect, useRef } from "react";
import styles from "../board/board.module.css";
import gsap from "gsap";
import { GameStateEnum, gameConstants } from "@/zustand/store/game";
import Image from "next/image";

import { randomIntFromInterval } from "@/helpers/numbers";
import { useGameStore } from "@/zustand/store/game";
import { useAudio } from "../../hooks/useAudio";
import {
  playHitBombSound,
  playHitGoldenSound,
  playPunchSound,
} from "@/helpers/sounds";

// EVERYTHING IS AWESOME WITH COLORS !!!!!
const pointColorsArray = [
  "#ffbe0b",
  "#fb5607",
  "#ff006e",
  "#8338ec",
  "#06d6a0",
];

const specialsPoints = {
  golden: gameConstants.GOLDEN_SCORE,
  bomb: -200,
};

const specialsColors = {
  golden: "gold",
  bomb: "red",
};

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
  const { gameState, setSoundSrc } = useGameStore();

  const [whacked, setWhacked] = useState(false);
  const [showPoints, setShowPoints] = useState(false);
  const [pointsDisplay, setPointsDisplay] = useState(points);
  const [pointsPosition, setPointsPosition] = useState("left");
  const [pointsColor, setPointsColor] = useState("black");
  const [appearanceTime, setAppearanceTime] = useState(0);

  const bobRef = useRef<any>(null);
  const pointsRef = useRef(points);
  const buttonRef = useRef(null);

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
    if (
      gameState === GameStateEnum.PAUSED ||
      gameState === GameStateEnum.END ||
      gameState === GameStateEnum.FINISH
    ) {
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

  const calculatePoints = () => {
    const clickTime = Date.now();
    const reactionTime = (clickTime - appearanceTime) / 1000;
    const adjustedPoints =
      reactionTime < 1 ? 100 : points - Math.floor(reactionTime * 15);

    return pointsMin > adjustedPoints ? pointsMin : adjustedPoints;
  };

  const whack = () => {
    if (gameState !== GameStateEnum.PLAYING) return;

    const calculatedPoints = calculatePoints();

    if (imageData.isBomb) {
      setSoundSrc(playHitBombSound);
    } else if (imageData.isGolden) {
      setSoundSrc(playHitGoldenSound);
    } else {
      setSoundSrc(playPunchSound);
    }

    // Set points display and color
    if (Boolean(imageData?.isBomb)) {
      setPointsColor(specialsColors.bomb);
      setPointsDisplay(specialsPoints.bomb);
    } else if (Boolean(imageData?.isGolden)) {
      setPointsColor(specialsColors.golden);
      setPointsDisplay(specialsPoints.golden);
    } else {
      setPointsColor(
        pointColorsArray[randomIntFromInterval(0, pointColorsArray.length - 1)]
      );
      setPointsDisplay(calculatedPoints);
    }

    setWhacked(true);
    setShowPoints(true);
    setPointsPosition(Math.random() > 0.5 ? "left" : "right");

    onWhack(
      calculatedPoints,
      Boolean(imageData?.isGolden),
      Boolean(imageData?.isBomb)
    );

    setTimeout(() => setShowPoints(false), 900);
  };

  return (
    <div className={styles.moleContainer}>
      {showPoints && (
        <span
          style={{
            color: pointsRef.current > 0 ? pointsColor : "red",
            left: pointsPosition === "left" ? "15px" : "95px",
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
        priority={true}
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
