/**
 * SessionOrchestrator.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for authentication state.
 *
 * Design principle:
 *   - Access tokens expire (per JWT_EXPIRATION) but sessions NEVER expire automatically.
 *   - When an access token expires, it is refreshed silently and the user stays logged in.
 *   - The session ends ONLY when:
 *       a) The user explicitly clicks "Logout" → onLogout()
 *       b) An admin/security event explicitly revokes the session on the backend
 *          (session.status = "revoked") → backend returns 403 REVOKED_SESSION
 *   - All other refresh failures (network errors, server errors, race conditions)
 *     are retried with exponential back-off indefinitely.
 *
 * Session States:
 *   AUTHENTICATED   — user is logged in and access token is valid
 *   REFRESHING      — a token refresh is currently in-flight
 *   SOFT_EXPIRED    — access token expired, refresh pending/retrying
 *   REAUTH_REQUIRED — session was explicitly revoked — user must log in again
 *   LOGGED_OUT      — user voluntarily logged out
 */

import Axios from "axios";
import { jwtDecode } from "jwt-decode";

// ─── Constants ───────────────────────────────────────────────────────────────
export const SESSION_STATE = {
  AUTHENTICATED:   "AUTHENTICATED",
  REFRESHING:      "REFRESHING",
  SOFT_EXPIRED:    "SOFT_EXPIRED",
  REAUTH_REQUIRED: "REAUTH_REQUIRED",
  LOGGED_OUT:      "LOGGED_OUT",
};

export const REFRESH_ERROR_CODE = {
  INVALID_REFRESH:   "INVALID_REFRESH",
  REVOKED_SESSION:   "REVOKED_SESSION",
  SERVER_ERROR:      "SERVER_ERROR",
  NETWORK_ERROR:     "NETWORK_ERROR",
};

const baseURL = process.env.REACT_APP_API_URL || "http://localhost:3001";
const apiBase = baseURL.endsWith("/api") ? baseURL : `${baseURL}/api`;

// Retry settings for transient failures (network, 5xx)
const RETRY_BACKOFF_BASE_MS = 2000;   // start at 2 s
const RETRY_BACKOFF_MAX_MS  = 60000;  // cap at 60 s

// Cross-tab coordination
const REFRESH_LOCK_KEY    = "__auth_refresh_lock";
const REFRESH_LOCK_TTL_MS = 10000;
const REFRESH_COOLDOWN_MS = 5000; // if refreshed within 5 s, return cached token

// ─── Internal State ───────────────────────────────────────────────────────────
let _state              = SESSION_STATE.LOGGED_OUT;
let _refreshPromise     = null;
let _lastRefreshAt      = 0;
let _retryCount         = 0;        // consecutive transient failure count
let _retryTimerId       = null;     // pending retry setTimeout id
let _listeners          = new Set();
let _refreshTimerId     = null;
let _sessionInitialized = false;

// ─── Cross-Tab Lock ───────────────────────────────────────────────────────────
function _acquireRefreshLock() {
  try {
    const existing = JSON.parse(localStorage.getItem(REFRESH_LOCK_KEY) || "null");
    if (existing && Date.now() - existing.ts < REFRESH_LOCK_TTL_MS) return false;
    localStorage.setItem(REFRESH_LOCK_KEY, JSON.stringify({ ts: Date.now() }));
    return true;
  } catch {
    return true;
  }
}

function _releaseRefreshLock() {
  try { localStorage.removeItem(REFRESH_LOCK_KEY); } catch {}
}

// ─── State Machine ────────────────────────────────────────────────────────────
function _setState(newState) {
  if (_state === newState) return;
  const prev = _state;
  _state = newState;
  console.debug(`[Session] ${prev} → ${newState}`);
  _notify({ state: newState, prevState: prev });
}

function _notify(payload) {
  _listeners.forEach((fn) => { try { fn(payload); } catch {} });
}

// ─── Token Helpers ────────────────────────────────────────────────────────────
function _clearStorage() {
  [
    "token", "refreshToken", "userType", "email", "userId",
    "rememberMe", "rememberedEmailOrPhone", "rememberedPassword",
    "status", "userrole", "username", "firstName", "lastName",
  ].forEach((k) => localStorage.removeItem(k));
}

