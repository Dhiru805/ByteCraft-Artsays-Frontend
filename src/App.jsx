import React, { useEffect } from "react";
import Routes from "./Routes/Routes";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CookieConsent from "./CookieConsent/CookieConsent";
import { CookiesProvider } from "react-cookie";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider, useAuth } from './AuthContext';
import ChatIcon from "./Component/chatbot/ChatIcon";
import ScrollToTop from "./Component/ScrollToTop";
import WonBidPopup from "./Component/WonBidPopup/WonBidPopup";
import { HelmetProvider } from "react-helmet-async";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";

const AppContent = () => {
  const { isAuthenticated, logout } = useAuth();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (isAuthenticated) {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const decoded = jwtDecode(token);
        const sessionId = decoded.sessionId;

        if (sessionId) {
          const socket = io(process.env.REACT_APP_API_URL || "http://localhost:3001");

          socket.on("connect", () => {
            socket.emit("joinSessionRoom", sessionId);
          });

          socket.on("sessionRevoked", (data) => {
            console.warn("Session revoked via Socket.IO:", data.message);
            
            // Clear data and state using the safe logout function
            logout(); 

            toast.error(data.message || "Your session has been revoked. Logging out...", {
              autoClose: 3000,
            });
            
            setTimeout(() => {
              window.location.href = "/login";
            }, 1500);
          });

          return () => {
            socket.disconnect();
          };
        }
      } catch (error) {
        console.error("Error setting up session socket:", error);
      }
    }
  }, [isAuthenticated, logout]);

  return (
    <div className="App">
      <Routes />
      <ToastContainer
      //  position="top-right"
      //  autoClose={5000}
      //  hideProgressBar={false}
      //  newestOnTop={false}
      //  closeOnClick
      //  rtl={false}
      //  pauseOnFocusLoss
      //  draggable
      //  pauseOnHover
      />
      <CookieConsent />
      <ChatIcon />
      <WonBidPopup userId={userId} isAuthenticated={isAuthenticated} />
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