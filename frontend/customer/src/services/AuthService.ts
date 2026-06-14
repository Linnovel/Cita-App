import { ApiClient } from "@shared/api/ApiClient"
import { User } from "@shared/types/UserTypes"

export class AuthService {
  constructor(private apiClient: ApiClient) {}

  async register(userData: {
    fullName: string
    email: string
    password: string
    role: string
  }): Promise<{ message: string; user: User }> {
    return this.apiClient.request<{ message: string; user: User }>(
      "/auth/register",
      {
        method: "POST",
        body: JSON.stringify(userData),
      },
    )
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ message: string; user: User }> {
    return this.apiClient.request<{ message: string; user: User }>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      },
    )
  }
}
