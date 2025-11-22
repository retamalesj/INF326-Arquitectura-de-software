from fastapi import APIRouter, Request
from utils.forward import forward
from config import URLS

router = APIRouter(prefix="/members", tags=["Channels - Members"])

# Agregar usuario a un canal
@router.post("")
async def gw_members_add(request: Request):
    body = await request.json()
    # Asumo que members también está bajo /v1
    return await forward("POST", f"{URLS['channels']}/v1/members/", request, body=body)

# Eliminar usuario de canal
@router.delete("")
async def gw_members_remove(request: Request):
    body = await request.json()
    return await forward("DELETE", f"{URLS['channels']}/v1/members/", request, body=body)

# Obtener canales de un usuario
@router.get("/{user_id}")
async def gw_members_user_channels(user_id: str, request: Request):
    return await forward("GET", f"{URLS['channels']}/v1/members/{user_id}", request)

# Obtener canales por owner
@router.get("/owner/{owner_id}")
async def gw_members_by_owner(owner_id: str, request: Request):
    return await forward("GET", f"{URLS['channels']}/v1/members/owner/{owner_id}", request)

# Obtener miembros de un canal
@router.get("/channel/{channel_id}")
async def gw_members_by_channel(channel_id: str, request: Request):
    return await forward("GET", f"{URLS['channels']}/v1/members/channel/{channel_id}", request)