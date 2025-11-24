import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { H2 } from '@/components/ui/typography'
import { queryProgrammingChatbot } from '@/services/programming_chatbot'
import TextareaAutosize from 'react-textarea-autosize'

export const ProgrammingChatbot = () => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    [],
  )
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const formatMessage = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g
    return text.split(urlRegex).map((part, i) => {
      if (urlRegex.test(part)) {
        return (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-500 hover:text-blue-600"
          >
            {part}
          </a>
        )
      }
      return <span key={i}>{part}</span>
    })
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMsg = { sender: 'user', text: input }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    const promptRules = `Eres un asistente de programación. Responde siempre de manera clara y organizada:
      1. La respuesta debe estar en párrafos separados según la idea principal.
      2. Si hay listas, escríbelas con guiones (-) o números (1., 2., 3.).
      3. Si mencionas enlaces, escribe la URL completa para que se pueda hacer clic.
      4. Evita usar Markdown, JSON u otros formatos especiales.
      5. No agregues texto extra que no forme parte de la explicación.
    `

    const response = await queryProgrammingChatbot({
      message: `${promptRules}\n\nPregunta del usuario: ${input}`,
    })

    const botMsg = response
      ? { sender: 'bot', text: response.reply }
      : { sender: 'bot', text: '⚠️ Error procesando la solicitud.' }

    setMessages((prev) => [...prev, botMsg])
    setLoading(false)
  }

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader>
        <H2 className="text-lg">Chatbot de programación</H2>
      </CardHeader>

      <CardContent className="flex flex-col flex-1 p-2">
        {/* Contenedor de mensajes scrollable */}
        <div className="flex-1 overflow-auto flex flex-col gap-3 p-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`px-3 py-2 rounded-xl text-sm shadow max-w-[80%] break-words
            ${msg.sender === 'user' ? 'self-end bg-primary text-white' : 'self-start bg-muted'}
          `}
            >
              {formatMessage(msg.text)}
            </div>
          ))}
        </div>

        {/* Input y botón */}
        <div className="flex gap-2 mt-2">
          <TextareaAutosize
            placeholder="Escribe tu mensaje..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            className="flex-1 p-2 rounded border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300 resize-none overflow-auto max-h-40"
            minRows={1} // altura mínima
            maxRows={10} // altura máxima antes de scroll interno
            disabled={loading}
          />
          <Button onClick={handleSend} disabled={loading}>
            {loading ? '...' : 'Enviar'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
