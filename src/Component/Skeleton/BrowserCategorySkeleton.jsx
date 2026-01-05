import React from "react";
import styles from "./BrowserCategorySkeleton.module.css";

const BrowserCategorySkeleton = () => {
  const categoriesCount = 6;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.headerGrid}>
        <div className={styles.title} />

        <div className={styles.buttonWrap}>
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
          style={{ width: "50%" }}
        />
      </div>

      {/* Categories */}
      <div className={styles.categoryScroll}>
        {Array.from({ length: categoriesCount }).map((_, index) => (
          <div key={index} className={styles.categoryItem}>
            <div className={styles.categoryAccent} />
          </div>
        ))}
      </div>

      {/* Product Grid Skeleton */}
      <div className={styles.productGrid}>
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className={styles.productCard}>
            {/* Image Area */}
            <div className={styles.imageArea}>
              <div className={styles.floatingBadge} />
              <div className={styles.heartButton} />
            </div>

            {/* Content Area */}
            <div className={styles.contentArea}>
              {/* Artist Info */}
              <div className={styles.artistInfo}>
                <div className={styles.artistDot} />
                <div className={styles.artistName} />
              </div>

              {/* Title */}
              <div className={styles.productTitle} />

              {/* Rating */}
              <div className={styles.ratingArea}>
                <div className={styles.ratingBadge} />
                <div className={styles.reviewCount} />
              </div>

              {/* Price Area */}
              <div className={styles.priceArea}>
                <div className={styles.price} />
              </div>

              {/* Action Buttons */}
              <div className={styles.actionButtons}>
                <div className={styles.cartButton} />
                <div className={styles.buyButton} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrowserCategorySkeleton;
