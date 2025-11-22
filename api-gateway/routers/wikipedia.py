from fastapi import APIRouter, Request
from utils.forward import forward
from config import URLS

router = APIRouter(prefix="/wiki", tags=["Wikipedia"])
"""
GET
/api/presence-gateway/wikipedia/health
Health Check


POST
/api/presence-gateway/wikipedia/chat-wikipedia
Chat Wikipedia
"""
@router.get("")
async def gw_wiki(q: str, request: Request):
    return await forward("GET", f"{URLS['wikipedia']}/chat", request, params={"q": q})
