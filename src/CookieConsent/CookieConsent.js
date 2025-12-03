// import React, { useEffect, useState } from "react";
// import { useCookies } from "react-cookie";
// import { useLocation } from "react-router-dom";

// const CookieConsent = () => {
//   const [cookies, setCookie] = useCookies(["userConsent", "pageData"]);
//   const [showPopup, setShowPopup] = useState(false);
//   const location = useLocation();

//   // Helper to set secure only on HTTPS (so it works on localhost)
//   const cookieOptions = {
//     path: "/",
//     maxAge: 36000,
//     secure: typeof window !== "undefined" ? window.location.protocol === "https:" : false,
//     sameSite: "Lax",
//   };

//   // show popup if userConsent not present
//   useEffect(() => {
//     setShowPopup(!cookies.userConsent);
//   }, [cookies.userConsent]);

//   // update pageData when consent exists and location changes
//   useEffect(() => {
//     if (cookies.userConsent) {
//       setCookie(
//         "pageData",
//         { CurrentVisitedPage: location.pathname }, // store as object for convenience
//         cookieOptions
//       );
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [location.pathname, cookies.userConsent]); // only run when pathname or consent changes

//   const acceptCookies = (e) => {
//     // prevent default if by chance inside a form
//     if (e && typeof e.preventDefault === "function") e.preventDefault();

//     setCookie("userConsent", true, cookieOptions);

//     setCookie(
//       "pageData",
//       { CurrentVisitedPage: location.pathname },
//       cookieOptions
//     );

//     setShowPopup(false);
//   };

//   if (!showPopup) return null;

//   return (
//     <div style={popupStyle}>
//       <p style={{ margin: 0 }}>
//         We use cookies to improve your experience.
//       </p>
//       <button type="button" onClick={acceptCookies} style={buttonStyle}>
//         Accept All Cookies
//       </button>
//     </div>
//   );
// };

// const popupStyle = {
//   position: "fixed",
//   bottom: "20px",
//   left: "20px",
//   background: "#333",
//   color: "#fff",
//   padding: "10px 15px",
//   borderRadius: "8px",
//   zIndex: 1000,
//   fontSize: "14px",
//   maxWidth: "250px",
//   boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
// };

// const buttonStyle = {
//   background: "#4CAF50",
//   color: "white",
//   border: "none",
//   padding: "6px 12px",
//   marginTop: "10px",
//   borderRadius: "5px",
//   cursor: "pointer",
//   fontSize: "13px",
// };

// export default CookieConsent;


import React, { useEffect, useState, useMemo, useRef } from "react";
import { useCookies } from "react-cookie";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Safe CookieConsent for Artsays
 * - avoids infinite update loops by:
 *   * initializing state from cookies on mount
 *   * only writing cookies when values actually change
 *   * memoizing cookie options
 *   * guarding side-effects on first mount
 */

