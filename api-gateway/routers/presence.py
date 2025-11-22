from fastapi import APIRouter, Request
from utils.forward import forward
from config import URLS

router = APIRouter(prefix="/presence", tags=["Presence"])
"""
GET
/api/presence-gateway/health
Health


GET
/api/presence-gateway/presence/api/v1.0.0/presence/health
Verifica el estado operativo del servicio de presencia y la conexión a MongoDB


POST
/api/presence-gateway/presence/api/v1.0.0/presence
Registrar conexión a un usuario.


GET
/api/presence-gateway/presence/api/v1.0.0/presence
Lista todos los usuarios con su estado de presencia


GET
/api/presence-gateway/presence/api/v1.0.0/presence/stats
Devuelve estadísticas agregadas de presencia, incluyendo usuarios online y offline


GET
/api/presence-gateway/presence/api/v1.0.0/presence/{userId}
Obtiene la información de presencia de un usuario específico por su ID


PATCH
/api/presence-gateway/presence/api/v1.0.0/presence/{userId}
Actualiza el estado de un usuario (online/offline) o actualiza su última vez visto


DELETE
/api/presence-gateway/presence/api/v1.0.0/presence/{userId}
Elimina la información de presencia de un usuario de la base de datos

"""
#--------------------------PRESENCIA--------------------------
@router.get("") # TODO: falta agregar filtros
async def gw_presence_list(request: Request):
    return await forward("GET", f"{URLS['presence']}/presence", request)

@router.patch("/{userId}")
async def gw_presence_patch(userId: str, request: Request):
    body = await request.json()
    return await forward("PATCH", f"{URLS['presence']}/presence/{userId}", request, body=body)
