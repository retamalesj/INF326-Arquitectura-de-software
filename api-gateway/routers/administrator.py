# moderation_admin_router.py
from fastapi import APIRouter, Request
from utils.forward import forward
from config import URLS

router = APIRouter(prefix="/admin", tags=["Moderation Admin"])

@router.get("/banned-users")
async def gw_admin_banned_users(request: Request):
    params = dict(request.query_params)
    return await forward("GET", f"{URLS['moderation']}/admin/banned-users", request, params=params)

@router.get("/users/{user_id}/violations")
async def gw_admin_user_violations(user_id: str, request: Request):
    params = dict(request.query_params)
    return await forward("GET", f"{URLS['moderation']}/admin/users/{user_id}/violations", request, params=params)

@router.put("/users/{user_id}/unban")
async def gw_admin_user_unban(user_id: str, request: Request):
    try: body = await request.json()
    except: body = {}
    return await forward("PUT", f"{URLS['moderation']}/admin/users/{user_id}/unban", request, body=body)

@router.get("/users/{user_id}/status")
async def gw_admin_user_status_full(user_id: str, request: Request):
    return await forward("GET", f"{URLS['moderation']}/admin/users/{user_id}/status", request)

@router.post("/users/{user_id}/ban")
async def gw_admin_user_ban(user_id: str, request: Request):
    body = await request.json()
    return await forward("POST", f"{URLS['moderation']}/admin/users/{user_id}/ban", request, body=body)