// src/services/authService.jsx
import axios from "axios";
import api from "../api/axiosInstance";

export const getProtectedData = async () => {
  const res = await api.get("/protected");
  return res.data;
};
const API_URL = (import.meta && import.meta.env && import.meta.env.VITE_API_URL) ? import.meta.env.VITE_API_URL : "http://localhost:5000/api/auth";

// create an axios instance you can reuse
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// Axios interceptor to automatically add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const register = async ({ fullName, email, password }) => {
  const res = await api.post("/register", { fullName, email, password });
  if (res.data?.token) {
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
  }
  return res.data;
};

const login = async ({ email, password }) => {
  const res = await api.post("/login", { email, password });
  if (res.data?.token) {
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
  }
  return res.data;
};

const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

const getToken = () => localStorage.getItem("token");

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export default {
  api,
  register,
  login,
  getCurrentUser,
  getToken,
  logout
};
