import React from "react";
import styles from "./discoverArtist.module.css";

const DiscoverArtistSkeleton = () => {
  return (
    <div className={styles.container}>
      <div className={styles.headerGrid}>
        {/* Title */}
        <div className={styles.title} />

        {/* Search */}
        <div className={styles.searchWrapper}>
          <div className={styles.searchBar}>
            <div className={styles.searchIcon} />
          </div>
        </div>
      </div>

      <hr className={styles.separator} />

      {/* Description */}
      <div className={styles.description}>
        <div className={styles.descLine} />
        <div className={styles.descLine} style={{ width: "83%" }} />
      </div>
    </div>
  );
};

export default DiscoverArtistSkeleton;
