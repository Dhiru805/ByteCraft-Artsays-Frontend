import React from "react";
import styles from "./heroSectionSkeleton.module.css";

const HeroSectionSkeleton = () => {
  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Left */}
          <div className={styles.left}>
            <div className={`${styles.titleLg} ${styles.titleWide}`} />
            <div className={`${styles.titleLg} ${styles.titleMid}`} />
            <div className={`${styles.titleAnimated} ${styles.titleWide}`} />

            <div className={styles.searchWrap}>
              <div className={styles.searchBar}>
                <div className={styles.searchInput} />
                <div className={styles.searchBtn} />
              </div>
            </div>

            <div className={styles.desc}>
              <div className={styles.descLine} />
              <div className={styles.descLine} style={{ width: "83%" }} />
            </div>

            <div className={styles.btnGroup}>
              <div className={styles.btnPrimary} />
              <div className={styles.btnOutline} />
            </div>
          </div>

          {/* Right */}
          <div className={styles.right}>
            <div className={styles.image} />
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className={styles.bottom}>
        <div className={styles.bottomGrid}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={styles.tag}>
              <div className={styles.icon} />
              <div className={styles.tagText} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSectionSkeleton;
