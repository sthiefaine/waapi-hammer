/* eslint-disable react/no-unescaped-entities */
import style from "./intro.module.css";

export function Intro({ children }: { children: React.ReactNode }) {
  return (
    <section className={style.section}>
      <h1 className={style.title}>Complètement marteau !</h1>
      <p className={style.description}>
        Marque le <strong className={style.strong}>maxium de points</strong> en
        évitant <strong className={style.strong}>les bombes 💣</strong>
      </p>
      <div className={style.container}>{children}</div>

      <p className={style.warning}>
        ⚠️ Attention cela peut etre violent pour les personnes sensibles
      </p>
    </section>
  );
}
