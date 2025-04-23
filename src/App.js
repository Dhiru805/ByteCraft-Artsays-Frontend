import React from "react";
import Routes from "./Routes/Routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CookieConsent from "./CookieConsent/CookieConsent";
import { CookiesProvider } from "react-cookie";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <CookiesProvider>
      <BrowserRouter>
        <div className="App">
          <Routes />
          <ToastContainer />
          <CookieConsent />
        </div>
      </BrowserRouter>
    </CookiesProvider>
  );
}

export default App;
