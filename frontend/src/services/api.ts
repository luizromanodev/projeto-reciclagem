// frontend/src/services/api.ts
import axios, { AxiosError } from "axios"; // Importe AxiosError
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
  // O erro na requisição já é tipado como AxiosError
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  // NO INTERCEPTOR DE RESPOSTA, TIPAMOS O ERRO COMO AxiosError<ApiErrorResponse>
  // Isso informa ao TypeScript a estrutura esperada da resposta de erro da API.
  (error: AxiosError<ApiErrorResponse>) => {
    // <<<<< Mudei o tipo de 'error' AQUI!
    // Agora, TypeScript já sabe que 'error' tem 'response' e 'data' (do tipo ApiErrorResponse)
    // Se response ou data forem undefined (o que o AxiosError<ApiErrorResponse> ainda permite),
    // é porque a resposta não teve a estrutura esperada (ex: erro de rede).
    // Usamos um condicional opcional (?) ou garantimos com 'if'.

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