const CookieConsent = () => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "userConsent",
    "pageData",
  ]);
  const location = useLocation();

  // initialize states from existing cookie values (run once)
  const [visible, setVisible] = useState(() => {
    // show banner if consent does not exist (undefined/null/falsey)
    return !cookies.userConsent;
  });

  const [showPrefs, setShowPrefs] = useState(false);
  const [analyticsAllowed, setAnalyticsAllowed] = useState(() => !!cookies.userConsent?.analytics);
  const [tradingAllowed, setTradingAllowed] = useState(() => !!cookies.userConsent?.trading);
  const [marketingAllowed, setMarketingAllowed] = useState(() => !!cookies.userConsent?.marketing);

  // stable cookie options (so object identity won't change between renders)
  const cookieOptionsBase = useMemo(() => {
    return {
      path: "/",
      maxAge: 60 * 60 * 24 * 90, // 90 days
      sameSite: "Lax",
      secure: typeof window !== "undefined" ? window.location.protocol === "https:" : false,
    };
  }, []);

  // ref to skip certain effects on first mount
  const isFirstMount = useRef(true);

  // Keep pageData updated only when it actually changes.
  // We compare previous cookie value to avoid writing the same value repeatedly.
  useEffect(() => {
    const newPageData = { CurrentVisitedPage: location.pathname, ts: Date.now() };

    // read existing pageData cookie (it might be an object or JSON string)
    let existing = cookies.pageData;
    if (typeof existing === "string") {
      try {
        existing = JSON.parse(existing);
      } catch (e) {
        existing = existing;
      }
    }

    // Compare CurrentVisitedPage only — avoid comparing ts so we don't rewrite every navigation.
    const existingPath = existing?.CurrentVisitedPage;
    if (existingPath !== newPageData.CurrentVisitedPage && cookies.userConsent) {
      // Only update if userConsent exists and path changed
      setCookie("pageData", { CurrentVisitedPage: newPageData.CurrentVisitedPage }, cookieOptionsBase);
    }
    // note: we deliberately don't set ts in cookie to prevent repeated writes
  }, [location.pathname, cookies.userConsent, cookies.pageData, setCookie, cookieOptionsBase]);

  // Sync local checkbox states if userConsent cookie changes,
  // but avoid doing this on the initial mount (we already initialized from cookie)
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    const consent = cookies.userConsent;
    if (!consent) {
      // if consent removed, show the banner
      setVisible(true);
      // reset local toggles to defaults
      setAnalyticsAllowed(false);
      setTradingAllowed(false);
      setMarketingAllowed(false);
      return;
    }

    // Only update if different to avoid pointless setState
    if (typeof consent.analytics !== "undefined" && consent.analytics !== analyticsAllowed) {
      setAnalyticsAllowed(!!consent.analytics);
    }
    if (typeof consent.trading !== "undefined" && consent.trading !== tradingAllowed) {
      setTradingAllowed(!!consent.trading);
    }

    if (typeof consent.marketing !== "undefined" && consent.marketing !== marketingAllowed) {
      setMarketingAllowed(!!consent.marketing);
    }

    // If consent is present, ensure banner is hidden (in case internal state differs)
    if (consent && visible) {
      setVisible(false);
    }
  }, [cookies.userConsent]); // minimal dependency list

  // Handlers: write the consent cookie only when user intentionally acts
  const acceptAll = () => {
    const value = { functional: true, analytics: true, trading: true, marketing: true };
    setCookie("userConsent", value, cookieOptionsBase);
    // write pageData once (path) — setCookie will emit change; our effects are guarded
    setCookie("pageData", { CurrentVisitedPage: location.pathname }, cookieOptionsBase);
    setAnalyticsAllowed(true);
    setTradingAllowed(true);
    setMarketingAllowed(true);
    setVisible(false);
  };

  const rejectAll = () => {
    const value = { functional: true, analytics: false, trading: false, marketing: false };
    setCookie("userConsent", value, cookieOptionsBase);
    setCookie("pageData", { CurrentVisitedPage: location.pathname }, cookieOptionsBase);
    setAnalyticsAllowed(false);
    setTradingAllowed(false);
    setMarketingAllowed(false);
    setVisible(false);
  };

  const savePreferences = () => {
    const value = { functional: true, analytics: analyticsAllowed, trading: tradingAllowed, marketing: false };
    setCookie("userConsent", value, cookieOptionsBase);
    setCookie("pageData", { CurrentVisitedPage: location.pathname }, cookieOptionsBase);
    setVisible(false);
    setShowPrefs(false);
  };

  if (!visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.35 }}
          className="fixed bottom-6 z-[9999] max-w-3xl w-[92%] md:w-[1440px] justify-self-center"
        >
          <div className="backdrop-blur-3xl backdrop-saturate-200 bg-black/90 border border-white/10 rounded-2xl p-4 shadow-xl">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                <div className="w-12 h-12 rounded-xl bg-[#48372D] shadow-inner">
                  <div className="w-full h-full bg-white/95 rounded-lg flex flex-col items-center justify-center text-sm font-bold text-[#242424]">
                    {/* Alphabet Avatar */}
                    <div
                      className="rounded-xl flex items-center justify-center text-4xl text-white !windhavi"
                      style={{ fontFamily: "Windhavi" }}
                    >
                      A 
                    </div>
                  </div>

                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm md:text-base font-semibold text-dark">Artsays Sses Cookies - Crafted for Creators & Collectors</h3>
                    <p className="text-xs md:text-sm text-dark mt-1">Cookies help power bidding, deliver your Certificate of Authenticity (COA), and personalise the marketplace experience. Manage preferences anytime.</p>
                  </div>

                  <button
                    aria-label="close cookie banner"
                    onClick={() => setVisible(false)}
                    className="p-1 rounded-md text-white/70 hover:text-white"
                    title="Close"
                    type="button"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                <div className="mt-4 flex gap-3 items-center">
                  <button
                    onClick={acceptAll}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#48372D] text-white font-bold shadow hover:scale-[1.01] active:scale-95 transition-transform"
                    type="button"
                  >
                    Accept All
                  </button>

                  <button
                    onClick={() => setShowPrefs(true)}
                    className="inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-dark text-dark text-sm"
                    type="button"
                  >
                    Manage
                  </button>
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] text-dark">
                  <span>Read our <a href="/privacy" className="underline">Privacy Policy</a> and <a href="/coa" className="underline">COA Process</a></span>
                  <button onClick={rejectAll} className="text-dark text-xs underline" type="button">Reject</button>
                </div>

                {/* Preferences panel */}
                <div className={`mt-4 ${showPrefs ? "block" : "hidden"}`}>
                  <div className="mt-2 p-3 rounded-lg bg-white/3 border border-white/6">
                    <h4 className="text-sm font-semibold text-dark">Cookie Preferences - Artsays</h4>
                    <p className="text-xs text-dark mt-1">Select what you allow. Functional cookies are required for COA, bidding, and secure account actions.</p>

                    <div className="mt-3 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-dark">Functional</div>
                          <div className="text-[12px] text-dark">Required for login, COA delivery & bidding functionality</div>
                        </div>
                        <div className="text-sm text-dark">Always On</div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-dark">Analytics</div>
                          <div className="text-[12px] text-dark">Help us improve discovery & recommendations</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={analyticsAllowed}
                            onChange={(e) => setAnalyticsAllowed(e.target.checked)}
                          />
                          <div className="w-11 h-6 bg-dark/10 peer-checked:bg-[#ffffff] rounded-full peer-focus:ring-2 peer-focus:ring-[#ffffff] transition border border-dark"></div>
                          <div className={`absolute left-1 top-1 w-4 h-4 bg-dark rounded-full transition-transform peer-checked:translate-x-5`}></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-dark">Trading & Bidding</div>
                          <div className="text-[12px] text-dark">Essential for auctions, watchlists & trade recommendations</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={tradingAllowed}
                            onChange={(e) => setTradingAllowed(e.target.checked)}
                          />
                          <div className="w-11 h-6 bg-white/10 peer-checked:bg-[#ffffff] rounded-full peer-focus:ring-2 peer-focus:ring-[#ffffff] transition border border-dark"></div>
                          <div className={`absolute left-1 top-1 w-4 h-4 bg-dark rounded-full transition-transform peer-checked:translate-x-5`}></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-dark">Marketing</div>
                          <div className="text-[12px] text-dark">Personalised offers & artist updates</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={marketingAllowed}
                            onChange={(e) => setMarketingAllowed(e.target.checked)} />
                          <div className="w-11 h-6 bg-white/10 peer-checked:bg-[#ffffff] rounded-full peer-focus:ring-2 peer-focus:ring-[#ffffff] transition border border-dark"></div>
                          <div className={`absolute left-1 top-1 w-4 h-4 bg-dark rounded-full transition-transform peer-checked:translate-x-5`}></div>
                        </label>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={savePreferences} className="flex-1 py-2 rounded-lg bg-[#48372D] text-white font-medium" type="button">Save Preferences</button>
                        <button onClick={() => setShowPrefs(false)} className="py-2 px-3 rounded-lg border border-dark text-white/90" type="button">Cancel</button>
                      </div>

                      <div className="mt-3 text-[11px] text-dark">
                        <strong>Note:</strong> Functional cookies power COA issuance and auction integrity. Disabling Trading & Bidding or Functional may limit core Artsays features.
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
