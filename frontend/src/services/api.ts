import axios, { AxiosError } from "axios";
import type { ApiErrorResponse } from "../types/global";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3333/api",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response) {
      // Verifica se a propriedade 'response' existe
      const { status, data } = error.response; // Desestrutura status e data

      // Agora 'data' é do tipo ApiErrorResponse
      if (status === 401) {
        if (data.message === "Token expirado.") {
          console.warn("Token expirado. Deslogando...");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        } else if (data.message === "Token inválido.") {
          console.warn("Token inválido. Deslogando...");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
      }
    } else {
      // Se não há response (ex: erro de rede, CORS, etc.),
      // você pode logar ou tratar de outra forma.
      console.error("Erro sem resposta do servidor:", error.message);
    }

    // Sempre retorna a Promise rejeitada para que o erro seja tratado nos componentes
    return Promise.reject(error);
  }
);

export default api;
