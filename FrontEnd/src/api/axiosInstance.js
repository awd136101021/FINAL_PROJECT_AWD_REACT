import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // backend URL
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = "Bearer ${token}";
  return config;
});

// Handle expired or invalid token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/signin"; // redirect to login
    }
    return Promise.reject(error);
  }
);

export default api;