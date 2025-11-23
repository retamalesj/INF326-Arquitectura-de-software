from fastapi import APIRouter, Request
from utils.forward import forward
from config import URLS

router = APIRouter(prefix="/wikipedia-chatbot", tags=["Wikipedia"])

@router.get("/health")
async def gw_wiki_health(request: Request):
    return await forward("GET", f"{URLS['wikipedia']}/health", request)

@router.post("/chat-wikipedia")
async def gw_wiki_query(request: Request):
    return await forward("POST", f"{URLS['wikipedia']}/chat-wikipedia", request)
