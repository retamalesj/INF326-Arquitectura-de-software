from fastapi import APIRouter, Request
from utils.forward import forward
from config import URLS

router = APIRouter(prefix="/presence", tags=["Presence"])

# Health
@router.get("/health")
async def gw_presence_health(request: Request):
    return await forward("GET", f"{URLS['presence']}/presence/health", request)

# Registrar conexión a un usuario
@router.post("")
async def gw_presence_create(request: Request):
    try:
        body = await request.json()
    except:
        body = None
    return await forward("POST", f"{URLS['presence']}/presence", request, body=body)

# Listar todos los usuarios (se puede agregar filtros por query params)
@router.get("")
async def gw_presence_list(request: Request):
    # Leer params del query string
    params = dict(request.query_params)
    return await forward("GET", f"{URLS['presence']}/presence", request, params=params)

# Obtener estadísticas de presencia
@router.get("/stats")
async def gw_presence_stats(request: Request):
    return await forward("GET", f"{URLS['presence']}/presence/stats", request)

# Obtener la información de un usuario por ID
@router.get("/{userId}")
async def gw_presence_get(userId: str, request: Request):
    return await forward("GET", f"{URLS['presence']}/presence/{userId}", request)

# Actualizar el estado de un usuario
@router.patch("/{userId}")
async def gw_presence_patch(userId: str, request: Request):
    try:
        body = await request.json()
    except:
        body = None
    return await forward("PATCH", f"{URLS['presence']}/presence/{userId}", request, body=body)

# Eliminar la información de un usuario
@router.delete("/{userId}")
async def gw_presence_delete(userId: str, request: Request):
    return await forward("DELETE", f"{URLS['presence']}/presence/{userId}", request)