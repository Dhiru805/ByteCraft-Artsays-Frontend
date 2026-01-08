import React from "react";
import styles from "./whyArtsaysSkele.module.css";

const WhyArtsaysDiffSkeleton = ({ cardCount = 3 }) => {
  const cards = Array.from({ length: cardCount });

  const CardSkeleton = () => (
    <div className={styles.cardWrapper}>
      <div className={styles.iconStack}>
        <div className={styles.iconBg} />
        <div className={styles.iconCircle}>
          <div className={styles.iconInner} />
        </div>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.cardTitle} />

        <div className={styles.cardDesc}>
          <div className={styles.cardDescLine} style={{ width: "92%" }} />
          <div className={styles.cardDescLine} style={{ width: "100%" }} />
          <div className={styles.cardDescLine} style={{ width: "85%" }} />
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.title} />

          <div className={styles.buttonWrap}>
            <div className={styles.button} />
          </div>
        </div>

        <hr className={styles.separator} />

        {/* Description */}
        <div className={styles.description}>
          <div className={styles.descLine} />
          <div className={styles.descLine} style={{ width: "92%" }} />
        </div>

        {/* Cards */}
        <div className={styles.cardGrid}>
          {cards.map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyArtsaysDiffSkeleton;
