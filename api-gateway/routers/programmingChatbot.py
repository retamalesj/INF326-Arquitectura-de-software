from fastapi import APIRouter, Request
from utils.forward import forward
from config import URLS

router = APIRouter(prefix="/programming-chatbot", tags=["Chatbot de programación"])
"""
GET
/api/presence-gateway/chatbot/health
Health


POST
/api/presence-gateway/chatbot/chat
Chat
"""
@router.post("/chat")
async def gw_chatbot(request: Request):
    body = await request.json()
    return await forward("POST", f"{URLS['programming-chatbot']}/chat", request, body=body)