/**
 * SessionBanner.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Sits at the very top of the page (fixed, z-99999).
 *
 *  REFRESHING / SOFT_EXPIRED / REAUTH_REQUIRED → gold gradient bar "Reconnecting session…"
 *
 * Sessions are never force-expired from the client side. The orchestrator
 * retries indefinitely until the session recovers. No redirect to login.
 */
import { useState, useEffect } from "react";
import { SESSION_STATE, subscribe, getState } from "../../auth/SessionOrchestrator";
import styles from "./SessionBanner.module.css";

const SessionBanner = () => {
  const [state, setState] = useState(() => getState());

  /* Subscribe to orchestrator */
  useEffect(() => {
    const unsub = subscribe(({ state: s }) => setState(s));
    return unsub;
  }, []);

  /* ── Reconnecting banner (shown while refresh is pending or retrying) ── */
  if (
    state === SESSION_STATE.REFRESHING    ||
    state === SESSION_STATE.SOFT_EXPIRED  ||
    state === SESSION_STATE.REAUTH_REQUIRED
  ) {
    return (
      <div
        role="status"
        aria-live="polite"
        className={`${styles.banner} ${styles.bannerYellow}`}
      >
        <span className={styles.spinner} aria-hidden="true" />

        <span className={styles.message}>
          <span className={styles.messageStrong}>Reconnecting session</span>
          <span className={styles.messageSub}>— please wait while we restore your session</span>
        </span>

        <span className={styles.dots} aria-hidden="true">
          <span>.</span><span>.</span><span>.</span>
        </span>
      </div>
    );
  }

  return null;
};

export default SessionBanner;
