import React, { useState, useEffect, useCallback, useRef } from "react";
import getAPI from "../../api/getAPI";
import postAPI from "../../api/postAPI";
import { toast } from "react-toastify";

// ── Site color tokens ─────────────────────────────────────────────────────────
const C = {
  orange:      "#FB5934",
  orangeHov:   "#e04a28",
  orangeLight: "#fff3ef",
  orangeMid:   "#ffd5c9",
  dark:        "#0A0A30",
  darkMid:     "#1a1a4e",
  brown:       "#6E4E37",
  brownLight:  "#FFCA9F",
  white:       "#FFFFFF",
  offWhite:    "#FAFAF8",
  border:      "#F0EBE6",
  textGray:    "#6E4E37",
  textLight:   "#A89080",
  red:         "#ef4444",
  redLight:    "#fff5f5",
  redBorder:   "#fecaca",
};

// ── Guest fingerprint ─────────────────────────────────────────────────────────
const getGuestId = () => {
  let id = localStorage.getItem("_fbg_id");
  if (!id) {
    id = "guest_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem("_fbg_id", id);
  }
  return id;
};

// ── Star rating ───────────────────────────────────────────────────────────────
const StarRating = ({ value, onChange, hasError }) => {
  const [hovered, setHovered] = useState(0);
  const labels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];
  const active = hovered || value || 0;
  return (
    <div>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "10px 14px",
        borderRadius: 12,
        border: `2px solid ${hasError ? C.red : C.border}`,
        background: hasError ? C.redLight : C.offWhite,
        transition: "all 0.2s",
        width: "fit-content",
      }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(star)}
            style={{
              fontSize: 34,
              cursor: "pointer",
              color: star <= active ? C.orange : "#D9C5B8",
              transition: "color 0.15s, transform 0.1s",
              transform: star <= active ? "scale(1.18)" : "scale(1)",
              display: "inline-block",
              userSelect: "none",
              lineHeight: 1,
            }}
          >★</span>
        ))}
        {value > 0 && (
          <span style={{
            fontSize: 13,
            color: C.orange,
            fontWeight: 700,
            marginLeft: 6,
          }}>
            {labels[value]}
          </span>
        )}
      </div>
    </div>
  );
};

