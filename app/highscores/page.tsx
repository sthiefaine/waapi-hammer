import { fetchHighScores } from "../action/highScores.action";

import styles from "./page.module.css";

export const dynamic = "force-dynamic";

const getData = async () => {
  const items = await fetchHighScores();
  return items;
};

export default async function Highscores() {
  const itemsList = await getData();

  const cardBackgroundColor = ["#FFD700", "#cdcdcd", "#cc6633"];
  const text = ["Meilleurs", "Scores"];
  // color: hsl(calc((360 / 13) * 0), 70%, 65%);
  // animation: jump 0.35s calc(var(--char-index, 0)* -1s) infinite;
  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.title}>
          {text.map((word, index) => (
            <span key={index} className={styles.word} data-word={word}>
              {word.split("").map((letter, index) => (
                <span
                  key={index}
                  className={styles.letter}
                  style={{
                    color: `hsl(calc((360 / 13) * ${index}), 70%, 65%)`,
                    animation: `jump 0.35s calc(${
                      Math.random() > 0.5 ? 1 : 2
                    } * -1s) infinite`,
                  }}
                >
                  {letter}
                </span>
              ))}
            </span>
          ))}
          {"🏆"}
        </h1>

        <section className={styles.section}>
          {" "}
          {itemsList.length === 0 && (
            <div className={styles.card}>
              <span className={styles.number}>🥁</span>
              <span className={styles.score}>0</span>
              <span className={styles.name}>
                <p>Une partie ?</p>
              </span>
            </div>
          )}
          {itemsList.map((item, index) => {
            const ranktext = () => {
              if (index === 0) {
                return "🥇";
              } else if (index === 1) {
                return "🥈";
              } else if (index === 2) {
                return "🥉";
              } else {
                return index + 1;
              }
            };

            return (
              <div
                key={index}
                className={` ${styles.card} ${
                  index === 0 ? styles.reflect : null
                }`}
                style={{ backgroundColor: cardBackgroundColor[index] }}
              >
                <span className={styles.number}>{ranktext()}</span>
                <span className={styles.score}>{item.score}</span>
                <span className={styles.name}>
                  <p>{item.name}</p>
                </span>
              </div>
            );
          })}
        </section>
      </div>
    </>
  );
}