function _scheduleRefresh(token) {
  if (_refreshTimerId) { clearTimeout(_refreshTimerId); _refreshTimerId = null; }
  if (!token) return;
  try {
    const decoded   = jwtDecode(token);
    const expiresIn = decoded.exp - Date.now() / 1000;
    if (expiresIn <= 0) {
      // Already expired — refresh immediately
      doRefresh().catch(() => {});
      return;
    }
    // Refresh 60 s before expiry so the user never sees a gap
    const delay = Math.max((expiresIn - 60) * 1000, 0);
    _refreshTimerId = setTimeout(() => doRefresh().catch(() => {}), delay);
  } catch {
    // Malformed token — try refreshing anyway
    doRefresh().catch(() => {});
  }
}

// ─── Retry Scheduler ─────────────────────────────────────────────────────────
/**
 * Schedule a retry after exponential back-off.
 * This is only used for TRANSIENT failures (network, 5xx).
 * We never give up on transient failures.
 */
function _scheduleRetry() {
  if (_retryTimerId) return; // already scheduled
  const delay = Math.min(RETRY_BACKOFF_BASE_MS * Math.pow(2, _retryCount), RETRY_BACKOFF_MAX_MS);
  _retryCount++;
  console.warn(`[Session] Transient refresh failure. Retrying in ${Math.round(delay / 1000)}s (attempt ${_retryCount})`);
  _retryTimerId = setTimeout(() => {
    _retryTimerId = null;
    doRefresh().catch(() => {});
  }, delay);
}

// ─── Core Refresh Pipeline ────────────────────────────────────────────────────
export async function doRefresh() {
  // 1. In-tab deduplication
  if (_refreshPromise) return _refreshPromise;

  // 2. Cooldown — return cached token if refreshed very recently
  if (Date.now() - _lastRefreshAt < REFRESH_COOLDOWN_MS) {
    const token = localStorage.getItem("token");
    if (token) return Promise.resolve(token);
  }

  // 3. Cross-tab lock — only one tab refreshes at a time
  if (!_acquireRefreshLock()) {
    return new Promise((resolve, reject) => {
      const poll = setInterval(() => {
        const existing = JSON.parse(localStorage.getItem(REFRESH_LOCK_KEY) || "null");
        if (!existing) {
          clearInterval(poll);
          const token = localStorage.getItem("token");
          if (token) resolve(token);
          else reject(new Error("Cross-tab refresh failed"));
        }
      }, 200);
      setTimeout(() => {
        clearInterval(poll);
        _releaseRefreshLock();
        doRefresh().then(resolve).catch(reject);
      }, REFRESH_LOCK_TTL_MS + 500);
    });
  }

  _setState(SESSION_STATE.REFRESHING);

  _refreshPromise = (async () => {
    try {
      const res = await Axios.post(
        `${apiBase}/user/refresh`,
        {},
        { withCredentials: true, headers: { "X-Requested-With": "XMLHttpRequest" } }
      );

      const { accessToken, refreshToken: newRefreshToken } = res.data;
      localStorage.setItem("token", accessToken);
      if (newRefreshToken) localStorage.setItem("refreshToken", newRefreshToken);

      _lastRefreshAt = Date.now();
      _retryCount    = 0;
      if (_retryTimerId) { clearTimeout(_retryTimerId); _retryTimerId = null; }

      _setState(SESSION_STATE.AUTHENTICATED);
      _scheduleRefresh(accessToken);
      return accessToken;

    } catch (err) {
      return _handleRefreshError(err);
    } finally {
      _releaseRefreshLock();
    }
  })();

  return _refreshPromise.finally(() => { _refreshPromise = null; });
}

