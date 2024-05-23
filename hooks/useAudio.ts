import { useGameStore } from "@/zustand/store/game";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";

export const useAudio = (src: string, volume = 1) => {
  const { sound } = useGameStore(
    useShallow((state) => ({ sound: state.sound }))
  );
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  useEffect(() => {
    if (!sound) return;
    if (!src) return;
    const AUDIO = new Audio(src);
    AUDIO.volume = volume;
    setAudio(AUDIO);
  }, [src, volume, sound]);

  return {
    play: () => audio?.play(),
    pause: () => audio?.pause(),
    stop: () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    },
  };
};
