import React from "react";
import styles from "./howToSellSkele.module.css";

const HowToSellSkeleton = ({ cardCount = 3 }) => {
  const cards = Array.from({ length: cardCount });

  const CardSkeleton = () => (
    <div className={styles.card}>
      <div className={styles.image} />

      <div className={styles.cardTitle} />

      <div className={styles.text}>
        <div className={styles.textLine} />
        <div className={styles.textLine} style={{ width: "92%" }} />
      </div>

      <div className={styles.icons}>
        <div className={styles.icon} />
        <div className={styles.icon} />
        <div className={styles.icon} />
      </div>
    </div>
  );

  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.title} />
        <div className={styles.headerBtnWrap}>
          <div className={styles.headerBtn} />
        </div>
      </div>

      <hr className={styles.separator} />

      {/* Description */}
      <div className={styles.description}>
        <div className={styles.descLine} />
        <div className={styles.descLine} style={{ width: "92%" }} />
      </div>

      {/* Cards */}
      <section className={styles.section}>
        <div className={styles.grid}>
          {cards.map((_, idx) => (
            <CardSkeleton key={idx} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HowToSellSkeleton;
