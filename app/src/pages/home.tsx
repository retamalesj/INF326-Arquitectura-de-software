import { useContext, useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { H3, P } from '@/components/ui/typography'
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
import { FiEdit, FiCheck, FiX } from 'react-icons/fi'
import { Messages } from './chats/chats'
import { Sidebar } from '@/components/ui/sidebar'

export const Home = () => {
  const { user, loading: authLoading } = useContext(AuthContext)
  const [channels, setChannels] = useState<Channel[]>([])
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null)
  const [loading, setLoading] = useState(false)

  const [threads, setThreads] = useState<any[]>([])
  const [loadingThreads, setLoadingThreads] = useState(false)
  const [selectedThread, setSelectedThread] = useState<any | null>(null)

  const [newChannelName, setNewChannelName] = useState('')
  const [editChannelName, setEditChannelName] = useState('')
  const [isEditingChannel, setIsEditingChannel] = useState(false)

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  /** --- Fetch canales --- */
  const fetchChannels = async (p = page, ps = pageSize) => {
    setLoading(true)
    try {
      const data = await getChannels(p, ps)
      if (data) {
        setChannels(data)
        if (!selectedChannel && data.length > 0) {
          setSelectedChannel(data[0])
          setEditChannelName(data[0].name)
        } else if (
          selectedChannel &&
          !data.some((c) => c.id === selectedChannel.id)
        ) {
          setSelectedChannel(data[0] || null)
          setEditChannelName(data[0]?.name || '')
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
      setEditChannelName(selectedChannel.name)
      setIsEditingChannel(false)
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
  const handleSaveChannelName = async () => {
    if (!selectedChannel?.id || !editChannelName.trim()) return
    const body: UpdateChannelDTO = { name: editChannelName.trim() }
    const ch = await updateChannel(selectedChannel.id, body)
    if (ch) {
      setChannels((prev) => prev.map((c) => (c.id === ch.id ? ch : c)))
      setSelectedChannel(ch)
      setIsEditingChannel(false)
      toast.success(`Se actualizó el nombre del canal a ${ch.name}`)
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
      <Sidebar
        title="Canales"
        footer={
          <>
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
          </>
        }
      >
        {loading ? (
          <P>Cargando canales...</P>
        ) : channels.length === 0 ? (
          <P className="text-gray-500">No hay canales</P>
        ) : (
          <div className="flex flex-col gap-2 w-full">
            {channels.map((ch) => (
              <div key={ch.id} className="flex flex-col w-full">
                <Button
                  variant={
                    selectedChannel?.id === ch.id ? 'default' : 'outline'
                  }
                  className={`justify-start ${
                    selectedChannel?.id === ch.id
                      ? ''
                      : 'border-1 border-gray-300'
                  }`}
                  onClick={() => setSelectedChannel(ch)}
                >
                  {ch.name}
                </Button>

                {/* Hilos solo para el canal seleccionado */}
                {selectedChannel?.id === ch.id && (
                  <div className="flex flex-col gap-1 pl-4 mt-1">
                    {loadingThreads ? (
                      <P>Cargando hilos...</P>
                    ) : threads.length === 0 ? (
                      <P className="text-gray-500">No hay hilos</P>
                    ) : (
                      threads.map((th) => (
                        <Card
                          key={th.id}
                          onClick={() => setSelectedThread(th)}
                          className={`cursor-pointer px-3 py-1 border hover:bg-gray-100 ${
                            selectedThread?.id === th.id
                              ? 'bg-gray-200 border-black'
                              : ''
                          }`}
                        >
                          #{th.title}
                        </Card>
                      ))
                    )}

                    {/* Botón + Crear hilo */}
                    <button
                      className="flex items-center justify-start gap-2 px-3 py-1 text-gray-500 hover:bg-gray-200 rounded w-full"
                      onClick={() => {
                        const title = prompt('Nombre del nuevo hilo:')
                        if (!title?.trim()) return
                        const body = {
                          channel_id: selectedChannel.id,
                          thread_name: title.trim(),
                          user_id: user.id,
                        }

                        createThread(body).then((th) => {
                          if (th) {
                            setThreads((prev) => [
                              ...prev,
                              {
                                thread_id: th.thread_id,
                                title: th.title,
                                created_by: th.created_by,
                              },
                            ])
                            setSelectedThread(th)
                            toast.success(`Se creó el hilo "${title.trim()}"`)
                          }
                        })
                      }}
                    >
                      <span className="text-lg font-bold">+</span>
                      <span>Crear hilo</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Sidebar>

      {/* Contenido principal */}
      <div className="flex p-4 overflow-auto w-full">
        {selectedChannel ? (
          <div className="space-y-4 w-full">
            {/* Nombre del canal editable */}
            <div className="flex flex-col items-start text-center space-y-1">
              {isEditingChannel ? (
                <div className="flex items-center space-x-2">
                  <Input
                    value={editChannelName}
                    onChange={(e) => setEditChannelName(e.target.value)}
                    className="px-3 py-1"
                  />
                  <Button
                    onClick={handleSaveChannelName}
                    className="bg-green-500 hover:bg-green-600 text-white flex items-center"
                  >
                    <FiCheck className="w-5 h-5 mr-1" /> Guardar
                  </Button>
                  <Button
                    onClick={() => {
                      setIsEditingChannel(false)
                      setEditChannelName(selectedChannel.name)
                    }}
                    className="bg-red-400 hover:bg-red-500 text-white flex items-center"
                  >
                    <FiX className="w-5 h-5 mr-1" /> Cancelar
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <H3>{selectedChannel.name}</H3>
                  <button
                    onClick={() => setIsEditingChannel(true)}
                    className="text-gray-500 hover:text-blue-500 transition"
                    title="Editar nombre del canal"
                  >
                    <FiEdit className="w-5 h-5" />
                  </button>
                </div>
              )}
              <P>
                Tipo:{' '}
                {selectedChannel.channel_type === 'public'
                  ? 'Público'
                  : 'Privado'}
              </P>
              <P>Usuarios: {selectedChannel.user_count || 0}</P>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-2">
              <Button variant="destructive" onClick={handleDeleteChannel}>
                Eliminar canal
              </Button>
            </div>

            {selectedThread && (
              <Messages
                threadId={selectedThread.id}
                threadName={selectedThread.title}
              />
            )}
          </div>
        ) : (
          <P className="text-gray-500">Selecciona un canal para ver detalles</P>
        )}
      </div>
    </div>
  )
}
