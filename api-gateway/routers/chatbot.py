from fastapi import APIRouter, Request
from utils.forward import forward
from config import URLS

router = APIRouter(prefix="/chatbot", tags=["Chatbot"])
"""
GET
/api/presence-gateway/chatbot/health
Health


POST
/api/presence-gateway/chatbot/chat
Chat
"""
@router.post("")
async def gw_chatbot(request: Request):
    body = await request.json()
    return await forward("POST", f"{URLS['chatbot']}/ask", request, body=body)