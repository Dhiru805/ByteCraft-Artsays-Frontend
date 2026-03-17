import React, { useEffect } from "react";
import Routes from "./Routes/Routes";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/CustomToast.css";
import CookieConsent from "./CookieConsent/CookieConsent";
import { CookiesProvider } from "react-cookie";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider, useAuth } from './AuthContext';
import ChatIcon from "./Component/chatbot/ChatIcon";
import ScrollToTop from "./Component/ScrollToTop";
import WonBidPopup from "./Component/WonBidPopup/WonBidPopup";
import FeedbackPopup from "./Component/FeedbackPopup/FeedbackPopup";
import { HelmetProvider } from "react-helmet-async";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import { onSessionRevoked } from "./auth/SessionOrchestrator";
import SessionBanner from "./Component/SessionBanner/SessionBanner";

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!isAuthenticated) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    let socket;
    try {
      const decoded = jwtDecode(token);
      const sessionId = decoded.sessionId;

      if (sessionId) {
        socket = io(process.env.REACT_APP_API_URL || "http://localhost:3001");

        socket.on("connect", () => {
          socket.emit("joinSessionRoom", sessionId);
        });

        socket.on("sessionRevoked", (data) => {
          console.warn("[Socket] Session revoked:", data.message);

          // Notify the orchestrator — it handles storage clearing + state transition
          onSessionRevoked();

          toast.error(data.message || "Your session has been revoked. Logging out...", {
            autoClose: 3000,
          });
        });
      }
    } catch (error) {
      console.error("Error setting up session socket:", error);
    }

    return () => {
      if (socket) socket.disconnect();
    };
  }, [isAuthenticated]);

  return (
    <div className="App">
      <SessionBanner />
      <Routes />
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        limit={5}
      />
      <CookieConsent />
      <ChatIcon />
      <WonBidPopup userId={userId} isAuthenticated={isAuthenticated} />
      <FeedbackPopup />
    </div>
  );
};

function App() {
  return (
    <React.StrictMode>
      <HelmetProvider>
        <BrowserRouter>
          <ScrollToTop />
          <AuthProvider>
            <CookiesProvider>
              <AppContent />
            </CookiesProvider>
          </AuthProvider>
        </BrowserRouter>
      </HelmetProvider>
    </React.StrictMode>
  );
}

export default App;
