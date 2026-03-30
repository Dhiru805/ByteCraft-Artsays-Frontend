import React, { createContext, useContext } from "react";

const GoogleClientIdContext = createContext("");

export const GoogleClientIdProvider = ({ clientId, children }) => (
  <GoogleClientIdContext.Provider value={clientId}>
    {children}
  </GoogleClientIdContext.Provider>
);

export const useGoogleClientId = () => useContext(GoogleClientIdContext);
