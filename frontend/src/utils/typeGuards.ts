import { AxiosError } from "axios";
import type { ApiErrorResponse } from "../types/global";

// Type guard para verificar se um erro é uma instância de AxiosError
export function isAxiosError<T = unknown>(
  error: unknown
): error is AxiosError<T> {
  return (error as AxiosError).isAxiosError !== undefined;
}

// Type guard para verificar se um erro é um AxiosError E tem uma resposta com dados de erro da API
export function isApiError(
  error: unknown
): error is AxiosError<ApiErrorResponse> {
  if (!isAxiosError(error)) {
    return false;
  }
  if (!error.response || !error.response.data) {
    return false;
  }
  const errorData = error.response.data as ApiErrorResponse;
  return typeof errorData.message === "string";
}
