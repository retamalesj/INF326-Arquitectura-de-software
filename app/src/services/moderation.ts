import { API_GATEWAY_URL } from '../constants'

/* --------------------- TYPES --------------------- */
export interface ModerationCheckDTO {
  user_id: string
  channel_id: string
  message: string
}

export interface ModerationAnalyzeDTO {
  text: string
}

export interface BanUserDTO {
  reason: string
  expires_at?: string | null
}

export interface BlacklistWord {
  id: string
  word: string
  category: string
  is_regex: boolean
  language: string
  notes?: string
  severity: 'low' | 'medium' | 'high'
}
export interface BlacklistWordCreateDTO {
  word: string
  category: string
  is_regex: boolean
  language: string
  notes?: string
  severity: 'low' | 'medium' | 'high'
}


export interface BannedUser {
  user_id: string
  channel_id: string
  ban_type: 'temporary' | 'permanent'
  banned_at: string
  banned_until: string | null
  reason: string
  total_violations: number
  strike_count: number
}
/* --------------------- CORE MODERATION --------------------- */

/** POST /moderation/check */
export const moderationCheck = async (
  body: ModerationCheckDTO
): Promise<any | null> => {
  try {
    const res = await fetch(`${API_GATEWAY_URL}/moderation/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error(`Error moderando mensaje: ${res.status}`)
    return await res.json()
  } catch (err) {
    console.error(err)
    return null
  }
}

/** POST /moderation/analyze */
export const moderationAnalyze = async (
  body: ModerationAnalyzeDTO
): Promise<any | null> => {
  try {
    const res = await fetch(`${API_GATEWAY_URL}/moderation/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error(`Error analizando texto: ${res.status}`)
    return await res.json()
  } catch (err) {
    console.error(err)
    return null
  }
}

/** GET /moderation/status/{user_id}/{channel_id} */
export const getModerationStatus = async (
  user_id: string,
  channel_id: string
): Promise<any | null> => {
  try {
    const res = await fetch(
      `${API_GATEWAY_URL}/moderation/status/${user_id}/${channel_id}`
    )
    if (!res.ok) throw new Error(`Error obteniendo estado: ${res.status}`)
    return await res.json()
  } catch (err) {
    console.error(err)
    return null
  }
}

/* --------------------- BLACKLIST --------------------- */
export interface BlacklistResponse {
  total: number
  words: BlacklistWord[]
}

/** GET /moderation/blacklist/words */
export const getBlacklist = async (): Promise<BlacklistResponse | null> => {
  try {
    const res = await fetch(`${API_GATEWAY_URL}/moderation/blacklist/words`)
    if (!res.ok) throw new Error(`Error obteniendo blacklist: ${res.status}`)
    return await res.json()
  } catch (err) {
    console.error(err)
    return null
  }
}

/** POST /moderation/blacklist/words */
export const addBlacklistWord = async (
  data: BlacklistWordCreateDTO
): Promise<{ data: { id: string }; message: string; success: boolean } | null> => {
  try {
    const apiKey = "your-admin-api-key-change-in-production"

    const res = await fetch(`${API_GATEWAY_URL}/moderation/blacklist/words`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Error agregando palabra: ${res.status} - ${text}`)
    }

    return await res.json()
  } catch (err) {
    console.error(err)
    return null
  }
}
/** DELETE /moderation/blacklist/words/{word_id} */
export const deleteBlacklistWord = async (
  word_id: string
): Promise<{ success: boolean } | null> => {
  try {
     const apiKey = "your-admin-api-key-change-in-production"
    const res = await fetch(
      `${API_GATEWAY_URL}/moderation/blacklist/words/${word_id}`,
      { method: 'DELETE' ,
           headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
        },}
    )
    if (!res.ok) throw new Error(`Error eliminando palabra: ${res.status}`)
    return await res.json()
  } catch (err) {
    console.error(err)
    return null
  }
}

/* --------------------- ADMIN --------------------- */
export interface BannedUsersResponse {
  total: number
  banned_users: BannedUser[]
}
/** GET /moderation/admin/banned-users */
export const getBannedUsers = async (
  page = 1,
  limit = 20
): Promise<BannedUsersResponse | null> => {
  try {
    const apiKey = "your-admin-api-key-change-in-production"

    const res = await fetch(
      `${API_GATEWAY_URL}/moderation/admin/banned-users?page=${page}&limit=${limit}`,
      {
        headers: {
          "X-API-Key": apiKey,
          "Content-Type": "application/json",
        },
      }
    )
    console.log(res)
    if (!res.ok) throw new Error(`Error obteniendo baneados: ${res.status}`)
    return await res.json()
  } catch (err) {
    console.error(err)
    return null
  }
}
/** GET /moderation/admin/users/{user_id}/violations */
export const getUserModerationStatus = async (
  user_id: string,
  channel_id: string
): Promise<any | null> => {
  try {
    const apiKey = "your-admin-api-key-change-in-production";
    const res = await fetch(
      `${API_GATEWAY_URL}/admin/users/${user_id}/status?channel_id=${channel_id}`,
      {
        headers: {
          "X-API-Key": apiKey,
          "Content-Type": "application/json",
        },
      }
    );
    if (!res.ok) throw new Error(`Error obteniendo estado completo: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

/** GET /moderation/admin/users/{user_id}/violations */
export const getUserViolations = async (
  user_id: string,
  channel_id: string,
  limit = 50
): Promise<{ violations: any[] } | null> => {
  try {
    const apiKey = "your-admin-api-key-change-in-production";
    const res = await fetch(
      `${API_GATEWAY_URL}/admin/users/${user_id}/violations?channel_id=${channel_id}&limit=${limit}`,
      {
        headers: {
          "X-API-Key": apiKey,
          "Content-Type": "application/json",
        },
      }
    );
    if (!res.ok) throw new Error(`Error obteniendo violaciones: ${res.status}`);
    const data = await res.json();
    return data; // data tiene { violations: [...] }
  } catch (err) {
    console.error(err);
    return null;
  }
};
/** POST /moderation/admin/users/{user_id}/ban 
export const banUser = async (
  user_id: string,
  body: BanUserDTO
): Promise<any | null> => {
  try {
    const res = await fetch(
      `${API_GATEWAY_URL}/admin/users/${user_id}/ban`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    )
    if (!res.ok) throw new Error(`Error baneando usuario: ${res.status}`)
    return await res.json()
  } catch (err) {
    console.error(err)
    return null
  }
}*/

/** PUT /moderation/admin/users/{user_id}/unban */
export const unbanUser = async (
  user_id: string
): Promise<any | null> => {
  try {
    const res = await fetch(
      `${API_GATEWAY_URL}/admin/users/${user_id}/unban`,
      { method: 'PUT' }
    )
    if (!res.ok) throw new Error(`Error desbaneando usuario: ${res.status}`)
    return await res.json()
  } catch (err) {
    console.error(err)
    return null
  }
}

