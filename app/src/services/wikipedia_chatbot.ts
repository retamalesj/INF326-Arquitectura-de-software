import { API_GATEWAY_URL } from '../constants'

export interface WikipediaChatDTO {
  message: string
}

export interface WikipediaChatResponse {
  message: string
}

export const queryWikipediaChat = async (
  body: WikipediaChatDTO,
): Promise<WikipediaChatResponse | null> => {
  try {
    const response = await fetch(
      `${API_GATEWAY_URL}/wikipedia-chatbot/chat-wikipedia`,
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
    console.error('Error en chat Wikipedia:', error)
    return null
  }
}
