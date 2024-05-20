import {
  GameStateEnum,
  gameConstants,
  useGameStore,
} from "@/zustand/store/game";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import styles from "./countdown.module.css";
import { playCountdownSound, playStartSound } from "@/helpers/sounds";
import { randomIntFromInterval } from "@/helpers/numbers";

export const Countdown = () => {
  const { setGameState } = useGameStore();
  const [countdown, setCountdown] = useState(gameConstants.COUNTDOWN);

  useEffect(() => {
    if (countdown > 0) {
      playCountdownSound();
      const timeout = setTimeout(() => {
        setCountdown(countdown - 1000);
      }, 1000);
      return () => clearTimeout(timeout);
    } else if (countdown === 0) {
      playStartSound();
      setGameState(GameStateEnum.PLAYING);
    }
  }, [countdown]);

  const getColor = (countdownValue: number) => {
    switch (countdownValue) {
      case 3:
        return "rgb(255, 255, 0)";
      case 2:
        return "rgb(49, 90, 231)";
      case 1:
        return "rgb(68, 178, 232)";
      default:
        return "#ffffff";
    }
  };

  if (countdown === 0) return null;

  return (
    <div className={styles.container}>
      <motion.span
        className={styles.timer}
        key={countdown}
        initial={{
          scale: 0.5,
          rotate: randomIntFromInterval(-20, 20),
          color: getColor(countdown / 1000),
        }}
        animate={{
          scale: 1,
          rotate: randomIntFromInterval(-20, 20),
          color: getColor(countdown / 1000),
        }}
        transition={{ duration: 1 }}
      >
        {countdown / 1000}
      </motion.span>
    </div>
  );
};
