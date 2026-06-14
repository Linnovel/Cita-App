export interface User {
  id: number
  usuario: string
  fullName: string
  cedula: string
  email: string
  role: "admin" | "client"
  isApproved: boolean
}

export interface RegisterCustomerPayload {
  usuario: string
  cedula: string
  fullName: string
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  token?: string
}
