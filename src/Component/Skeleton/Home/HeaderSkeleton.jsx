import styles from "./headerSkele.module.css";

const HeaderSkeleton = () => {
  return (
    <div className={styles.wrapper}>

      {/* ── DESKTOP HEADER ── */}
      <header className={styles.desktopHeader}>
        <div className={styles.inner}>

          {/* Left: 5 nav link pills */}
          <div className={styles.left}>
            <div className={`${styles.sk} ${styles.navLink}`} />
            <div className={`${styles.sk} ${styles.navLink}`} />
            <div className={`${styles.sk} ${styles.navLink} ${styles.navLinkWide}`} />
            <div className={`${styles.sk} ${styles.navLink} ${styles.navLinkWide}`} />
            <div className={`${styles.sk} ${styles.navLink}`} />
          </div>

          {/* Center: logo */}
          <div className={styles.center}>
            <div className={`${styles.sk} ${styles.logo}`} />
          </div>

          {/* Right: search pill + icon btn + CTA pill + avatar pill */}
          <div className={styles.right}>
            <div className={`${styles.sk} ${styles.searchPill}`} />
            <div className={`${styles.sk} ${styles.iconBtn}`} />
            <div className={`${styles.sk} ${styles.ctaPill}`} />
            <div className={`${styles.sk} ${styles.avatarPill}`} />
          </div>

        </div>
      </header>

      {/* ── MOBILE TOP BAR ── */}
      <nav className={styles.mobileBar}>
        <div className={`${styles.sk} ${styles.mobileLogo}`} />
        <div className={styles.mobileRight}>
          <div className={`${styles.sk} ${styles.mobileIcon}`} />
          <div className={`${styles.sk} ${styles.mobileAvatar}`} />
        </div>
      </nav>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className={styles.mobileBottom}>
        <div className={`${styles.sk} ${styles.mbnTab}`} />
        <div className={`${styles.sk} ${styles.mbnTab}`} />
        {/* raised centre circle */}
        <div className={styles.mbnCenterWrap}>
          <div className={`${styles.sk} ${styles.mbnCenter}`} />
        </div>
        <div className={`${styles.sk} ${styles.mbnTab}`} />
        <div className={`${styles.sk} ${styles.mbnTab}`} />
      </nav>

    </div>
  );
};

export default HeaderSkeleton;
