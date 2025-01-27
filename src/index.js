import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ProductProvider } from "./Contexts/ProductProvider";
import { Provider } from 'react-redux';
import store from "./store";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
  <Provider store={store}>
    <ProductProvider>
      {/* <BrowserRouter> */}
        <App/>
        <ToastContainer />
      {/* </BrowserRouter> */}
    </ProductProvider>
  </Provider>
  </>
);