import React from "react";
import Routes from "./Routes/Routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CookieConsent from "./CookieConsent/CookieConsent";
import { CookiesProvider } from "react-cookie";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from './AuthContext';

function App() {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <CookiesProvider>
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
            </div>
          </CookiesProvider>
        </AuthProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
}

export default App;