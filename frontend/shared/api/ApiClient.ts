export type UnauthorizedHandler = () => void

export class ApiClient {
  private onUnauthorized?: UnauthorizedHandler

  constructor(private baseUrl: string) {}

  setUnauthorizedHandler(handler: UnauthorizedHandler) {
    this.onUnauthorized = handler
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "X-App-Context": import.meta.env.VITE_APP_CONTEXT || "customer",
        ...options.headers,
      },
      credentials: "include",
    })

    if (response.status === 401 || response.status === 403) {
      if (this.onUnauthorized) {
        this.onUnauthorized()
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || "Error en la petición HTTP")
    }

    return response.json()
  }
}
