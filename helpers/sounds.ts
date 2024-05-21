let userInteracted = false;

// Ajoutez des écouteurs d'événements pour détecter l'interaction utilisateur
document.addEventListener("click", () => (userInteracted = true), {
  once: true,
});
document.addEventListener("keydown", () => (userInteracted = true), {
  once: true,
});

export const playSound = (src: string, volume: number = 1) => {
  if (!userInteracted) {
    return;
  }

  const audio = new Audio(src);
  // volume est un nombre entre 0 et 1
  audio.volume = volume;
  audio.play().catch((error) => {});
};

export const playCountdownSound = () => {
  playSound("/sounds/countdown.mp3", 0.1);
};

export const playStartSound = () => {
  playSound("/sounds/start.wav");
};

export const playPunchSound = (points?: number) => {
  playPopSound();
};

export const playPopSound = () => {
  playSound("/sounds/pop.mp3");
};

export const playHitBombSound = () => {
  playSound("/sounds/popMetal.wav");
};

export const playPunchLootSound = () => {
  playSound("/sounds/punchWin.wav");
};