// ─── Error Handler ────────────────────────────────────────────────────────────
async function _handleRefreshError(err) {
  const status    = err?.response?.status;
  const errorCode = err?.response?.data?.errorCode;
  const isNetwork = !err.response;

  // ── Transient: network error or 5xx server error ──────────────────────────
  // Never give up. Retry with back-off until connectivity/server recovers.
  if (isNetwork || status >= 500) {
    _setState(SESSION_STATE.SOFT_EXPIRED);
    _scheduleRetry();
    throw err; // rethrown so callers can handle gracefully (interceptor will retry too)
  }

  // ── Revoked session: backend explicitly revoked this session ──────────────
  // Show REAUTH_REQUIRED so the user knows they need to log in.
  if (status === 403 && errorCode === REFRESH_ERROR_CODE.REVOKED_SESSION) {
    _clearStorage();
    _setState(SESSION_STATE.REAUTH_REQUIRED);
    throw err;
  }

  // ── Invalid / missing refresh token (401) ────────────────────────────────
  // The refresh cookie is gone, malformed, or the session was deleted from DB.
  // There is nothing to recover — retrying will only get 401 again forever.
  // Go to LOGGED_OUT so the login page is shown.
  //
  // Race-condition guard: if a manual login() completed while this refresh
  // was in-flight, state is already AUTHENTICATED — don't override it.
  if (_state === SESSION_STATE.AUTHENTICATED) {
    throw err;
  }
  _clearStorage();
  _setState(SESSION_STATE.LOGGED_OUT);
  throw err;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** Call immediately after a successful login. */
export function onLoginSuccess(accessToken, refreshToken) {
  if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
  localStorage.setItem("token", accessToken);
  _retryCount         = 0;
  _lastRefreshAt      = 0;
  _sessionInitialized = true;
  if (_retryTimerId) { clearTimeout(_retryTimerId); _retryTimerId = null; }
  _setState(SESSION_STATE.AUTHENTICATED);
  _scheduleRefresh(accessToken);
}

/** Call when the user explicitly clicks "Logout". */
export function onLogout() {
  _retryCount         = 0;
  _lastRefreshAt      = 0;
  _sessionInitialized = false;
  if (_refreshTimerId) { clearTimeout(_refreshTimerId); _refreshTimerId = null; }
  if (_retryTimerId)   { clearTimeout(_retryTimerId);   _retryTimerId   = null; }
  _releaseRefreshLock();
  _clearStorage();
  _setState(SESSION_STATE.LOGGED_OUT);
}

/** Call when a socket/push event notifies that this session was revoked server-side. */
export function onSessionRevoked() {
  _retryCount         = 0;
  _lastRefreshAt      = 0;
  _sessionInitialized = false;
  if (_refreshTimerId) { clearTimeout(_refreshTimerId); _refreshTimerId = null; }
  if (_retryTimerId)   { clearTimeout(_retryTimerId);   _retryTimerId   = null; }
  _releaseRefreshLock();
  _clearStorage();
  _setState(SESSION_STATE.REAUTH_REQUIRED);
}

/** Called by the axios interceptor when a protected API returns 403 Token expired. */
export function onTokenExpired() {
  return doRefresh();
}

/**
 * Restore session on app boot. Safe to call multiple times.
 */
export function initSession() {
  if (_sessionInitialized) return;
  _sessionInitialized = true;

  const token        = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");

  if (!token) {
    if (!refreshToken) {
      // Neither access token nor refresh token in storage — the user is
      // genuinely logged out (either first visit or after a proper logout
      // which calls _clearStorage()).  Do NOT hit the refresh endpoint:
      // that would silently re-authenticate via a lingering HTTP-only
      // cookie the user didn't ask to use.
      _setState(SESSION_STATE.LOGGED_OUT);
      return;
    }

    // Access token is missing but a refresh token is present in storage,
    // meaning a real session was active (e.g. token was cleared mid-session
    // or the tab was closed before the proactive refresh ran).
    // Attempt a silent refresh; if it fails go LOGGED_OUT.
    _setState(SESSION_STATE.SOFT_EXPIRED);
    doRefresh().catch(() => { _setState(SESSION_STATE.LOGGED_OUT); });
    return;
  }
  try {
    const decoded = jwtDecode(token);
    const expired = decoded.exp - Date.now() / 1000 <= 0;
    if (expired) {
      _setState(SESSION_STATE.SOFT_EXPIRED);
      doRefresh().catch(() => { _setState(SESSION_STATE.LOGGED_OUT); });
    } else {
      _setState(SESSION_STATE.AUTHENTICATED);
      _scheduleRefresh(token);
    }
  } catch {
    // Malformed token in storage — try to refresh; if that fails go LOGGED_OUT
    _setState(SESSION_STATE.SOFT_EXPIRED);
    doRefresh().catch(() => { _setState(SESSION_STATE.LOGGED_OUT); });
  }
}

export function subscribe(listener) {
  _listeners.add(listener);
  return () => _listeners.delete(listener);
}

export function getState() {
  return _state;
}
