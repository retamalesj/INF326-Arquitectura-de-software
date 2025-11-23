from fastapi import APIRouter, Request
from utils.forward import forward
from config import URLS

router = APIRouter(prefix="/channels", tags=["Channels"])
"""
POST
/api/presence-gateway/channels/v1/channels/
Add Channel


GET
/api/presence-gateway/channels/v1/channels/
List Channels


GET
/api/presence-gateway/channels/v1/channels/{channel_id}
Read Channel


PUT
/api/presence-gateway/channels/v1/channels/{channel_id}
Modify Channel


DELETE
/api/presence-gateway/channels/v1/channels/{channel_id}
Remove Channel


POST
/api/presence-gateway/channels/v1/channels/{channel_id}/reactivate
Reactivate Channel


GET
/api/presence-gateway/channels/v1/channels/{channel_id}/basic
Read Channel Basic Info


GET
/api/presence-gateway/channels/v1/channels/{channel_id}/status
Check Channel Status


POST
/api/presence-gateway/channels/v1/members/
Add User To Channel


DELETE
/api/presence-gateway/channels/v1/members/
Remove User From Channel


GET
/api/presence-gateway/channels/v1/members/{user_id}
Read Channels By Member


GET
/api/presence-gateway/channels/v1/members/owner/{owner_id}
Read Channels By Owner


GET
/api/presence-gateway/channels/v1/members/channel/{channel_id}
Read Channel Member Ids


GET
/api/presence-gateway/channels/
Root


GET
/api/presence-gateway/channels/health
Health Check



"""
# Health Check del servicio de canales
@router.get("/health")
async def gw_channels_health(request: Request):
    return await forward("GET", f"{URLS['channels']}/health", request)

# Crear canal
@router.post("")
async def gw_channels_create(request: Request):
    body = await request.json()
    return await forward("POST", f"{URLS['channels']}/v1/channels/", request, body=body)

# Listar canales
@router.get("")
async def gw_channels_list(request: Request):
    params = dict(request.query_params)
    return await forward("GET", f"{URLS['channels']}/v1/channels/", request, params=params)

# Obtener canal por ID
@router.get("/{channel_id}")
async def gw_channels_get(channel_id: str, request: Request):
    return await forward("GET", f"{URLS['channels']}/v1/channels/{channel_id}", request)

# Modificar canal
@router.put("/{channel_id}")
async def gw_channels_put(channel_id: str, request: Request):
    body = await request.json()
    return await forward("PUT", f"{URLS['channels']}/v1/channels/{channel_id}", request, body=body)

# Desactivar canal
@router.delete("/{channel_id}")
async def gw_channels_delete(channel_id: str, request: Request):
    return await forward("DELETE", f"{URLS['channels']}/v1/channels/{channel_id}", request)

# Reactivar canal
@router.post("/{channel_id}/reactivate")
async def gw_channels_reactivate(channel_id: str, request: Request):
    return await forward("POST", f"{URLS['channels']}/v1/channels/{channel_id}/reactivate", request)

# Info básica
@router.get("/{channel_id}/basic")
async def gw_channels_basic(channel_id: str, request: Request):
    return await forward("GET", f"{URLS['channels']}/v1/channels/{channel_id}/basic", request)

# Estado del canal
@router.get("/{channel_id}/status")
async def gw_channels_status(channel_id: str, request: Request):
    return await forward("GET", f"{URLS['channels']}/v1/channels/{channel_id}/status", request)

