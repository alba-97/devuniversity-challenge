import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("API Error Response:", error.response.data);
    } else if (error.request) {
      console.error("API No Response:", error.request);
    } else {
      console.error("API Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
