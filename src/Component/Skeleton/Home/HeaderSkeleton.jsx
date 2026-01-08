import styles from "./headerSkele.module.css";

const HeaderSkeleton = () => {
  return (
    <div className={styles.wrapper}>
      {/* Desktop Header */}
      <header className={styles.desktopHeader}>
        <div className={styles.headerRow}>
          {/* Left Links */}
          <div className={styles.leftSection}>
            <div className={`${styles.skeleton} ${styles.linkSmall}`} />
            <div className={`${styles.skeleton} ${styles.linkMedium}`} />
            <div className={`${styles.skeleton} ${styles.circleSmall}`} />
          </div>

          {/* Logo */}
          <div className={styles.centerSection}>
            <div className={`${styles.skeleton} ${styles.logo}`} />
          </div>

          {/* Right Section */}
          <div className={styles.rightSection}>
            <div className={`${styles.skeleton} ${styles.search}`} />
            <div className={`${styles.skeleton} ${styles.circleSmall}`} />
            <div className={`${styles.skeleton} ${styles.button}`} />
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <nav className={styles.mobileHeader}>
        <div className={`${styles.skeleton} ${styles.mobileLogo}`} />
        <div className={styles.mobileIcons}>
          <div className={`${styles.skeleton} ${styles.circleSmall}`} />
          <div className={`${styles.skeleton} ${styles.circleSmall}`} />
        </div>
      </nav>
    </div>
  );
};

export default HeaderSkeleton;
