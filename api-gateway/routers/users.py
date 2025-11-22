from fastapi import APIRouter, Request
from utils.forward import forward
from config import URLS

router = APIRouter(prefix="/users", tags=["Users"])

# Health check del servicio users
@router.get("/health")
async def gw_users_health(request: Request):
    return await forward("GET", f"{URLS['users']}/health", request)

# Registrar usuario
@router.post("")
async def gw_users_create(request: Request):
    body = await request.json()
    return await forward("POST", f"{URLS['users']}/v1/users/register", request, body=body)

# Login
@router.post("/login")
async def gw_users_login(request: Request):
    body = await request.json()
    return await forward("POST", f"{URLS['users']}/v1/auth/login", request, body=body)

# Leer usuario autenticado
@router.get("/me")
async def gw_users_me(request: Request):
    return await forward("GET", f"{URLS['users']}/v1/users/me", request)

# Actualizar perfil propio
@router.patch("/me")
async def gw_users_update_me(request: Request):
    body = await request.json()
    return await forward("PATCH", f"{URLS['users']}/v1/users/me", request, body=body)