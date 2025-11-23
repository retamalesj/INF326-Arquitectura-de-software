import { useEffect, useState } from "react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { H1, P } from "@/components/ui/typography"
import { Separator } from "@/components/ui/separator"
import { MessageSidebar } from "./chats/chats"
import { getChannels, type Channel } from '../services/channels' // tu service

interface Thread {
  id: string
  channel_id: string
  title: string
}

interface HomeProps {
  userId: string
}

export const Home = ({ userId }: HomeProps) => {
  const [channels, setChannels] = useState<Channel[]>([])
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchChannels = async () => {
    setLoading(true)
    try {
      const data = await getChannels()
      if (data) setChannels(data)
      if (!selectedChannel && data && data.length > 0) setSelectedChannel(data[0])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchChannels()
  }, [])

  return (
    <div className="flex h-screen">
      {/* Sidebar de Canales */}
      <Card className="w-64 h-full border-r border-gray-200 flex flex-col bg-gray-50">
        <CardHeader className="py-4">
          <H1>Canales</H1>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <ScrollArea className="flex-1">
            {loading ? (
              <P>Cargando canales...</P>
            ) : channels.length === 0 ? (
              <P className="text-gray-500">No hay canales</P>
            ) : (
              <div className="flex flex-col gap-2">
                {channels.map((ch) => (
                  <Button
                    key={ch._id}
                    variant={selectedChannel?._id === ch._id ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => setSelectedChannel(ch)}
                  >
                    {ch.name}
                  </Button>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Contenido principal (chat) */}
      <div className="flex-1 relative">
        {selectedChannel ? (
          <MessageSidebar threadId={selectedChannel._id} userId={userId} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <P className="text-gray-500">Selecciona un canal para comenzar</P>
          </div>
        )}
      </div>
    </div>
  )
}
