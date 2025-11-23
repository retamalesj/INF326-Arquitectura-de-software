import { API_GATEWAY_URL } from '../constants'

/** ---------------- REGISTER ---------------- */
export interface RegisterDTO {
  email: string
  username: string
  password: string
  full_name: string
}

export const registerUser = async (body: RegisterDTO) => {
  try {
    const response = await fetch(`${API_GATEWAY_URL}/users/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (response.status === 409) {
      throw new Error('Email o username ya existe')
    }
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error registrando usuario:', error)
    return null
  }
}

/** ---------------- LOGIN ---------------- */
export interface LoginDTO {
  username_or_email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  token_type: 'bearer'
}

export const loginUser = async (
  body: LoginDTO,
): Promise<LoginResponse | null> => {
  try {
    const response = await fetch(`${API_GATEWAY_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (response.status === 401) throw new Error('Credenciales inválidas')
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`)

    return await response.json()
  } catch (error) {
    console.error('Error iniciando sesión:', error)
    return null
  }
}

/** ---------------- GET ME ---------------- */
export interface UserProfile {
  id: string
  email: string
  username: string
  full_name: string
  is_active: boolean
}

export const getMe = async (token: string): Promise<UserProfile | null> => {
  try {
    const response = await fetch(`${API_GATEWAY_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.status === 401) throw new Error('No autorizado')
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`)

    return await response.json()
  } catch (error) {
    console.error('Error obteniendo perfil de usuario:', error)
    return null
  }
}

/** ---------------- UPDATE ME ---------------- */
export interface UpdateMeDTO {
  full_name: string
}

export const updateMe = async (
  token: string,
  body: UpdateMeDTO,
): Promise<UserProfile | null> => {
  try {
    const response = await fetch(`${API_GATEWAY_URL}/users/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })

    if (response.status === 401) throw new Error('No autorizado')
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`)

    return await response.json()
  } catch (error) {
    console.error('Error actualizando usuario:', error)
    return null
  }
}
