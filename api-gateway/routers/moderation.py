from fastapi import APIRouter, Request
from utils.forward import forward
from config import URLS

router = APIRouter(prefix="/moderation", tags=["Moderation"])

"""
GET
/api/presence-gateway/moderation/api/v1/health
Health Check


GET
/api/presence-gateway/moderation/api/v1/ping
Ping


POST
/api/presence-gateway/moderation/api/v1/moderation/check
Moderar Mensaje


POST
/api/presence-gateway/moderation/api/v1/moderation/analyze
Analizar Texto


GET
/api/presence-gateway/moderation/api/v1/moderation/status/{user_id}/{channel_id}
Estado de Usuario


POST
/api/presence-gateway/moderation/api/v1/blacklist/words
Agregar Palabra


GET
/api/presence-gateway/moderation/api/v1/blacklist/words
Listar Palabras


DELETE
/api/presence-gateway/moderation/api/v1/blacklist/words/{word_id}
Eliminar Palabra


GET
/api/presence-gateway/moderation/api/v1/blacklist/stats
Estadísticas


POST
/api/presence-gateway/moderation/api/v1/blacklist/refresh-cache
Refrescar Cache


GET
/api/presence-gateway/moderation/api/v1/admin/banned-users
Usuarios Baneados


GET
/api/presence-gateway/moderation/api/v1/admin/users/{user_id}/violations
Historial de Violaciones


PUT
/api/presence-gateway/moderation/api/v1/admin/users/{user_id}/unban
Desbanear Usuario


GET
/api/presence-gateway/moderation/api/v1/admin/users/{user_id}/status
Estado Completo de Usuario


POST
/api/presence-gateway/moderation/api/v1/admin/users/{user_id}/reset-strikes
Resetear Strikes


GET
/api/presence-gateway/moderation/api/v1/admin/channels/{channel_id}/stats
Estadísticas de Canal


POST
/api/presence-gateway/moderation/api/v1/admin/maintenance/expire-bans
Expirar Bans


GET
/api/presence-gateway/moderation/
Root



"""
@router.post("/check")
async def gw_moderation_check(request: Request):
    body = await request.json()
    return await forward("POST", f"{URLS['moderation']}/moderate", request, body=body)

