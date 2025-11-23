'use client'

import { useEffect, useState } from 'react'
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
import { H1, P } from '@/components/ui/typography'
import { toast } from 'sonner'
import { ChatBubble } from '../chats/wikichat'

const API_PREFIX = '/api/presence-gateway/moderation/api/v1'

interface BlacklistWord {
  id: string
  word: string
}

interface BannedUser {
  id: string
  username: string
  strikes: number
}

// MODO DEBUG: si es true, usamos datos de prueba
const DEBUG = true

export const ModerationAdminPage = () => {
  const [blacklist, setBlacklist] = useState<BlacklistWord[]>([])
  const [newWord, setNewWord] = useState('')
  const [bannedUsers, setBannedUsers] = useState<BannedUser[]>([])

  // ------------------- Fetch Blacklist -------------------
  const fetchBlacklist = async () => {
    if (DEBUG) {
      setBlacklist([
        { id: '1', word: 'spam' },
        { id: '2', word: 'troll' },
        { id: '3', word: 'malware' },
      ])
      return
    }
    try {
      const res = await fetch(`${API_PREFIX}/blacklist/words`)
      const data = await res.json()
      setBlacklist(data)
    } catch (err) {
      console.error(err)
      toast.error('Error cargando blacklist')
    }
  }

  // ------------------- Add Word -------------------
  const addWord = async () => {
    if (DEBUG) {
      setBlacklist([
        ...blacklist,
        { id: Math.random().toString(), word: newWord },
      ])
      setNewWord('')
      toast.success('Palabra agregada (debug)')
      return
    }
    try {
      const res = await fetch(`${API_PREFIX}/blacklist/words`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: newWord }),
      })
      if (!res.ok) throw new Error('Error agregando palabra')
      setNewWord('')
      fetchBlacklist()
      toast.success('Palabra agregada')
    } catch (err) {
      console.error(err)
      toast.error('No se pudo agregar palabra')
    }
  }

  // ------------------- Delete Word -------------------
  const deleteWord = async (id: string) => {
    if (DEBUG) {
      setBlacklist(blacklist.filter((w) => w.id !== id))
      toast.success('Palabra eliminada (debug)')
      return
    }
    try {
      const res = await fetch(`${API_PREFIX}/blacklist/words/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Error eliminando palabra')
      fetchBlacklist()
      toast.success('Palabra eliminada')
    } catch (err) {
      console.error(err)
      toast.error('No se pudo eliminar palabra')
    }
  }

  // ------------------- Fetch Banned Users -------------------
  const fetchBannedUsers = async () => {
    if (DEBUG) {
      setBannedUsers([
        { id: 'u1', username: 'troll123', strikes: 3 },
        { id: 'u2', username: 'spammer', strikes: 5 },
      ])
      return
    }
    try {
      const res = await fetch(`${API_PREFIX}/admin/banned-users`)
      const data = await res.json()
      setBannedUsers(data)
    } catch (err) {
      console.error(err)
      toast.error('Error cargando usuarios baneados')
    }
  }

  // ------------------- Unban User -------------------
  const unbanUser = async (userId: string) => {
    if (DEBUG) {
      setBannedUsers(bannedUsers.filter((u) => u.id !== userId))
      toast.success('Usuario desbaneado (debug)')
      return
    }
    try {
      const res = await fetch(`${API_PREFIX}/admin/users/${userId}/unban`, {
        method: 'PUT',
      })
      if (!res.ok) throw new Error('Error desbaneando usuario')
      fetchBannedUsers()
      toast.success('Usuario desbaneado')
    } catch (err) {
      console.error(err)
      toast.error('No se pudo desbanear usuario')
    }
  }

  useEffect(() => {
    fetchBlacklist()
    fetchBannedUsers()
  }, [])

  return (
    <div className="space-y-8 bg-white min-h-full p-6">
      <H1 className="text-center text-blue-900">
        Administración de Moderación
      </H1>

      {/* Blacklist */}
      <Card className="shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Blacklist de Palabras</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Nueva palabra"
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
            />
            <Button
              className="bg-blue-700 text-white hover:bg-blue-800"
              onClick={addWord}
            >
              Agregar
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Palabra</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blacklist.map((w) => (
                <TableRow key={w.id}>
                  <TableCell>{w.word}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteWord(w.id)}
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

      {/* Usuarios Baneados */}
      <Card className="shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Usuarios Baneados</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Strikes</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bannedUsers.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.username}</TableCell>
                  <TableCell>{u.strikes}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      className="bg-green-600 text-white hover:bg-green-700"
                      onClick={() => unbanUser(u.id)}
                    >
                      Desbanear
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <ChatBubble />
        </CardContent>
      </Card>
    </div>
  )
}
