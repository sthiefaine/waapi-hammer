"use server";
import styles from "./page.module.css";
import { Button } from "@/components/button/button";
import { Intro } from "@/components/intro/intro";
import { Award, Play } from "lucide-react";
import { useGameStore } from "@/zustand/store/game";
import Link from "next/link";

export default async function Home() {
  return (
    <main className={styles.main}>
      <Intro />
      <Link href="/game">
        <Button icon={<Play />} text="Jouer" />
      </Link>

      <Link href="/scores">
        <Button icon={<Award />} text="Scores" />
      </Link>
    </main>
  );
}
