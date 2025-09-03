"use client";

import axios from "axios";

const axiosRequest = axios.create({
  baseURL: "https://instagram-api.softclub.tj/",
});

axiosRequest.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosRequest.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("access_token");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosRequest;
