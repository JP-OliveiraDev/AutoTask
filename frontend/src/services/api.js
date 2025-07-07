import axios from "axios";
import { getToken } from "./auth";

const api = axios.create({
  baseURL: "https://autotask-backend.onrender.com/api",
});

// Interceptor de requisição
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Interceptor de resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      alert("Sua sessão expirou. Faça login novamente.");
      window.location.href = "/login"; 
    }
    return Promise.reject(error);
  }
);

export default api;
