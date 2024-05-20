/* eslint-disable react/no-unescaped-entities */
import style from "./intro.module.css";

export function Intro() {
  return (
    <section className={style.section}>
      <h1 className={style.title}>Completement marteau !</h1>
      <p className={style.description}>
        Marque le <strong className={style.strong}>maxium de points</strong> en
        evitant <strong className={style.strong}>les pieges</strong>.
      </p>
      <p className={style.warning}>
        Attention tu ne dois pas reproduire cela dans les bureaux
      </p>
    </section>
  );
}
