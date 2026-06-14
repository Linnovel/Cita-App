import { ApiClient } from "./ApiClient"

const API_BASE_URL = import.meta.env.DEV
  ? ""
  : import.meta.env.VITE_API_URL || "http://localhost:3000"

// Instancia única global para todo el proyecto
export const apiClient = new ApiClient(API_BASE_URL)
