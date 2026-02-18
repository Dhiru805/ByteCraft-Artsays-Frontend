import React from "react";
import styles from "./biddingSkeleton.module.css";

const BiddingArenaSkeleton = ({ cardCount = 4 }) => {
  return (
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
        <div className={styles.descLine} />
        <div
          className={styles.descLine}
          style={{ width: "33%" }}
        />
      </div>

      {/* Cards */}
      <div className={styles.cardsGrid}>
        {Array.from({ length: cardCount }).map((_, idx) => (
          <div key={idx} className={styles.card}>
            <div className={styles.badge} />

            <div className={styles.imageWrap}>
              <div className={styles.image} />
              <div className={styles.favIcon} />
            </div>

            <div className={styles.info}>
              <div className={styles.infoLineSm} />
              <div className={styles.infoLineMd} />
              <div className={styles.infoLinePrice} />

              <div className={styles.bidInfo}>
                <div className={styles.bidLine} />
                <div className={`${styles.bidLine} ${styles.bidLineWide}`} />
              </div>
            </div>

            <div className={styles.buttons}>
              <div className={styles.buttonRow}>
                <div className={styles.timeBtn} />
                <div className={styles.bidBtn} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BiddingArenaSkeleton;
