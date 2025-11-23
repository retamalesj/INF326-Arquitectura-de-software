import { useContext, useEffect, useState } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { H1, P } from '@/components/ui/typography'
import { Input } from '@/components/ui/input'
import { MessageSidebar } from './chats/chats'
import { getChannels, type Channel } from '../services/channels'
import { createThread, type CreateThreadDTO } from '../services/channels'
import { AuthContext } from '../context/AuthContext'

export const Home = () => {
  const { user, loading: authLoading } = useContext(AuthContext)
  const [channels, setChannels] = useState<Channel[]>([])
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null)
  const [loading, setLoading] = useState(false)
  const [newThreadTitle, setNewThreadTitle] = useState<string>('')
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null)

  const fetchChannels = async () => {
    setLoading(true)
    try {
      const data = await getChannels()
      if (data) setChannels(data)
      if (!selectedChannel && data && data.length > 0)
        setSelectedChannel(data[0])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchChannels()
  }, [])

  if (authLoading) return <P>Cargando usuario...</P>
  if (!user) return <P>No estás logueado</P>

  const handleCreateThread = async () => {
    if (!selectedChannel || !newThreadTitle.trim()) return
    const body: CreateThreadDTO = {
      channel_id: selectedChannel._id,
      title: newThreadTitle.trim(),
      created_by: user.id,
    }
    const threadId = await createThread(body)
    if (threadId) {
      setCurrentThreadId(threadId) // mostrar el hilo recién creado
      setNewThreadTitle('')
    }
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar de Canales */}
      <Card className="w-64 h-full border-r border-gray-200 flex flex-col bg-gray-50">
        <CardHeader className="py-4">
          <H1>Canales</H1>
        </CardHeader>

        {/* Lista de canales */}
        <ScrollArea className="flex-1">
          {loading ? (
            <P>Cargando canales...</P>
          ) : channels.length === 0 ? (
            <P className="text-gray-500">No hay canales</P>
          ) : (
            <div className="flex flex-col gap-2 p-2">
              {channels.map((ch) => (
                <Button
                  key={ch._id}
                  variant={
                    selectedChannel?._id === ch._id ? 'default' : 'outline'
                  }
                  className="justify-start"
                  onClick={() => setSelectedChannel(ch)}
                >
                  {ch.name}
                </Button>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Input para crear hilo */}
        {selectedChannel && (
          <div className="p-2 border-t border-gray-200 flex gap-2">
            <Input
              placeholder="Nuevo hilo..."
              value={newThreadTitle}
              onChange={(e) => setNewThreadTitle(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleCreateThread}>Crear</Button>
          </div>
        )}
      </Card>
      {/* Contenido principal (chat) */}
      <div className="flex-1 relative">
        {currentThreadId ? (
          <MessageSidebar threadId={currentThreadId} userId={user.id} />
        ) : selectedChannel ? (
          <MessageSidebar threadId={selectedChannel._id} userId={user.id} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <P className="text-gray-500">Selecciona un canal para comenzar</P>
          </div>
        )}
      </div>
    </div>
  )
}
