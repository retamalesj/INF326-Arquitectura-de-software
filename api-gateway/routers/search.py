from fastapi import APIRouter, Request
from utils.forward import forward
from config import URLS

router = APIRouter(prefix="/search", tags=["Search"])

# --- HEALTH CHECKS ---
@router.get("/health")
async def gw_search_health(request: Request):
    return await forward("GET", f"{URLS['search']}/api/healthz", request)

@router.get("/live")
async def gw_search_live(request: Request):
    return await forward("GET", f"{URLS['search']}/api/livez", request)


# --- BUSQUEDA DE MENSAJES ---
# Reenvia todos los filtros (q, user_id, type_, etc.)
@router.get("/messages")
async def gw_search_messages(request: Request):
    params = dict(request.query_params)
    return await forward("GET", f"{URLS['search']}/api/message/search_message", request, params=params)


# --- BUSQUEDA DE CANALES ---
@router.get("/channels")
async def gw_search_channels(request: Request):
    params = dict(request.query_params)
    return await forward("GET", f"{URLS['search']}/api/channel/search_channel", request, params=params)


# --- BUSQUEDA EN HILOS (THREADS) ---
@router.get("/threads/id/{thread_id}")
async def gw_search_threads_by_id(thread_id: int, request: Request):
    return await forward("GET", f"{URLS['search']}/api/threads/id/{thread_id}", request)

@router.get("/threads/author/{created_by}")
async def gw_search_threads_by_author(created_by: int, request: Request):
    return await forward("GET", f"{URLS['search']}/api/threads/author/{created_by}", request)

# Este lo cambiamos a dinámico para soportar start_date, end_date y futuros filtros
@router.get("/threads/daterange")
async def gw_search_threads_daterange(request: Request):
    params = dict(request.query_params)
    return await forward("GET", f"{URLS['search']}/api/threads/daterange", request, params=params)

@router.get("/threads/keyword/{keyword}")
async def gw_search_threads_keyword(keyword: str, request: Request):
    return await forward("GET", f"{URLS['search']}/api/threads/keyword/{keyword}", request)