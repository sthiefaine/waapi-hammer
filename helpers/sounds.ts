export const playSound = (src: string, volume: number = 1) => {
  const audio = new Audio(src);
  // audio.volume = 0.1 => 1;
  audio.volume = volume;
  audio.play();
};

export const playCountdownSound = () => {
  playSound("/sounds/countdown.mp3", 0.1);
};

export const playStartSound = () => {
  playSound("/sounds/start.wav");
};

export const playPunchSound = (points: number) => {
  playPopSound();
};

export const playPopSound = () => {
  playSound("/sounds/pop.mp3");
};

export const playPunchLootSound = () => {
  playSound("/sounds/punchWin.wav");
};
