// src/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  SESSION_STATE,
  subscribe,
  getState,
  onLoginSuccess,
  onLogout,
  initSession,
} from "./auth/SessionOrchestrator";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [sessionState, setSessionState] = useState(() => getState());

  // Derive isAuthenticated from the state machine.
  // REAUTH_REQUIRED is intentionally included — it means the session refresh
  // is failing but the user has NOT explicitly logged out. Keep them in the
  // app so the orchestrator can keep retrying silently.
  // Only LOGGED_OUT (explicit user action) removes authenticated status.
  const isAuthenticated = sessionState === SESSION_STATE.AUTHENTICATED ||
                          sessionState === SESSION_STATE.REFRESHING    ||
                          sessionState === SESSION_STATE.SOFT_EXPIRED  ||
                          sessionState === SESSION_STATE.REAUTH_REQUIRED;

  // These stay in state so consumers can derive UI from them
  const [userType,  setUserType]  = useState(() => localStorage.getItem("userType") || null);
  const [status,    setStatus]    = useState(() => localStorage.getItem("status")   || null);
  const [userrole,  setUserrole]  = useState(() => localStorage.getItem("userrole") || null);
  const [userId,    setUserId]    = useState(() => localStorage.getItem("userId")   || null);

  // ── Subscribe to SessionOrchestrator state changes ─────────────────────────
  useEffect(() => {
    const unsub = subscribe(({ state }) => {
      setSessionState(state);
    });
    // Boot: restore session from localStorage
    initSession();
    return unsub;
  }, []);

  // ── login ───────────────────────────────────────────────────────────────────
  const login = useCallback((
    token, type, userStatus, username, firstName, lastName,
    uid, role, refreshTokenValue
  ) => {
    localStorage.setItem("token",     token);
    localStorage.setItem("userType",  type);
    localStorage.setItem("status",    userStatus);
    localStorage.setItem("username",  username);
    localStorage.setItem("firstName", firstName);
    localStorage.setItem("lastName",  lastName);
    localStorage.setItem("userId",    uid);
    localStorage.setItem("userrole",  role);
    if (refreshTokenValue) localStorage.setItem("refreshToken", refreshTokenValue);

    setUserType(type);
    setStatus(userStatus);
    setUserrole(role);
    setUserId(uid);

    // Hand control to the orchestrator
    onLoginSuccess(token, refreshTokenValue);
  }, []);

  // ── logout ──────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    setUserType(null);
    setStatus(null);
    setUserrole(null);
    setUserId(null);
    // Orchestrator clears localStorage and transitions state
    onLogout();
  }, []);

  // ── Keep local state in sync when storage changes (multi-tab) ──────────────
  useEffect(() => {
    const onStorage = () => {
      setUserType(localStorage.getItem("userType") || null);
      setStatus(localStorage.getItem("status")     || null);
      setUserrole(localStorage.getItem("userrole") || null);
      setUserId(localStorage.getItem("userId")     || null);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        sessionState,
        userType,
        status,
        userrole,
        userId,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
