import React from "react";
import styles from "./articonSkele.module.css";

const ArtIconSkeleton = ({ cardCount = 3 }) => {
  const cards = Array.from({ length: cardCount });

  const CardSkeleton = () => (
    <div className={styles.card}>
      {/* Name */}
      <div className={styles.nameWrap}>
        <div className={styles.nameLine} />
      </div>

      {/* Image */}
      <div className={styles.imageWrap}>
        <div className={styles.image} />
      </div>

      {/* Button */}
      <div className={styles.buttonArea}>
        <div className={styles.cardButton} />
      </div>
    </div>
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
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
        <div className={styles.cardGrid}>
          {cards.map((_, idx) => (
            <CardSkeleton key={idx} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArtIconSkeleton;
