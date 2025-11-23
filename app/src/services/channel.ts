import { API_GATEWAY_URL } from '../constants'

/** ---------------- TYPES ---------------- */
export interface Channel {
  id: string
  channel_type: 'public' | 'private'
  name: string
  owner_id: string
  user_count?: number
}

export interface CreateChannelDTO {
  channel_type: 'public' | 'private'
  name: string
  owner_id: string
}

export interface UpdateChannelDTO {
  channel_type?: 'public' | 'private'
  name?: string
  owner_id?: string
}

/** ---------------- SERVICES ---------------- */

/**
 * Crea un nuevo canal
 * POST /v1/channels/
 */
export const createChannel = async (
  body: CreateChannelDTO,
): Promise<Channel | null> => {
  try {
    const res = await fetch(`${API_GATEWAY_URL}/channels`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error(`Error creando canal: ${res.status}`)
    return await res.json()
  } catch (err) {
    console.error(err)
    return null
  }
}

/**
 * Obtiene todos los canales (paginado)
 * GET /v1/channels/
 */
export const getChannels = async (
  page = 1,
  page_size = 10,
): Promise<Channel[] | null> => {
  try {
    const res = await fetch(
      `${API_GATEWAY_URL}/channels?page=${page}&page_size=${page_size}`,
    )
    if (!res.ok) throw new Error(`Error obteniendo canales: ${res.status}`)
    return await res.json()
  } catch (err) {
    console.error(err)
    return null
  }
}

/**
 * Obtiene un canal por ID
 * GET /v1/channels/{channel_id}
 */
export const getChannelById = async (
  channel_id: string,
): Promise<Channel | null> => {
  try {
    const res = await fetch(`${API_GATEWAY_URL}/channels/${channel_id}`)
    if (!res.ok) throw new Error(`Error obteniendo canal: ${res.status}`)
    return await res.json()
  } catch (err) {
    console.error(err)
    return null
  }
}

/**
 * Actualiza un canal existente
 * PUT /v1/channels/{channel_id}
 */
export const updateChannel = async (
  channel_id: string,
  body: UpdateChannelDTO,
): Promise<Channel | null> => {
  try {
    const res = await fetch(`${API_GATEWAY_URL}/channels/${channel_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error(`Error actualizando canal: ${res.status}`)
    return await res.json()
  } catch (err) {
    console.error(err)
    return null
  }
}

/**
 * Desactiva un canal
 * DELETE /v1/channels/{channel_id}
 */
export const deleteChannel = async (
  channel_id: string,
): Promise<{ id: string; is_active: boolean } | null> => {
  try {
    const res = await fetch(`${API_GATEWAY_URL}/channels/${channel_id}`, {
      method: 'DELETE',
    })
    if (!res.ok) throw new Error(`Error eliminando canal: ${res.status}`)
    return await res.json()
  } catch (err) {
    console.error(err)
    return null
  }
}

/**
 * Reactiva un canal desactivado
 * POST /v1/channels/{channel_id}/reactivate
 */
export const reactivateChannel = async (
  channel_id: string,
): Promise<{ id: string; is_active: boolean } | null> => {
  try {
    const res = await fetch(
      `${API_GATEWAY_URL}/channels/${channel_id}/reactivate`,
      { method: 'POST' },
    )
    if (!res.ok) throw new Error(`Error reactivando canal: ${res.status}`)
    return await res.json()
  } catch (err) {
    console.error(err)
    return null
  }
}

/**
 * Obtiene información básica de un canal
 * GET /v1/channels/{channel_id}/basic
 */
export const getChannelBasic = async (
  channel_id: string,
): Promise<Channel | null> => {
  try {
    const res = await fetch(`${API_GATEWAY_URL}/channels/${channel_id}/basic`)
    if (!res.ok) throw new Error(`Error obteniendo info básica: ${res.status}`)
    return await res.json()
  } catch (err) {
    console.error(err)
    return null
  }
}

/**
 * Verifica si un canal está activo
 * GET /v1/channels/{channel_id}/status
 */
export const getChannelStatus = async (
  channel_id: string,
): Promise<{ id: string; is_active: boolean } | null> => {
  try {
    const res = await fetch(`${API_GATEWAY_URL}/channels/${channel_id}/status`)
    if (!res.ok)
      throw new Error(`Error obteniendo status del canal: ${res.status}`)
    return await res.json()
  } catch (err) {
    console.error(err)
    return null
  }
}
