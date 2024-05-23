import { GameStateEnum, useGameStore } from "@/zustand/store/game";
import { Button } from "../button/button";
import { CirclePause, CircleStop, Volume2, VolumeX } from "lucide-react";
import styles from "./inGameActionButton.module.css";
import { playClickSound } from "@/helpers/sounds";
import { motion } from "framer-motion";

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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {sound ? (
          <Button
            icon={<Volume2 />}
            onClick={() => handleOnClickSoundButton()}
          />
        ) : (
          <Button
            icon={<VolumeX />}
            onClick={() => handleOnClickSoundButton()}
          />
        )}
      </motion.div>
      {gameState === GameStateEnum.PLAYING && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Button
              icon={<CircleStop />}
              text="Arreter"
              gameState={GameStateEnum.END}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Button
              icon={<CirclePause />}
              text="Pause"
              gameState={GameStateEnum.PAUSED}
            />
          </motion.div>
        </>
      )}
    </div>
  );
}
