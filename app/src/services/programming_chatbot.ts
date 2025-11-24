import { API_GATEWAY_URL } from '@/constants'

export interface ProgrammingChatDTO {
  message: string
}

export interface ProgrammingChatResponse {
  reply: string
}

export const queryProgrammingChatbot = async (
  body: ProgrammingChatDTO,
): Promise<ProgrammingChatResponse | null> => {
  try {
    const response = await fetch(
      `${API_GATEWAY_URL}/programming-chatbot/chat`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      },
    )

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error en chat Programming:', error)
    return null
  }
}
