import React from "react";
import styles from "./homeChallengeSkele.module.css";

const HomeChallengesSkeleton = ({ challengeCount = 2 }) => {
  const challenges = Array.from({ length: challengeCount });

  const ChallengeItemSkeleton = ({ index }) => {
    const isEven = (index + 1) % 2 === 0;

    return (
      <div className={styles.challengeItem}>
        {/* Content */}
        <div
          className={`${styles.content} ${
            isEven ? styles.orderReverse : styles.orderNormal
          }`}
        >
          <div className={styles.daysTag} />

          <div className={styles.titleLineLg} />
          <div className={styles.titleLineSm} />

          <hr className={styles.separator} />

          <div className={styles.textLine} />
          <div className={styles.textLine} style={{ width: "92%" }} />

          <div className={styles.tags}>
            <div className={`${styles.tag} ${styles.tagSm}`} />
            <div className={`${styles.tag} ${styles.tagMd}`} />
            <div className={`${styles.tag} ${styles.tagLg}`} />
          </div>

          <div className={styles.prize}>
            <div className={styles.prizeIcon} />
            <div>
              <div className={styles.prizeTextSm} />
              <div className={styles.prizeTextLg} />
            </div>
          </div>

          <div className={styles.buttons}>
            <div className={styles.btnPrimary} />
            <div className={styles.btnOutline} />
          </div>
        </div>

        {/* Image */}
        <aside
          className={`${styles.imageBox} ${
            isEven ? styles.orderNormal : styles.orderReverse
          }`}
        >
          <div className={styles.imageInner} />
        </aside>
      </div>
    );
  };

  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <div className={styles.headerGrid}>
        <div className={styles.title} />
      </div>

      <hr className={styles.separator} />

      <div className={styles.description}>
        <div className={styles.descLine} />
        <div className={styles.descLine} style={{ width: "92%" }} />
      </div>

      {/* Items */}
      {challenges.map((_, idx) => (
        <ChallengeItemSkeleton key={idx} index={idx} />
      ))}
    </div>
  );
};

export default HomeChallengesSkeleton;
