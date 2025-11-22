import { API_GATEWAY_URL } from '../constants'

export const getPresenceList = async () => {
  try {
    const response = await fetch(`${API_GATEWAY_URL}/presence/`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching presence list:', error)
    return []
  }
}
