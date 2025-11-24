import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { H1 } from '@/components/ui/typography'
import { queryWikipediaChat } from '@/services/wikipedia_chatbot'

export const WikipediaChatbot = () => {
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

    const response = await queryWikipediaChat({ message: input })

    const botMsg = response
      ? { sender: 'bot', text: response.message }
      : { sender: 'bot', text: '⚠️ Error procesando la solicitud.' }

    setMessages((prev) => [...prev, botMsg])
    setLoading(false)
  }

  return (
    <Card className="w-full h-[550px] flex flex-col">
      <CardHeader>
        <H1 className="text-lg">Chat Wikipedia</H1>
      </CardHeader>

      <CardContent className="flex flex-col gap-2 flex-1">
        <ScrollArea className="flex-1 rounded border p-2">
          <div className="flex flex-col gap-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[75%] px-3 py-2 rounded-xl text-sm shadow
                  ${
                    msg.sender === 'user'
                      ? 'self-end bg-primary text-white'
                      : 'self-start bg-muted'
                  }`}
              >
                {formatMessage(msg.text)}
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex gap-2">
          <Input
            placeholder="Escribe tu mensaje..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
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
