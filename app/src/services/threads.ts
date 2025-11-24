import { API_GATEWAY_URL } from '../constants'

/** ---------------- THREADS / CANALES ---------------- */

export interface CreateThreadDTO {
  channel_id: string
  thread_name: string
  user_id: string
}

export const createThread = async (params: CreateThreadDTO) => {
  try {
    // Forzar a Record<string, string>
    const query = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params).map(([key, value]) => [key, String(value)]),
      ),
    ).toString()

    const response = await fetch(`${API_GATEWAY_URL}/threads/?${query}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) throw new Error(`Error creando hilo: ${response.status}`)
    return await response.json()
  } catch (error) {
    console.error('Error creando hilo:', error)
    return null
  }
}

export const getThreadById = async (channelId: string): Promise<any | null> => {
  try {
    const response = await fetch(`${API_GATEWAY_URL}/threads/${channelId}`)
    if (!response.ok)
      throw new Error(`Error obteniendo hilo: ${response.status}`)
    return await response.json()
  } catch (error) {
    console.error('Error obteniendo hilo:', error)
    return null
  }
}

export const deleteThread = async (threadId: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_GATEWAY_URL}/threads/${threadId}`, {
      method: 'DELETE',
    })
    if (!response.ok)
      throw new Error(`Error eliminando hilo: ${response.status}`)
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

export const editThread = async (
  threadId: string,
  body: EditThreadDTO,
): Promise<string | null> => {
  try {
    const response = await fetch(
      `${API_GATEWAY_URL}/threads/${threadId}/edit`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      },
    )
    if (!response.ok) throw new Error(`Error editando hilo: ${response.status}`)
    return await response.text()
  } catch (error) {
    console.error('Error editando hilo:', error)
    return null
  }
}

export interface ThreadSummary {
  thread_id: string
  title: string
  created_by: string
}

export const getThreadsByChannel = async (
  channelId: string,
): Promise<ThreadSummary[] | null> => {
  try {
    const response = await fetch(
      `${API_GATEWAY_URL}/threads/channel/get_threads?channel_id=${channelId}`,
    )
    if (!response.ok)
      throw new Error(`Error obteniendo hilos: ${response.status}`)
    return await response.json()
  } catch (error) {
    console.error('Error obteniendo hilos:', error)
    return null
  }
}
