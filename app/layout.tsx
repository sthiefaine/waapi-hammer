import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./variables.css";
import "./globals.css";
import { Header } from "@/components/header/header";
import { IsPlaying } from "@/components/isPlaying/isPlaying";
import styles from "./page.module.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Waapi Hammer",
  description: "Completement marteau !",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <IsPlaying />
        <Header />
        <main className={styles.main}>{children}</main>
      </body>
    </html>
  );
}
