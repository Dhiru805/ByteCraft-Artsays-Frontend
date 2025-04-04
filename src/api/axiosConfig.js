// src/api/axiosConfig.js

import Axios from "axios";

const baseURL = process.env.REACT_APP_API_URL;
console.log("Base URL:", baseURL)

const axiosInstance = Axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
