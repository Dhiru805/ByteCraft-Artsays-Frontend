import React from "react";
import styles from "./howToBySkele.module.css";

const HowToBuySkeleton = ({ cardCount = 3 }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.headerGrid}>
          <div className={styles.headerTitle} />

          <div className={styles.headerButtonWrap}>
            <div className={styles.headerButton} />
          </div>
        </div>

        <hr className={styles.separator} />

        {/* Description */}
        <div className={styles.description}>
          <div className={styles.descLine} />
          <div
            className={styles.descLine}
            style={{ width: "92%" }}
          />
        </div>

        {/* Cards */}
        <section className={styles.cardsSection}>
          <div className={styles.cardsGrid}>
            {Array.from({ length: cardCount }).map((_, idx) => (
              <div key={idx} className={styles.card}>
                <div className={styles.image} />

                <div className={styles.title} />

                <div className={styles.text}>
                  <div className={styles.textLine} />
                  <div
                    className={`${styles.textLine} ${styles.textLineSm}`}
                  />
                </div>

                <div className={styles.icons}>
                  <div className={styles.icon} />
                  <div className={styles.icon} />
                  <div className={styles.icon} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HowToBuySkeleton;
