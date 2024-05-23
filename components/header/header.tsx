// Dans votre composant React
"use client";
import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./header.module.css";
import { GameStateEnum } from "@/zustand/store/game";
import { Timer } from "lucide-react";
import { useGameStore } from "@/zustand/store/game";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export function Header() {
  const { score, timeLeft, gameState, debug, animateTime, setAnimateTime } =
    useGameStore((state) => state);
  const pathname = usePathname();

  const displayInformations = pathname === "/game";

  const scoreRef = useRef<HTMLSpanElement>(null);
  const prevScoreRef = useRef(score);

  const timeRef = useRef<HTMLSpanElement>(null);
  const prevTimeRef = useRef(timeLeft);

  useEffect(() => {
    if (scoreRef.current && prevScoreRef.current !== score) {
      if (gameState === GameStateEnum.PLAYING) {
        scoreRef.current.classList.remove(styles.scaleUp);
        scoreRef.current.classList.remove(styles.greenText);
        scoreRef.current.classList.remove(styles.redText);

        scoreRef.current.classList.add(styles.scaleUp);

        if (score > prevScoreRef.current) {
          scoreRef.current.classList.add(styles.greenText);
        } else if (score < prevScoreRef.current) {
          scoreRef.current.classList.add(styles.redText);
        }

        setTimeout(() => {
          scoreRef.current?.classList.remove(styles.scaleUp);
          scoreRef.current?.classList.remove(styles.greenText);
          scoreRef.current?.classList.remove(styles.redText);
        }, 250);
      }

      prevScoreRef.current = score;
    }
  }, [gameState, score]);

  useEffect(() => {
    if (timeRef.current && prevTimeRef.current !== timeLeft) {
      if (gameState === GameStateEnum.PLAYING) {
        timeRef.current.classList.remove(styles.scaleUp);
        timeRef.current.classList.remove(styles.greenText);
        timeRef.current.classList.remove(styles.redText);

        const timeDifference = timeLeft - prevTimeRef.current;

        if (timeLeft <= 10) {
          timeRef.current.classList.add(styles.redText);
          timeRef.current.classList.add(styles.scaleUp);
        } else {
          if (timeDifference >= 1 || animateTime === "+") {
            timeRef.current.classList.add(styles.greenText);
            timeRef.current.classList.add(styles.scaleUp);
            setAnimateTime("");
          } else if (timeDifference > -1 || animateTime === "-") {
            timeRef.current.classList.add(styles.redText);
            timeRef.current.classList.add(styles.scaleUp);
            setAnimateTime("");
          } else {
          }
        }

        setTimeout(() => {
          timeRef.current?.classList.remove(styles.scaleUp);
          timeRef.current?.classList.remove(styles.greenText);
          timeRef.current?.classList.remove(styles.redText);
        }, 250);
      }

      prevTimeRef.current = timeLeft;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, gameState]);

  return (
    <header className={styles.header}>
      <Link href="/">
        <Image
          className={styles.logo}
          src="/icons/alien.png"
          alt="alien"
          width={40}
          height={40}
          priority={true}
        />
      </Link>
      <span
        style={{
          width: "200px",
          color: "black",
        }}
      >
        {debug && gameState}
      </span>

      {displayInformations && (
        <div className={styles.informations}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <span id="timer" className={styles.information}>
              <span className={styles.icon}>
                <Timer />:
              </span>
              <span ref={timeRef} className={`${styles.number}`}>
                {timeLeft}
              </span>{" "}
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <span id="score" className={styles.information}>
              <span ref={scoreRef} className={styles.number}>
                {score}
              </span>
            </span>
          </motion.div>
        </div>
      )}
    </header>
  );
}

export default Header;
