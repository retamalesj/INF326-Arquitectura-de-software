import { useEffect, useState, useContext } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import {
  getBlacklist,
  addBlacklistWord,
  deleteBlacklistWord,
  getBannedUsers,
  unbanUser,
  /*banUser,*/
  getUserModerationStatus,
  getUserViolations,
  moderationAnalyze,
  moderationCheck,
  type BlacklistWord,
  type BannedUser,
} from '@/services/moderation'
import { AuthContext } from '@/context/AuthContext'
import { H2, H3 } from '@/components/ui/typography'

export default function ModerationAdminPage() {
  const { token } = useContext(AuthContext)

  /* ------------------ BLACKLIST ------------------ */
  const [blacklist, setBlacklist] = useState<BlacklistWord[]>([])
  const [newWord, setNewWord] = useState('')
  const [newCategory, setNewCategory] = useState('insult')
  const [newSeverity, setNewSeverity] = useState('medium')
  const [newLanguage, setNewLanguage] = useState('es')
  const [newNotes, setNewNotes] = useState('')

  const loadBlacklist = async () => {
    const data = await getBlacklist()
    if (data?.words) setBlacklist(data.words)
  }

  const handleAddWord = async () => {
    if (!newWord.trim()) return
    const res = await addBlacklistWord({
      word: newWord,
      category: 'insult',
      is_regex: false,
      language: 'es',
      notes: 'Palabra inapropiada',
      severity: 'medium',
    })
    if (!res) return toast.error('Error agregando palabra')
    toast.success('Palabra agregada')
    setNewWord('')
    loadBlacklist()
  }

  const handleDeleteWord = async (id: string) => {
    const res = await deleteBlacklistWord(id)
    if (!res?.success) return toast.error('Error eliminando palabra')
    toast.success('Palabra eliminada')
    loadBlacklist()
  }

  /* ------------------ BANNED USERS ------------------ */
  const [bannedUsers, setBannedUsers] = useState<BannedUser[]>([])

  const loadBannedUsers = async () => {
    if (!token) return
    const data = await getBannedUsers()
    if (Array.isArray(data?.banned_users)) setBannedUsers(data.banned_users)
  }

  const handleUnban = async (userId: string) => {
    const res = await unbanUser(userId)
    if (!res) return toast.error('No se pudo desbanear')
    toast.success('Usuario desbaneado')
    loadBannedUsers()
  }

  const [banTarget, setBanTarget] = useState('')
  const [banReason, setBanReason] = useState('')
  const [banExpiry, setBanExpiry] = useState('')
  /*
  const handleBan = async () => {
    if (!banTarget.trim() || !banReason.trim())
      return toast.error('Faltan campos')

    const res = await banUser(banTarget, {
      reason: banReason,
      expires_at: banExpiry || null,
    })
    if (!res) return toast.error('Error baneando usuario')

    toast.success('Usuario baneado')
    setBanTarget('')
    setBanReason('')
    setBanExpiry('')
    loadBannedUsers()
  }*/

  /* ------------------ USER STATUS ------------------ */
  const [statusUserId, setStatusUserId] = useState('')
  const [userStatus, setUserStatus] = useState<any | null>(null)
  const [violations, setViolations] = useState<any[]>([])
  const [channelId, setChannelId] = useState('')
  const loadStatus = async () => {
    if (!statusUserId || !channelId) {
      toast.error('Debes ingresar User ID y Channel ID')
      return
    }

    const st = await getUserModerationStatus(statusUserId, channelId)
    const v = await getUserViolations(statusUserId, channelId)

    setUserStatus(st)
    setViolations(v?.violations || [])
  }

  /* ------------------ TEXT ANALYZER ------------------ */
  const [textToAnalyze, setTextToAnalyze] = useState('')
  const [analysisResult, setAnalysisResult] = useState(null)

  const handleAnalyze = async () => {
    const res = await moderationAnalyze({ text: textToAnalyze })
    setAnalysisResult(res)
  }

  /* ------------------ MESSAGE CHECK ------------------ */
  const [checkUserId, setCheckUserId] = useState('')
  const [checkChannelId, setCheckChannelId] = useState('')
  const [checkMessage, setCheckMessage] = useState('')
  const [checkResult, setCheckResult] = useState(null)

  const handleCheck = async () => {
    const res = await moderationCheck({
      user_id: checkUserId,
      channel_id: checkChannelId,
      message: checkMessage,
    })
    setCheckResult(res)
  }

  /* ------------------ INITIAL LOAD ------------------ */
  useEffect(() => {
    loadBlacklist()
  }, [])

  useEffect(() => {
    if (token) loadBannedUsers()
  }, [token])

  return (
    <div className="w-full p-6 space-y-6">
      <Tabs defaultValue="blacklist" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="blacklist">Blacklist</TabsTrigger>
          <TabsTrigger value="banned">Usuarios Baneados</TabsTrigger>
          <TabsTrigger value="analyzer">Analizador</TabsTrigger>
          <TabsTrigger value="user-status">Estado de Usuarios</TabsTrigger>
        </TabsList>

        {/* -------------------- BLACKLIST -------------------- */}
        <TabsContent value="blacklist">
          <Card>
            <CardHeader>
              <CardTitle>
                <H2 className="text-lg font-semibold">Palabras prohibidas</H2>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Formulario de nueva palabra */}

              <CardContent className="space-y-4 border border-gray-400 rounded p-4">
                <H3 className="text-lg font-semibold">Agregar Nueva Palabra</H3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                  <Input
                    value={newWord}
                    onChange={(e) => setNewWord(e.target.value)}
                    placeholder="Nueva palabra"
                    className="w-full md:col-span-1"
                  />
                  <select
                    className="border rounded px-2 py-1 w-full"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  >
                    <option value="insult">Insulto</option>
                    <option value="spam">Spam</option>
                    <option value="other">Otro</option>
                  </select>
                  <select
                    className="border rounded px-2 py-1 w-full"
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value)}
                  >
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                  </select>
                  <select
                    className="border rounded px-2 py-1 w-full"
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                  >
                    <option value="es">Español</option>
                    <option value="en">Inglés</option>
                  </select>
                  <Button onClick={handleAddWord} className="w-full md:w-auto">
                    Agregar
                  </Button>
                </div>

                <Input
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Notas"
                  className="w-full mt-2"
                />
              </CardContent>
              {/* Lista de palabras */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Palabra</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Severidad</TableHead>
                    <TableHead>Idioma</TableHead>
                    <TableHead>Notas</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blacklist.map((w) => (
                    <TableRow key={w.id}>
                      <TableCell>{w.word}</TableCell>
                      <TableCell>{w.category}</TableCell>
                      <TableCell>{w.severity}</TableCell>
                      <TableCell>{w.language}</TableCell>
                      <TableCell>{w.notes}</TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteWord(w.id)}
                        >
                          Eliminar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* -------------------- BANNED USERS -------------------- */}
        <TabsContent value="banned">
          <Card>
            <CardHeader>
              <CardTitle>Usuarios Baneados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Razón</TableHead>
                    <TableHead>Tipo de Ban</TableHead>
                    <TableHead>Baneado Desde</TableHead>
                    <TableHead>Baneado Hasta</TableHead>
                    <TableHead>Razón</TableHead>
                    <TableHead>Total Violaciones</TableHead>
                    <TableHead>Strike Count</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bannedUsers.map((u) => (
                    <TableRow key={`${u.user_id}-${u.channel_id}`}>
                      <TableCell>{u.user_id}</TableCell>
                      <TableCell>{u.channel_id}</TableCell>
                      <TableCell>{u.ban_type}</TableCell>
                      <TableCell>{u.banned_at}</TableCell>
                      <TableCell>{u.banned_until}</TableCell>
                      <TableCell>{u.reason}</TableCell>
                      <TableCell>{u.total_violations}</TableCell>
                      <TableCell>{u.strike_count}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => handleUnban(u.user_id)}
                        >
                          Desbanear
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {/*
              <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
                <Input
                  placeholder="User ID"
                  value={banTarget}
                  onChange={(e) => setBanTarget(e.target.value)}
                />
                <Input
                  placeholder="Razón"
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                />
                <Input
                  type="datetime-local"
                  value={banExpiry}
                  onChange={(e) => setBanExpiry(e.target.value)}
                />
                <Button onClick={handleBan}>Banear Usuario</Button>
              </div>*/}
            </CardContent>
          </Card>
        </TabsContent>

        {/* -------------------- TEXT ANALYZER -------------------- */}
        <TabsContent value="analyzer">
          <Card>
            <CardHeader>
              <CardTitle>Analizador de Texto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                rows={4}
                value={textToAnalyze}
                onChange={(e) => setTextToAnalyze(e.target.value)}
                placeholder="Ingresa texto a analizar"
              />
              <Button onClick={handleAnalyze}>Analizar</Button>
              {analysisResult && (
                <pre className="p-3 text-sm bg-gray-900 text-green-300 rounded">
                  {JSON.stringify(analysisResult, null, 2)}
                </pre>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* -------------------- USER STATUS -------------------- */}
        <TabsContent value="user-status">
          <Card>
            <CardHeader>
              <CardTitle>Estado de Usuario</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-2">
                <Input
                  placeholder="User ID"
                  value={statusUserId}
                  onChange={(e) => setStatusUserId(e.target.value)}
                />
                <Input
                  placeholder="Channel ID"
                  value={channelId}
                  onChange={(e) => setChannelId(e.target.value)}
                />
                <Button onClick={loadStatus}>Buscar</Button>
              </div>

              {userStatus && (
                <div className="space-y-2 bg-gray-50 p-3 rounded">
                  <pre className="text-sm">
                    {JSON.stringify(userStatus, null, 2)}
                  </pre>
                </div>
              )}

              {violations.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Violación</TableHead>
                      <TableHead>Fecha</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {violations.map((v, i) => (
                      <TableRow key={i}>
                        <TableCell>{v.reason}</TableCell>
                        <TableCell>{v.created_at}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
