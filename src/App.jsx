import React from "react";
import Routes from "./Routes/Routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CookieConsent from "./CookieConsent/CookieConsent";
import { CookiesProvider } from "react-cookie";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider, useAuth } from './AuthContext';
import ChatIcon from "./Component/chatbot/ChatIcon";
import ScrollToTop from "./Component/ScrollToTop";
import WonBidPopup from "./Component/WonBidPopup/WonBidPopup";

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const userId = localStorage.getItem("userId");

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
      <BrowserRouter>
       <ScrollToTop />
        <AuthProvider>
          <CookiesProvider>
            <AppContent />
          </CookiesProvider>
        </AuthProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
}

export default App;