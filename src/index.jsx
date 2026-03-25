import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
// import './index.css'; 

import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleClientIdProvider } from "./GoogleClientIdContext";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

function Root() {
  const [googleClientId, setGoogleClientId] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/api/get-google-settings`)
      .then((res) => res.json())
      .then((data) => {
        const clientId = data?.data?.googleClientId || data?.googleClientId;
        if (clientId) {
          setGoogleClientId(clientId);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <GoogleClientIdProvider clientId={googleClientId}>
      <GoogleOAuthProvider clientId={googleClientId}>
        <App />
      </GoogleOAuthProvider>
    </GoogleClientIdProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);

reportWebVitals();
