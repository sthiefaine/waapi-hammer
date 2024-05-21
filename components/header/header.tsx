"use client";
import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./header.module.css";
import { GameStateEnum, useGameStore } from "@/zustand/store/game";

import gsap from "gsap";
import { usePathname } from "next/navigation";
import { Timer } from "lucide-react";

export function Header() {
  const { score, timeLeft, gameState, debug, animateTime, setAnimateTime } =
    useGameStore();
  const pathname = usePathname();

  const isHomePage = pathname === "/";
  const displayInformations = !isHomePage;

  const scoreRef = useRef<HTMLSpanElement>(null);
  const prevScoreRef = useRef(score);

  const timeRef = useRef<HTMLSpanElement>(null);
  const prevTimeRef = useRef(timeLeft);
  const timeAnimationRef = useRef<GSAPTimeline | null>(null);

  useEffect(() => {
    animateTime ? setAnimateTime(false) : null;
  }, [animateTime, setAnimateTime]);

  useEffect(() => {
    if (scoreRef.current && prevScoreRef.current !== score) {
      if (gameState === GameStateEnum.PLAYING) {
        const tl = gsap.timeline();
        const increment = score > prevScoreRef.current;

        tl.to(scoreRef.current, {
          scale: 1.4,
          color: increment ? "green" : "red",
          duration: 0.2,
        }).to(scoreRef.current, {
          scale: 1,
          color: "white",
          duration: 0.2,
        });

        prevScoreRef.current = score;
      }
    }
  }, [gameState, score]);

  useEffect(() => {
    if (timeRef.current && prevTimeRef.current !== timeLeft) {
      if (gameState === GameStateEnum.PLAYING) {
        const decrement = timeLeft < prevTimeRef.current;

        if (timeLeft <= 10 || animateTime) {
          // Annuler toute animation de temps en cours
          if (timeAnimationRef.current) {
            timeAnimationRef.current.kill();
          }

          const tl = gsap.timeline();

          timeAnimationRef.current = tl
            .to(timeRef.current, {
              scale: 1.4,
              color: decrement ? "red" : "green",
              duration: 0.2,
            })
            .to(timeRef.current, {
              scale: 1,
              color: decrement ? (animateTime ? "white" : "red") : "white",
              duration: 0.2,
            });

          // Mettre à jour prevTimeRef après l'animation
          tl.eventCallback("onComplete", () => {
            prevTimeRef.current = timeLeft;
            timeAnimationRef.current = null;
          });
        } else {
          prevTimeRef.current = timeLeft;
        }
      }
    }
  }, [timeLeft, gameState, animateTime]);

  useEffect(() => {
    if (gameState === GameStateEnum.RESET || gameState === GameStateEnum.INIT) {
      if (timeRef.current) {
        gsap.to(timeRef.current, {
          color: "white",
          scale: 1,
          duration: 0.2,
        });
        prevTimeRef.current = timeLeft;
      }
      if (scoreRef.current) {
        prevScoreRef.current = score;
      }
    }
  }, [gameState, timeLeft, score]);

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
          <span id="timer" className={styles.information}>
            <span className={styles.icon}>
              <Timer />:
            </span>
            <span ref={timeRef} className={styles.number}>
              {timeLeft}
            </span>{" "}
          </span>
          <span id="score" className={styles.information}>
            <span ref={scoreRef} className={styles.number}>
              {score}
            </span>
          </span>
        </div>
      )}
    </header>
  );
}

export default Header;
