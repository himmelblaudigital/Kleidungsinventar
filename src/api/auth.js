import { apiRequest } from './client'

export function login(email, password) {
  return apiRequest('/api/auth/login.php', { method: 'POST', body: { email, password } })
}

export function logout() {
  return apiRequest('/api/auth/logout.php', { method: 'POST' })
}

export function fetchCurrentUser() {
  return apiRequest('/api/auth/me.php')
}
