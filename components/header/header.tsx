"use client";
import Link from "next/link";
import styles from "./header.module.css";
import Image from "next/image";
import { GameStateEnum, useGameStore } from "@/zustand/store/game";
import { usePathname } from "next/navigation";
import { Timer } from "lucide-react";

export function Header() {
  const { score, timeLeft, gameState, debug } = useGameStore();
  const pathname = usePathname();

  const isHomePage = pathname === "/";
  const displayInformations = !isHomePage;
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
              <Timer />
            </span>
            <span className={styles.text}>: {timeLeft}</span>
          </span>
          <span id="score" className={styles.information}>
            {score}
          </span>
        </div>
      )}
    </header>
  );
}
