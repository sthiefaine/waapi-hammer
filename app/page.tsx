"use server";
import styles from "./page.module.css";
import { Button } from "@/components/button/button";
import { Intro } from "@/components/intro/intro";
import { Award, Play } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  return (
    <main className={styles.main}>
      <Intro>
        <Link href="/game">
          <Button shake={true} icon={<Play />} text="Jouer" />
        </Link>

        <Link href="/highscores">
          <Button icon={<Award />} text="Scores" />
        </Link>
      </Intro>
    </main>
  );
}
