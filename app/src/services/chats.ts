import { API_GATEWAY_URL } from '../constants'

export interface Message {
  id: string
  thread_id: string
  user_id: string
  content: string
  created_at: string
}

export interface CreateMessageDTO {
  content: string
  type: 'text' | 'file'
  paths: string[]
}

/** Obtener mensajes de un hilo */
export const getMessages = async (
  threadId: string,
): Promise<Message[] | null> => {
  try {
    const res = await fetch(
      `${API_GATEWAY_URL}/messages/threads/${threadId}/messages?limit=50`,
    )

    if (!res.ok) throw new Error(`Error HTTP: ${res.status}`)
    const data = await res.json()

    const items: Message[] = data.items || []

    //  Ordenar ASC por fecha (viejo → nuevo)
    items.sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    )

    return items
  } catch (err) {
    console.error('Error obteniendo mensajes:', err)
    return null
  }
}

/** Enviar mensaje a un hilo */
export const sendMessage = async (
  threadId: string,
  userId: string,
  body: CreateMessageDTO,
) => {
  try {
    const res = await fetch(
      `${API_GATEWAY_URL}/messages/threads/${threadId}/messages`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId,
        },
        body: JSON.stringify(body),
      },
    )
    if (!res.ok) throw new Error(`Error HTTP: ${res.status}`)
    return await res.text()
  } catch (err) {
    console.error('Error enviando mensaje:', err)
    return null
  }
}
