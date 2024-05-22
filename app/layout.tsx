import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./variables.css";
import "./globals.css";
import { Header } from "@/components/header/header";
import { IsPlaying } from "@/components/gameHelpers/isPlaying/isPlaying";
import styles from "./page.module.css";
import { AudioGestion } from "@/components/gameHelpers/audioGestion/audioGestion";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Waapi Hammer",
  description: "Completement marteau !",
  authors: {
    name: "thiefaine",
    url: "http://thiefaine.dev",
  },
  keywords: "hammer, waapi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/icons/alien.png" />
      </head>
      <body className={inter.className}>
        <AudioGestion />
        <IsPlaying />

        <Header />
        <main className={styles.main}>{children}</main>
      </body>
    </html>
  );
}
