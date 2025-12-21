import React from "react";
import styles from "./whyfromSkele.module.css";

export default function WhyFromSkeleton() {
  return (
    <div className={styles.root}>
      <div className={styles.container}>
        {/* Heading + Button */}
        <div className={styles.headerGrid}>
          <div className={styles.title} />
          <div className={styles.headerButton} />
        </div>

        <hr className={styles.separator} />

        {/* Description */}
        <div className={styles.description}>
          <div className={`${styles.descLine}`} style={{ width: "83%" }} />
          <div className={`${styles.descLine}`} style={{ width: "67%" }} />
          <div className={`${styles.descLine}`} style={{ width: "50%" }} />
        </div>

        {/* Cards */}
        <div className={styles.cardsGrid}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={styles.card} />
          ))}
        </div>
      </div>
    </div>
  );
}
