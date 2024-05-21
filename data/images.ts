export type ImageType = {
  img: string;
  alt: string;
  isBomb?: boolean;
  isGolden?: boolean;
};

export const bombsList: ImageType[] = [
  { img: "/targets/bomb1.png", alt: "bomb", isBomb: true },
  { img: "/targets/bomb2.png", alt: "bomb", isBomb: true },
];

export const devPicture: ImageType[] = [
  {
    img: "/targets/thief.png",
    alt: "developer picture thief",
    isGolden: true,
  },
];

export const waappiTeam: ImageType[] = [
  { img: "/targets/waal/alex.webp", alt: "alex" },
  { img: "/targets/waal/amandine.webp", alt: "amandine" },
  { img: "/targets/waal/emile.webp", alt: "emile" },
  { img: "/targets/waal/ophelie.webp", alt: "ophelie" },
  { img: "/targets/waal/camila.webp", alt: "camila" },
  { img: "/targets/waal/melisandre.webp", alt: "melisandre" },
  { img: "/targets/waal/guillaume.webp", alt: "guillaume" },
  { img: "/targets/waal/zoe.webp", alt: "zoe" },
  { img: "/targets/waal/fabien.webp", alt: "fabien" },
  { img: "/targets/waal/joanne.webp", alt: "joanne" },
  { img: "/targets/waal/blessing.webp", alt: "blessing" },
  { img: "/targets/waal/kevin.webp", alt: "kevin" },
  { img: "/targets/waal/raphael.webp", alt: "raphael" },
  { img: "/targets/waal/sasha.webp", alt: "sasha" },
  { img: "/targets/waal/sofia.webp", alt: "sofia" },
  { img: "/targets/waal/toinon.webp", alt: "toinon" },
  { img: "/targets/waal/youri.webp", alt: "youri" },
];

export const imagesList: ImageType[] = [...waappiTeam];
