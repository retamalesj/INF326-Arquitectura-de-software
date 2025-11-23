from fastapi import APIRouter, Request
from utils.forward import forward
from config import URLS

router = APIRouter(prefix="/moderation", tags=["Moderation"])

# --- HEALTH ---

@router.get("/health")
async def gw_moderation_health(request: Request):
    return await forward("GET", f"{URLS['moderation']}/health", request)

@router.get("/ping")
async def gw_moderation_ping(request: Request):
    return await forward("GET", f"{URLS['moderation']}/ping", request)


# --- CORE MODERATION ---

@router.post("/check")
async def gw_moderation_check(request: Request):
    body = await request.json()
    return await forward("POST", f"{URLS['moderation']}/moderation/check", request, body=body)

@router.post("/analyze")
async def gw_moderation_analyze(request: Request):
    body = await request.json()
    return await forward("POST", f"{URLS['moderation']}/moderation/analyze", request, body=body)

@router.get("/status/{user_id}/{channel_id}")
async def gw_moderation_user_status(user_id: str, channel_id: str, request: Request):
    return await forward("GET", f"{URLS['moderation']}/moderation/status/{user_id}/{channel_id}", request)


# --- BLACKLIST (PALABRAS PROHIBIDAS) ---

@router.get("/blacklist/words")
async def gw_blacklist_list(request: Request):
    params = dict(request.query_params)
    return await forward("GET", f"{URLS['moderation']}/blacklist/words", request, params=params)

@router.post("/blacklist/words")
async def gw_blacklist_add(request: Request):
    body = await request.json()
    return await forward("POST", f"{URLS['moderation']}/blacklist/words", request, body=body)

@router.delete("/blacklist/words/{word_id}")
async def gw_blacklist_delete(word_id: str, request: Request):
    return await forward("DELETE", f"{URLS['moderation']}/blacklist/words/{word_id}", request)

@router.get("/blacklist/stats")
async def gw_blacklist_stats(request: Request):
    return await forward("GET", f"{URLS['moderation']}/blacklist/stats", request)

@router.post("/blacklist/refresh-cache")
async def gw_blacklist_refresh(request: Request):
    return await forward("POST", f"{URLS['moderation']}/blacklist/refresh-cache", request)


# --- ADMIN y BANS ---

@router.get("/admin/banned-users")
async def gw_admin_banned_users(request: Request):
    params = dict(request.query_params)
    return await forward("GET", f"{URLS['moderation']}/admin/banned-users", request, params=params)

@router.get("/admin/users/{user_id}/violations")
async def gw_admin_user_violations(user_id: str, request: Request):
    params = dict(request.query_params)
    return await forward("GET", f"{URLS['moderation']}/admin/users/{user_id}/violations", request, params=params)

@router.put("/admin/users/{user_id}/unban")
async def gw_admin_user_unban(user_id: str, request: Request):
    # Intentamos leer body si existe, si no enviamos vacío.
    try:
        body = await request.json()
    except:
        body = {} 
    return await forward("PUT", f"{URLS['moderation']}/admin/users/{user_id}/unban", request, body=body)

@router.get("/admin/users/{user_id}/status")
async def gw_admin_user_status_full(user_id: str, request: Request):
    return await forward("GET", f"{URLS['moderation']}/admin/users/{user_id}/status", request)

@router.post("/admin/users/{user_id}/ban")
async def gw_admin_user_ban(user_id: str, request: Request):
    body = await request.json()
    return await forward("POST", f"{URLS['moderation']}/admin/users/{user_id}/ban", request, body=body)