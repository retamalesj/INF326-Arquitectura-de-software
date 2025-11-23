import { API_GATEWAY_URL } from '../constants'

/** ---------------- THREADS / CANALES ---------------- */

export interface CreateThreadDTO {
  channel_id: string
  title: string
  created_by: string
  metadata?: Record<string, any>
}

export const createThread = async (body: CreateThreadDTO): Promise<string | null> => {
  try {
    const response = await fetch(`${API_GATEWAY_URL}/threads/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!response.ok) throw new Error(`Error creando hilo: ${response.status}`)
    return await response.text() // devuelve el ID del hilo
  } catch (error) {
    console.error('Error creando hilo:', error)
    return null
  }
}

export const getThreadById = async (threadId: string): Promise<any | null> => {
  try {
    const response = await fetch(`${API_GATEWAY_URL}/threads/${threadId}`)
    if (!response.ok) throw new Error(`Error obteniendo hilo: ${response.status}`)
    return await response.json()
  } catch (error) {
    console.error('Error obteniendo hilo:', error)
    return null
  }
}

export const deleteThread = async (threadId: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_GATEWAY_URL}/threads/${threadId}`, { method: 'DELETE' })
    if (!response.ok) throw new Error(`Error eliminando hilo: ${response.status}`)
    return true
  } catch (error) {
    console.error('Error eliminando hilo:', error)
    return false
  }
}

export interface EditThreadDTO {
  title: string
  metadata?: Record<string, any>
}

export const editThread = async (threadId: string, body: EditThreadDTO): Promise<string | null> => {
  try {
    const response = await fetch(`${API_GATEWAY_URL}/threads/${threadId}/edit`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!response.ok) throw new Error(`Error editando hilo: ${response.status}`)
    return await response.text()
  } catch (error) {
    console.error('Error editando hilo:', error)
    return null
  }
}


export interface Channel {
  _id: string
  name: string
  is_active: boolean
  updated_at: string
}

/** Obtener todos los canales */
export const getChannels = async (): Promise<Channel[] | null> => {
  try {
    const res = await fetch(`${API_GATEWAY_URL}/channel/channels`)
    if (!res.ok) throw new Error(`Error HTTP: ${res.status}`)
    return await res.json()
  } catch (err) {
    console.error("Error obteniendo canales:", err)
    return null
  }
}