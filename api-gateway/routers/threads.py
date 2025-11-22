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