// ── Progress bar ──────────────────────────────────────────────────────────────
const ProgressBar = ({ current, total }) => {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
        <span style={{ fontSize: 12, color: C.textLight, fontWeight: 500 }}>
          Question {current} of {total}
        </span>
        <span style={{ fontSize: 12, color: C.orange, fontWeight: 700 }}>{pct}%</span>
      </div>
      <div style={{ height: 5, borderRadius: 99, background: C.orangeLight, overflow: "hidden" }}>
        <div style={{
          height: "100%",
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${C.dark}, ${C.orange})`,
          borderRadius: 99,
          transition: "width 0.4s ease",
        }} />
      </div>
    </div>
  );
};

// ── Per-field validator ───────────────────────────────────────────────────────
const validateField = (field, value) => {
  const type = field.type;
  const isEmpty =
    value === "" || value === undefined || value === null ||
    (type === "rating" && (value === 0 || value === "0")) ||
    (Array.isArray(value) && value.length === 0);

  if (field.required && isEmpty) {
    return ({
      text:     "Please enter a response",
      textarea: "Please enter a response",
      email:    "Please enter your email",
      number:   "Please enter a number",
      radio:    "Please select an option",
      checkbox: "Please select at least one option",
      select:   "Please choose an option",
      rating:   "Please give a rating",
    })[type] || "This field is required";
  }

  if (isEmpty) return "";

  if (type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim()))
    return "Please enter a valid email address";

  if (type === "number" && (isNaN(Number(value)) || String(value).trim() === ""))
    return "Please enter a valid number";

  if ((type === "text" || type === "textarea") && String(value).trim().length < 2)
    return "Please enter at least 2 characters";

  return "";
};

// ── Main component ────────────────────────────────────────────────────────────
const FeedbackPopup = () => {
  const [form, setForm]               = useState(null);
  const [visible, setVisible]         = useState(false);
  const [answers, setAnswers]         = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting]   = useState(false);
  const [submitted, setSubmitted]     = useState(false);
  const [closing, setClosing]         = useState(false);
  const [step, setStep]               = useState(0);
  const popupRef                      = useRef(null);

  const userId    = localStorage.getItem("userId")    || getGuestId();
  const userName  = localStorage.getItem("name")      || localStorage.getItem("userName") || localStorage.getItem("firstName") || "Guest";
  const userEmail = localStorage.getItem("email")     || "";
  const userType  = (localStorage.getItem("userType") || "guest").toLowerCase();

  const submittedKey = (id) => `_fb_done_${id}`;
  const snoozedKey   = (id) => `_fb_snooze_${id}`;
  const SNOOZE_MS    = 60 * 60 * 1000;

  // ── Fetch active form ──────────────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      try {
        if (["superadmin", "super-admin", "super_admin"].includes(userType)) return;

          const res = await getAPI("/api/feedback-forms-active", {}, false, false);
          const activeForm = res?.data?.data;
          if (!activeForm) return;

          if (localStorage.getItem(submittedKey(activeForm._id))) return;

          const snoozeTs = localStorage.getItem(snoozedKey(activeForm._id));
          if (snoozeTs && Date.now() - Number(snoozeTs) < SNOOZE_MS) return;

          const checkRes = await getAPI(
            `/api/feedback-responses/check?formId=${activeForm._id}&userId=${userId}`,
            {}, false, false
          );
        if (checkRes?.data?.submitted) {
          localStorage.setItem(submittedKey(activeForm._id), "1");
          return;
        }

        setForm(activeForm);
        const initial = {};
        activeForm.fields.forEach((f) => {
          initial[f.fieldId] = f.type === "checkbox" ? [] : f.type === "rating" ? 0 : "";
        });
        setAnswers(initial);

        const t = setTimeout(() => setVisible(true), 2000);
        return () => clearTimeout(t);
      } catch {
        // silently fail
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Lock scroll ────────────────────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = visible ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [visible]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleChange = (fieldId, value) => {
    setAnswers((p) => ({ ...p, [fieldId]: value }));
    setFieldErrors((p) => ({ ...p, [fieldId]: "" }));
  };

  const handleCheckbox = (fieldId, option, checked) => {
    setAnswers((p) => {
      const ex = p[fieldId] || [];
      return { ...p, [fieldId]: checked ? [...ex, option] : ex.filter((v) => v !== option) };
    });
    setFieldErrors((p) => ({ ...p, [fieldId]: "" }));
  };

  const closePopup = useCallback((wasSubmitted = false) => {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      setClosing(false);
      if (wasSubmitted) {
        if (form) localStorage.setItem(submittedKey(form._id), "1");
      } else {
        if (form) localStorage.setItem(snoozedKey(form._id), String(Date.now()));
      }
    }, 320);
  }, [form]);

  const currentField = step > 0 && form ? form.fields[step - 1] : null;
  const totalFields  = form?.fields?.length || 0;
  const isWelcome    = step === 0;
  const isLastField  = step === totalFields;

  const validateCurrentStep = () => {
    if (step === 0) return true;
    const field = form.fields[step - 1];
    const error = validateField(field, answers[field.fieldId]);
    if (error) { setFieldErrors((p) => ({ ...p, [field.fieldId]: error })); return false; }
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    if (step < totalFields) setStep((s) => s + 1);
    else handleSubmit();
  };

  const handleSubmit = async () => {
    const errors = {};
    let firstBadIdx = -1;
    form.fields.forEach((field, idx) => {
      const error = validateField(field, answers[field.fieldId]);
      if (error) { errors[field.fieldId] = error; if (firstBadIdx === -1) firstBadIdx = idx; }
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setStep(firstBadIdx + 1);
      return;
    }

    const builtAnswers = form.fields.map((f) => ({
      fieldId: f.fieldId,
      label:   f.label,
      value:   answers[f.fieldId],
    }));

    setSubmitting(true);
    try {
        await postAPI("/api/feedback-responses", {
          formId: form._id, userId, userEmail, userName, userType, answers: builtAnswers,
        }, {}, false);
      localStorage.setItem(submittedKey(form._id), "1");
      setSubmitted(true);
    } catch {
      toast.error("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Field renderer ────────────────────────────────────────────────────────
  const renderField = (field) => {
    const val      = answers[field.fieldId];
    const error    = fieldErrors[field.fieldId];
    const hasError = !!error;

    const inputBase = {
      width:       "100%",
      padding:     "12px 16px",
      fontSize:    15,
      border:      `2px solid ${hasError ? C.red : C.border}`,
      borderRadius: 12,
      outline:     "none",
      transition:  "border-color 0.2s, background 0.2s",
      fontFamily:  "inherit",
      color:       C.dark,
      background:  hasError ? C.redLight : C.offWhite,
      boxSizing:   "border-box",
    };

    const shakeStyle = hasError ? { animation: "fbShake 0.4s ease" } : {};

    const onFocusStyle  = (e) => { if (!hasError) e.target.style.borderColor = C.orange; };
    const onBlurStyle   = (e) => { if (!hasError) e.target.style.borderColor = C.border; };

    const ErrorMsg = () => error ? (
      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        marginTop: 8, padding: "7px 12px",
        background: "#fef2f2", border: `1px solid ${C.redBorder}`,
        borderRadius: 8, animation: "fbFadeIn 0.2s ease",
      }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
          <circle cx="7" cy="7" r="6.5" fill={C.red} />
          <path d="M7 4v3.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="7" cy="10" r="0.8" fill="#fff" />
        </svg>
        <span style={{ fontSize: 12, color: "#dc2626", fontWeight: 500 }}>{error}</span>
      </div>
    ) : null;

    switch (field.type) {
      case "text":
      case "email":
      case "number":
        return (
          <div>
            <input
              type={field.type}
              placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}…`}
              value={val || ""}
              onChange={(e) => handleChange(field.fieldId, e.target.value)}
              onFocus={onFocusStyle}
              onBlur={onBlurStyle}
              style={{ ...inputBase, ...shakeStyle }}
              autoFocus
            />
            <ErrorMsg />
          </div>
        );

      case "textarea":
        return (
          <div>
            <textarea
              rows={4}
              placeholder={field.placeholder || "Share your thoughts…"}
              value={val || ""}
              onChange={(e) => handleChange(field.fieldId, e.target.value)}
              onFocus={onFocusStyle}
              onBlur={onBlurStyle}
              style={{ ...inputBase, resize: "vertical", ...shakeStyle }}
              autoFocus
            />
            <ErrorMsg />
          </div>
        );

      case "select":
        return (
          <div>
            <select
              value={val || ""}
              onChange={(e) => handleChange(field.fieldId, e.target.value)}
              onFocus={onFocusStyle}
              onBlur={onBlurStyle}
              style={{ ...inputBase, cursor: "pointer", ...shakeStyle }}
            >
              <option value="">— Select an option —</option>
              {field.options.map((o, i) => <option key={i} value={o}>{o}</option>)}
            </select>
            <ErrorMsg />
          </div>
        );

      case "radio":
        return (
          <div style={shakeStyle}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {field.options.map((o, i) => {
                const selected = val === o;
                return (
                  <label
                    key={i}
                    onClick={() => handleChange(field.fieldId, o)}
                    style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "12px 16px", borderRadius: 12, cursor: "pointer",
                      border: `2px solid ${selected ? C.orange : hasError ? C.redBorder : C.border}`,
                      background: selected ? C.orangeLight : hasError ? C.redLight : C.offWhite,
                      fontWeight: selected ? 700 : 400, fontSize: 14,
                      color: selected ? C.dark : C.brown,
                      transition: "all 0.15s", userSelect: "none",
                    }}
                  >
                    <span style={{
                      width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                      border: `2px solid ${selected ? C.orange : "#D9C5B8"}`,
                      background: selected ? C.orange : C.white,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.15s",
                    }}>
                      {selected && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff" }} />}
                    </span>
                    {o}
                  </label>
                );
              })}
            </div>
            <ErrorMsg />
          </div>
        );

      case "checkbox":
        return (
          <div style={shakeStyle}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {field.options.map((o, i) => {
                const checked = (val || []).includes(o);
                return (
                  <label
                    key={i}
                    onClick={() => handleCheckbox(field.fieldId, o, !checked)}
                    style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "12px 16px", borderRadius: 12, cursor: "pointer",
                      border: `2px solid ${checked ? C.orange : hasError ? C.redBorder : C.border}`,
                      background: checked ? C.orangeLight : hasError ? C.redLight : C.offWhite,
                      fontWeight: checked ? 700 : 400, fontSize: 14,
                      color: checked ? C.dark : C.brown,
                      transition: "all 0.15s", userSelect: "none",
                    }}
                  >
                    <span style={{
                      width: 20, height: 20, borderRadius: 5, flexShrink: 0,
                      border: `2px solid ${checked ? C.orange : "#D9C5B8"}`,
                      background: checked ? C.orange : C.white,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.15s",
                    }}>
                      {checked && (
                        <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                          <path d="M1 4L4 7L10 1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    {o}
                  </label>
                );
              })}
            </div>
            <ErrorMsg />
          </div>
        );

      case "rating":
        return (
          <div style={shakeStyle}>
            <StarRating value={val || 0} onChange={(v) => handleChange(field.fieldId, v)} hasError={hasError} />
            <ErrorMsg />
          </div>
        );

      default:
        return null;
    }
  };

  if (!visible || !form) return null;

  // Custom or default success message
  const successMsg = form.successMessage?.trim()
    || "Your feedback has been recorded successfully.\nWe truly appreciate your time and insights!";

  return (
    <>
      {/* ── Backdrop ──────────────────────────────────────────────────────── */}
      <div
        style={{
          position: "fixed", inset: 0, zIndex: 99998,
          background: "rgba(10, 10, 48, 0.72)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          animation: closing ? "fbBackdropOut 0.32s ease forwards" : "fbBackdropIn 0.35s ease",
        }}
        onClick={submitted ? () => closePopup(true) : undefined}
      />

      {/* ── Popup card ────────────────────────────────────────────────────── */}
      <div
        ref={popupRef}
        style={{
          position: "fixed", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 99999,
          width: "calc(100% - 32px)", maxWidth: 500,
          maxHeight: "92vh", overflowY: "auto",
          background: C.white,
          borderRadius: 24,
          boxShadow: `0 32px 80px rgba(10,10,48,0.22), 0 8px 32px rgba(0,0,0,0.12)`,
          padding: 0,
          animation: closing
            ? "fbCardOut 0.32s cubic-bezier(0.4,0,1,1) forwards"
            : "fbCardIn 0.42s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div style={{
          background: `linear-gradient(135deg, ${C.dark} 0%, ${C.darkMid} 55%, #2a1a5e 100%)`,
          borderRadius: "24px 24px 0 0",
          padding: "26px 26px 22px",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Decorative orange accent arc */}
          <div style={{
            position: "absolute", bottom: -30, right: -30,
            width: 120, height: 120, borderRadius: "50%",
            background: `radial-gradient(circle, ${C.orange}44 0%, transparent 70%)`,
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", top: -20, left: "40%",
            width: 180, height: 80,
            background: `radial-gradient(ellipse, ${C.orange}22 0%, transparent 70%)`,
            pointerEvents: "none",
          }} />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
            <div style={{ flex: 1, paddingRight: 12 }}>
              {/* Badge */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                background: `${C.orange}22`,
                border: `1px solid ${C.orange}55`,
                borderRadius: 99, padding: "4px 12px", marginBottom: 10,
              }}>
                <span style={{ fontSize: 13 }}>✦</span>
                <span style={{
                  fontSize: 10, fontWeight: 800, color: C.brownLight,
                  letterSpacing: "0.1em", textTransform: "uppercase",
                }}>Quick Feedback</span>
              </div>
              <h3 style={{
                margin: 0, color: C.white, fontSize: 19, fontWeight: 800,
                lineHeight: 1.3, letterSpacing: "-0.01em",
              }}>{form.title}</h3>
              {form.description && (
                <p style={{
                  margin: "7px 0 0", color: "rgba(255,255,255,0.72)",
                  fontSize: 13, lineHeight: 1.55,
                }}>{form.description}</p>
              )}
            </div>

            {/* Close button */}
            <button
              onClick={() => closePopup(false)}
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1.5px solid rgba(255,255,255,0.2)",
                borderRadius: "50%", width: 34, height: 34,
                cursor: "pointer", color: C.white, fontSize: 20,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, lineHeight: 1, transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = `${C.orange}55`)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
              title="Close"
            >×</button>
          </div>
        </div>

        {/* Orange divider line */}
        <div style={{ height: 3, background: `linear-gradient(90deg, ${C.orange}, ${C.brownLight}, transparent)` }} />

        {/* ── Body ────────────────────────────────────────────────────────── */}
        <div style={{ padding: "24px 26px 28px" }}>

          {/* ── Thank-you screen ────────────────────────────────────────── */}
          {submitted ? (
            <div style={{ textAlign: "center", padding: "12px 0 6px" }}>
              {/* Animated success circle */}
              <div style={{
                width: 82, height: 82, borderRadius: "50%",
                background: `linear-gradient(135deg, ${C.dark}, ${C.orange})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 20px",
                boxShadow: `0 8px 28px ${C.orange}55`,
                animation: "fbBounce 0.6s cubic-bezier(0.36,0.07,0.19,0.97)",
              }}>
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <path d="M8 18L14.5 24.5L28 11" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <h4 style={{
                color: C.dark, fontWeight: 800, fontSize: 22,
                marginBottom: 10, letterSpacing: "-0.01em",
              }}>Thank you! 🎉</h4>

              {/* Admin-configured success message */}
              <p style={{
                color: C.brown, fontSize: 14, lineHeight: 1.7,
                marginBottom: 26, whiteSpace: "pre-line",
              }}>
                {successMsg}
              </p>

              <button
                onClick={() => closePopup(true)}
                style={{
                  background: `linear-gradient(135deg, ${C.dark}, ${C.orange})`,
                  border: "none", borderRadius: 12,
                  padding: "12px 36px", color: C.white,
                  fontWeight: 700, fontSize: 15,
                  cursor: "pointer",
                  boxShadow: `0 4px 18px ${C.orange}44`,
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >Done</button>
            </div>

          ) : isWelcome ? (
            /* ── Welcome screen ──────────────────────────────────────────── */
            <div>
              <div style={{
                background: C.orangeLight,
                borderRadius: 16, padding: "18px 20px",
                marginBottom: 22,
                border: `1px solid ${C.orangeMid}`,
              }}>
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
                    background: `linear-gradient(135deg, ${C.dark}, ${C.orange})`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 20,
                  }}>💬</div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: C.dark, marginBottom: 5 }}>
                      Share your experience
                    </p>
                    <p style={{ margin: 0, color: C.brown, fontSize: 13, lineHeight: 1.6 }}>
                      It takes less than a minute and helps us improve.{" "}
                      <strong style={{ color: C.orange }}>
                        {totalFields} question{totalFields !== 1 ? "s" : ""}
                      </strong>{" "}
                      — short &amp; easy!
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => closePopup(false)}
                  style={{
                    flex: 1, padding: "13px 16px",
                    border: `2px solid ${C.border}`, borderRadius: 12,
                    background: C.white, color: C.textGray,
                    fontWeight: 600, fontSize: 14, cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.orange; e.currentTarget.style.color = C.orange; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textGray; }}
                >Maybe later</button>

                <button
                  onClick={() => setStep(1)}
                  style={{
                    flex: 2, padding: "13px 20px",
                    border: "none", borderRadius: 12,
                    background: `linear-gradient(135deg, ${C.dark}, ${C.orange})`,
                    color: C.white, fontWeight: 700, fontSize: 15,
                    cursor: "pointer",
                    boxShadow: `0 4px 18px ${C.orange}44`,
                    transition: "opacity 0.2s",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  Start Feedback
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>

          ) : (
            /* ── Field step ──────────────────────────────────────────────── */
            <div>
              <ProgressBar current={step} total={totalFields} />

              <div key={step} style={{ animation: "fbStepIn 0.3s cubic-bezier(0.16,1,0.3,1)", marginBottom: 22 }}>
                <label style={{
                  display: "block", fontWeight: 700, fontSize: 16,
                  color: C.dark, marginBottom: 14, lineHeight: 1.4,
                }}>
                  {currentField.label}
                  {currentField.required && (
                    <span style={{ color: C.orange, marginLeft: 4, fontSize: 16 }}>*</span>
                  )}
                </label>
                {renderField(currentField)}
              </div>

              {/* Navigation */}
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <button
                  onClick={() => setStep((s) => s - 1)}
                  disabled={step <= 1}
                  style={{
                    padding: "12px 18px",
                    border: `2px solid ${C.border}`, borderRadius: 12,
                    background: C.white, color: C.textGray,
                    fontWeight: 600, fontSize: 14,
                    cursor: step <= 1 ? "not-allowed" : "pointer",
                    opacity: step <= 1 ? 0.35 : 1,
                    transition: "all 0.15s",
                    display: "flex", alignItems: "center", gap: 6,
                  }}
                  onMouseEnter={(e) => { if (step > 1) { e.currentTarget.style.borderColor = C.orange; e.currentTarget.style.color = C.orange; }}}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textGray; }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M9 2L5 7L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Back
                </button>

                <button
                  onClick={handleNext}
                  disabled={submitting}
                  style={{
                    flex: 1, padding: "13px 20px",
                    border: "none", borderRadius: 12,
                    background: `linear-gradient(135deg, ${C.dark}, ${C.orange})`,
                    color: C.white, fontWeight: 700, fontSize: 15,
                    cursor: submitting ? "not-allowed" : "pointer",
                    boxShadow: `0 4px 16px ${C.orange}38`,
                    transition: "opacity 0.2s",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    opacity: submitting ? 0.7 : 1,
                  }}
                  onMouseEnter={(e) => !submitting && (e.currentTarget.style.opacity = "0.88")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = submitting ? "0.7" : "1")}
                >
                  {submitting ? (
                    <>
                      <svg style={{ animation: "fbSpin 0.8s linear infinite" }} width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.35)" strokeWidth="2.5" />
                        <path d="M8 2a6 6 0 0 1 6 6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
                      </svg>
                      Submitting…
                    </>
                  ) : isLastField ? (
                    <>
                      Submit Feedback
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M2 8L14 8M10 4L14 8L10 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </>
                  ) : (
                    <>
                      Next
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M5 2L9 7L5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </>
                  )}
                </button>
              </div>

              {/* Step dot indicators */}
              <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 18 }}>
                {form.fields.map((_, i) => (
                  <span
                    key={i}
                    onClick={() => i + 1 < step && setStep(i + 1)}
                    style={{
                      width: i + 1 === step ? 20 : 7,
                      height: 7,
                      borderRadius: 99,
                      background: i + 1 === step
                        ? `linear-gradient(90deg, ${C.dark}, ${C.orange})`
                        : i + 1 < step ? C.orangeMid : C.border,
                      transition: "all 0.3s ease",
                      cursor: i + 1 < step ? "pointer" : "default",
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Keyframes ─────────────────────────────────────────────────────── */}
      <style>{`
        @keyframes fbBackdropIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fbBackdropOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes fbCardIn {
          from { opacity: 0; transform: translate(-50%, -46%) scale(0.94); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes fbCardOut {
          from { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          to   { opacity: 0; transform: translate(-50%, -54%) scale(0.93); }
        }
        @keyframes fbStepIn {
          from { opacity: 0; transform: translateX(18px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fbBounce {
          0%   { transform: scale(0.3); opacity: 0; }
          50%  { transform: scale(1.15); opacity: 1; }
          75%  { transform: scale(0.92); }
          100% { transform: scale(1); }
        }
        @keyframes fbSpin  { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fbShake {
          0%, 100% { transform: translateX(0); }
          20%      { transform: translateX(-6px); }
          40%      { transform: translateX(6px); }
          60%      { transform: translateX(-4px); }
          80%      { transform: translateX(4px); }
        }
        @keyframes fbFadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default FeedbackPopup;
