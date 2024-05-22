import { GameStateEnum, useGameStore } from "@/zustand/store/game";
import { Button } from "../button/button";
import { CirclePause, CircleStop, Volume2, VolumeX } from "lucide-react";
import styles from "./inGameActionButton.module.css";
import { playClickSound } from "@/helpers/sounds";

export default function InGameActionButton() {
  const { gameState, setSound, sound, setSoundSrc } = useGameStore();

  const handleOnClickSoundButton = () => {
    console.log("sound", sound);
    if (!sound) {
      setSoundSrc(playClickSound);
      return setSound(!sound);
    }
    setSound(!sound);
  };
  return (
    <div className={styles.container}>
      {sound ? (
        <Button icon={<Volume2 />} onClick={() => handleOnClickSoundButton()} />
      ) : (
        <Button icon={<VolumeX />} onClick={() => handleOnClickSoundButton()} />
      )}
      {gameState === GameStateEnum.PLAYING && (
        <>
          <Button
            icon={<CircleStop />}
            text="Arreter"
            gameState={GameStateEnum.END}
          />

          <Button
            icon={<CirclePause />}
            text="Pause"
            gameState={GameStateEnum.PAUSED}
          />
        </>
      )}
    </div>
  );
}
