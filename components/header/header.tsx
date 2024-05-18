"use client";
import Link from "next/link";
import styles from "./header.module.css";
import Image from "next/image";
import { GameStateEnum, useGameStore } from "@/zustand/store/game";
import { usePathname } from "next/navigation";

export function Header() {
  const { score, currentPlayTime, gameState } = useGameStore();
  const pathname = usePathname();

  const isHomePage = gameState === GameStateEnum.END && pathname === "/";
  const displayInformations = gameState !== GameStateEnum.INIT || isHomePage;
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
        {gameState}
      </span>

      {displayInformations && (
        <div className={styles.informations}>
          <span id="timer" className={styles.information}>
            {" "}
            {currentPlayTime}
          </span>
          <span id="score" className={styles.information}>
            {score}
          </span>
        </div>
      )}
    </header>
  );
}
