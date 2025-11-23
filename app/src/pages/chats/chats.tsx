import { useEffect, useState } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { H1, P } from '@/components/ui/typography'
import {
  getMessages,
  sendMessage,
  type Message,
  type CreateMessageDTO,
} from '../../services/chats'

interface MessageSidebarProps {
  threadId: string
  userId: string
}

export const MessageSidebar = ({ threadId, userId }: MessageSidebarProps) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [newMessage, setNewMessage] = useState('')

  const fetchMessages = async () => {
    setLoading(true)
    const data = await getMessages(threadId)
    if (data) setMessages(data)
    setLoading(false)
  }

  const handleSend = async (msg: string) => {
    const body: CreateMessageDTO = { content: msg, type: 'text', paths: [] }
    await sendMessage(threadId, userId, body)
    fetchMessages()
  }

  useEffect(() => {
    fetchMessages()
    const interval = setInterval(fetchMessages, 5000) // refrescar cada 5s
    return () => clearInterval(interval)
  }, [threadId])

  return (
    <Card className="w-80 h-screen fixed top-0 right-0 flex flex-col bg-gray-50 border-l border-gray-200">
      <CardHeader className="py-4">
        <H1>Mensajes</H1>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 mb-4">
          <div className="flex flex-col gap-2">
            {loading ? (
              <P>Cargando...</P>
            ) : messages.length === 0 ? (
              <P className="text-gray-500">No hay mensajes</P>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`px-3 py-1 rounded-md max-w-[80%] ${
                    msg.user_id === userId
                      ? 'bg-blue-600 text-white self-end'
                      : 'bg-gray-200 text-black self-start'
                  }`}
                >
                  <P className="text-sm">{msg.content}</P>
                  <P className="text-xs text-right">
                    {new Date(msg.created_at).toLocaleTimeString()}
                  </P>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        <div className="flex gap-2">
          <Input
            placeholder="Escribe un mensaje..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={() => {
              if (newMessage.trim()) {
                handleSend(newMessage)
                setNewMessage('') // limpiar input
              }
            }}
          >
            Enviar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
