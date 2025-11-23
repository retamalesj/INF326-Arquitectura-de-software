import { useContext, useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { H2, H3, P } from '@/components/ui/typography'
import { Input } from '@/components/ui/input'
import { AuthContext } from '../context/AuthContext'
import {
  getChannels,
  createChannel,
  updateChannel,
  deleteChannel,
  type Channel,
  type CreateChannelDTO,
  type UpdateChannelDTO,
} from '../services/channel'
import { createThread, getThreadsByChannel } from '../services/threads'
import { toast } from 'sonner'

export const Home = () => {
  const { user, loading: authLoading } = useContext(AuthContext)
  const [channels, setChannels] = useState<Channel[]>([])
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null)
  const [loading, setLoading] = useState(false)

  const [threads, setThreads] = useState<any[]>([])
  const [loadingThreads, setLoadingThreads] = useState(false)
  const [newThreadTitle, setNewThreadTitle] = useState('')
  const [selectedThread, setSelectedThread] = useState<any | null>(null)

  const [newChannelName, setNewChannelName] = useState('')
  const [editName, setEditName] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  /** --- Fetch canales --- */
  const fetchChannels = async (p = page, ps = pageSize) => {
    setLoading(true)
    try {
      const data = await getChannels(p, ps)
      if (data) {
        setChannels(data)

        // Mantener selección si sigue en la página
        if (!selectedChannel && data.length > 0) {
          setSelectedChannel(data[0])
        } else if (
          selectedChannel &&
          !data.some((c) => c.id === selectedChannel.id)
        ) {
          setSelectedChannel(data[0] || null)
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchChannels(page, pageSize)
  }, [page, pageSize])

  /** --- Fetch threads al cambiar canal --- */
  useEffect(() => {
    if (!selectedChannel?.id) return
    const fetchThreads = async () => {
      setLoadingThreads(true)
      const res = await getThreadsByChannel(selectedChannel.id)
      setThreads(res || [])
      setSelectedThread(null)
      setLoadingThreads(false)
    }
    fetchThreads()
  }, [selectedChannel])

  if (authLoading) return <P>Cargando usuario...</P>
  if (!user) return <P>No estás logueado</P>

  /** Crear canal */
  const handleCreateChannel = async () => {
    if (!newChannelName.trim()) return
    const body: CreateChannelDTO = {
      name: newChannelName.trim(),
      channel_type: 'public',
      owner_id: user.id,
    }

    const ch = await createChannel(body)
    if (ch) {
      await fetchChannels(page, pageSize)
      setSelectedChannel(ch)
      setNewChannelName('')
      toast.success(`Se creó el canal ${ch.name} correctamente.`)
    }
  }

  /** Actualizar canal */
  const handleUpdateChannel = async () => {
    if (!selectedChannel?.id || !editName.trim()) return
    const body: UpdateChannelDTO = { name: editName.trim() }
    const ch = await updateChannel(selectedChannel.id, body)
    if (ch) {
      setChannels((prev) => prev.map((c) => (c.id === ch.id ? ch : c)))
      setSelectedChannel(ch)
      setEditName('')
    }
  }

  /** Eliminar canal */
  const handleDeleteChannel = async () => {
    if (!selectedChannel?.id) return
    const res = await deleteChannel(selectedChannel.id)
    if (res) {
      setChannels((prev) => {
        const updated = prev.filter((c) => c.id !== selectedChannel.id)
        setSelectedChannel(updated[0] || null)
        return updated
      })
    }
  }

  return (
    <div className="flex w-full">
      {/* Sidebar de canales */}
      <div className="w-74 h-full border-1 border-t-gray-200 border-r-gray-300 flex flex-col bg-gray-50 items-start px-6 h-full">
        <H2 className="text-start mb-4">Canales</H2>

        <ScrollArea className="flex-1 w-full overflow-x-hidden overflow-y-auto">
          {loading ? (
            <P>Cargando canales...</P>
          ) : channels.length === 0 ? (
            <P className="text-gray-500">No hay canales</P>
          ) : (
            <div className="flex flex-col gap-2 w-full">
              {channels.map((ch) => (
                <Button
                  key={ch.id}
                  variant={
                    selectedChannel?.id === ch.id ? 'default' : 'outline'
                  }
                  className={`justify-start ${selectedChannel?.id === ch.id ? '' : 'border-1 border-gray-300'}`}
                  onClick={() => setSelectedChannel(ch)}
                >
                  {ch.name}
                </Button>
              ))}
            </div>
          )}
        </ScrollArea>
        <div className="p-2 border-t border-gray-200 flex gap-2 mt-auto">
          <Input
            placeholder="Nuevo canal..."
            value={newChannelName}
            onChange={(e) => setNewChannelName(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleCreateChannel}>Crear</Button>
        </div>

        {/* Botones anterior y siguiente */}
        <div className="flex gap-2 items-center px-2 py-2">
          <Button
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            &lt;
          </Button>

          <span>Pág. {page}</span>

          <Button
            disabled={channels.length < pageSize}
            onClick={() => setPage((prev) => prev + 1)}
          >
            &gt;
          </Button>

          <select
            className="border rounded p-1 ml-3"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex p-4 overflow-auto">
        {selectedChannel ? (
          <div className="space-y-4">
            <H3>{selectedChannel.name}</H3>
            <P>
              Tipo:{' '}
              {selectedChannel.channel_type === 'public'
                ? 'Público'
                : 'Privado'}
            </P>
            <P>Usuarios: {selectedChannel.user_count || 0}</P>

            {/* Hilos */}
            <div className="mt-3">
              <P className="font-semibold mb-1">Hilos del canal:</P>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {loadingThreads ? (
                  <P>Cargando hilos...</P>
                ) : threads.length === 0 ? (
                  <P className="text-gray-500">No hay hilos</P>
                ) : (
                  threads.map((th) => (
                    <Card
                      key={th.id}
                      onClick={() => setSelectedThread(th)}
                      className={`cursor-pointer px-4 py-2 border hover:bg-gray-100 ${
                        selectedThread?.id === th.id
                          ? 'bg-gray-200 border-black'
                          : ''
                      }`}
                    >
                      {th.title}
                    </Card>
                  ))
                )}
              </div>
            </div>

            {/* Vista simple del hilo */}
            {/* {selectedThread && (
              <div className="mt-6 space-y-2 border p-4 rounded-lg bg-gray-50">
                <H1 className="text-xl">{selectedThread.title}</H1>
                <P>Creado por: {selectedThread.created_by}</P>
                <hr />
                <P className="text-gray-700">(Mensajes vendrán después)</P>
              </div>
            )} */}

            {/* Editar canal */}
            <div className="flex gap-2">
              <Input
                placeholder="Nuevo nombre..."
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleUpdateChannel}>Actualizar</Button>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-2">
              <Button variant="destructive" onClick={handleDeleteChannel}>
                Eliminar
              </Button>
            </div>

            {/* Crear hilo */}
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Nuevo hilo..."
                value={newThreadTitle}
                onChange={(e) => setNewThreadTitle(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={async () => {
                  if (!newThreadTitle.trim() || !selectedChannel?.id) return
                  const body = {
                    channel_id: selectedChannel.id,
                    title: newThreadTitle.trim(),
                    created_by: user.id,
                  }
                  const th = await createThread(body)
                  if (th) {
                    setThreads((prev) => [...prev, th])
                    setNewThreadTitle('')
                    setSelectedThread(th)
                  }
                }}
              >
                Crear
              </Button>
            </div>
          </div>
        ) : (
          <P className="text-gray-500">Selecciona un canal para ver detalles</P>
        )}
      </div>
    </div>
  )
}
