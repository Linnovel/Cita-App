import { ApiClient } from "@shared/api/ApiClient"
import { User } from "@shared/types/UserTypes"

export interface RegisterPayload {
  usuario: string
  cedula: string
  fullName: string
  email: string
  password: string
  role?: string
}

export class AuthService {
  constructor(private apiClient: ApiClient) {}

  async register(
    userData: RegisterPayload,
  ): Promise<{ message: string; user: User }> {
    return this.apiClient.request<{ message: string; user: User }>(
      "/api/auth/register",
      {
        method: "POST",
        body: JSON.stringify({
          ...userData,
          role: "client",
        }),
      },
    )
  }

  async registerAdmin(
    userData: RegisterPayload,
  ): Promise<{ message: string; user: User }> {
    return this.apiClient.request<{ message: string; user: User }>(
      "/api/auth/register-admin",
      {
        method: "POST",
        body: JSON.stringify(userData),
      },
    )
  }

  async login(email: string, password: string): Promise<{ user: User }> {
    return this.apiClient.request<{ user: User }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  async getAllAdmins(): Promise<User[]> {
    return this.apiClient.request<User[]>("/api/auth/admins", {
      method: "GET",
    })
  }

  async approveUser(userId: number): Promise<{ message: string }> {
    return this.apiClient.request<{ message: string }>(
      `/api/auth/approve/${userId}`,
      {
        method: "PATCH",
      },
    )
  }

  async getUnapprovedClients(): Promise<User[]> {
    return this.apiClient.request<User[]>("/api/auth/unapproved", {
      method: "GET",
    })
  }

  async getAllUsers(): Promise<User[]> {
    return this.apiClient.request<User[]>("/api/auth/users", {
      method: "GET",
    })
  }

  async updateUser(
    userId: number,
    data: Partial<RegisterPayload>,
  ): Promise<User> {
    return this.apiClient.request<User>(`/api/auth/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteUser(userId: number): Promise<void> {
    return this.apiClient.request<void>(`/api/auth/users/${userId}`, {
      method: "DELETE",
    })
  }

  async logout(): Promise<void> {
    return this.apiClient.request<void>("/api/auth/logout", {
      method: "POST",
    })
  }

  async getMe(): Promise<User> {
    return this.apiClient.request<User>("/api/auth/me", {
      method: "GET",
    })
  }

  // Métodos de Citas
  async createAppointment(
    type: string,
    observation: string,
  ): Promise<{ id: number }> {
    return this.apiClient.request<{ id: number }>("/api/appointments", {
      method: "POST",
      body: JSON.stringify({ type, observation }),
    })
  }

  async getMyAppointments(): Promise<unknown[]> {
    return this.apiClient.request<unknown[]>("/api/appointments/my", {
      method: "GET",
    })
  }

  async getAllAppointments(): Promise<any[]> {
    return this.apiClient.request("/api/appointments/all", {
      method: "GET",
    })
  }

  async updateAppointmentStatus(
    requestId: number,
    status: string,
  ): Promise<any> {
    return this.apiClient.request(`/api/appointments/${requestId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    })
  }

  async getDashboardStats(): Promise<any> {
    return this.apiClient.request<any>("/api/appointments/stats", {
      method: "GET",
    })
  }

  // Alias para compatibilidad con AppointmentStatsChart.tsx
  getAppointmentStats = this.getDashboardStats.bind(this)
}
