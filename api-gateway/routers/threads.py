from fastapi import APIRouter, Request, Path
from utils.forward import forward
from config import URLS

router = APIRouter(prefix="/threads", tags=["Threads"])

# -------------------------
# Listar todos los hilos
# GET /threads/
# -------------------------
@router.get("/")
async def list_threads(request: Request):
    return await forward("GET", f"{URLS['threads']}/threads", request)


# -------------------------
# Crear un hilo
# POST /threads/
# -------------------------
@router.post("/")
async def create_thread(request: Request):
    return await forward("POST", f"{URLS['threads']}/threads", request)


# -------------------------
# Buscar hilo por ID
# GET /threads/{thread_id}
# -------------------------
@router.get("/{thread_id}")
async def get_thread(thread_id: str = Path(..., description="ID del hilo"), request: Request = None):
    return await forward("GET", f"{URLS['threads']}/threads/{thread_id}", request)


# -------------------------
# Messages dentro de un hilo
# POST /threads/{thread_id}/messages
# GET /threads/{thread_id}/messages
# PUT /threads/{thread_id}/messages/{message_id}
# DELETE /threads/{thread_id}/messages/{message_id}
# -------------------------
@router.post("/{thread_id}/messages")
async def create_message(thread_id: str, request: Request):
    return await forward("POST", f"{URLS['threads']}/threads/{thread_id}/messages", request)

@router.get("/{thread_id}/messages")
async def list_messages(thread_id: str, request: Request):
    return await forward("GET", f"{URLS['threads']}/threads/{thread_id}/messages", request)

@router.put("/{thread_id}/messages/{message_id}")
async def update_message(thread_id: str, message_id: str, request: Request):
    return await forward("PUT", f"{URLS['threads']}/threads/{thread_id}/messages/{message_id}", request)

@router.delete("/{thread_id}/messages/{message_id}")
async def delete_message(thread_id: str, message_id: str, request: Request):
    return await forward("DELETE", f"{URLS['threads']}/threads/{thread_id}/messages/{message_id}", request)
    
# -------------------------
# Listar hilos por Canal
# GET /threads/by-channel?channel_id=XYZ
# -------------------------
@router.get("/by-channel")
async def get_threads_by_channel(channel_id: str, request: Request):
    """
    Devuelve todos los hilos asociados a un canal
    Parámetros:
      - channel_id (query): ID del canal
    """
    # el microservicio original usa /channel/get_threads
    url = f"{URLS['threads']}/channel/get_threads?channel_id={channel_id}"
    return await forward("GET", url, request)