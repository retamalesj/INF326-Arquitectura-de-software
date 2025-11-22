from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, HTTPException
import httpx
from fastapi.middleware.cors import CORSMiddleware

# --- CONFIGURACIÓN Y LIFESPAN ---

# Usamos lifespan para gestionar la apertura y cierre del cliente HTTP de forma eficiente
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Al iniciar la app: creamos el cliente
    app.state.client = httpx.AsyncClient(timeout=10.0)
    yield
    # Al apagar la app: cerramos el cliente
    await app.state.client.aclose()

app = FastAPI(
    title="API Gateway - INF326",
    description="Gateway que une todos los microservicios.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# PREFIJO
API_PREFIX = "/api/presence-gateway"

# URLs (Idealmente deberían venir de variables de entorno)
URLS = {
    "presence": "https://presence-134-199-176-197.nip.io/api/v1.0.0",
    # CORREGIDO: Se apunta a la raíz porque el Swagger indica rutas como /v1/... o /health directamente
    "users": "https://users.inf326.nursoft.dev", 
    "channels": "https://channel-api.inf326.nur.dev",
    "messages": "https://messages-service.kroder.dev/api",
    "moderation": "https://moderation.inf326.nur.dev/api/v1",
    "search": "https://searchservice.inf326.nursoft.dev/api",
    "wikipedia": "http://wikipedia-chatbot-134-199-176-197.nip.io/api",
    "files": "http://file-service-134-199-176-197.nip.io/api",
    "threads": "https://demo.inf326.nur.dev/api",
    "chatbot": "https://chatbotprogra.inf326.nursoft.dev/api",
}

# --- FUNCIÓN FORWARD CORREGIDA ---
async def forward(method: str, url: str, request: Request, body=None, params=None):
    client: httpx.AsyncClient = request.app.state.client
    
    # 1. Copiar y limpiar headers
    headers = dict(request.headers)
    headers.pop("host", None)
    headers.pop("content-length", None)
    headers.pop("content-type", None) # httpx lo gestiona

    # 2. Limpieza de URL (manteniendo protocolo)
    if "://" in url:
        protocol, path = url.split("://", 1)
        path = path.replace("//", "/")
        url = f"{protocol}://{path}"

    try:
        r = await client.request(
            method,
            url,
            json=body,
            params=params,
            headers=headers,
            follow_redirects=True
        )

        if r.status_code >= 400:
            # Intentar pasar el detalle del error original
            try:
                detail = r.json()
            except:
                detail = r.text
            raise HTTPException(status_code=r.status_code, detail=detail)

        try:
            return r.json()
        except Exception:
            return r.text # Devuelve texto si no es JSON

    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Gateway Timeout: El microservicio tardó demasiado.")
    except httpx.RequestError as e:
        raise HTTPException(status_code=502, detail=f"Bad Gateway: Error de conexión. {str(e)}")


# HEALTH DEL GATEWAY
@app.get(f"{API_PREFIX}/health")
async def health():
    return {"status": "OK", "message": "API Gateway operativo"}


#--------------------------PRESENCIA--------------------------
@app.get(f"{API_PREFIX}/presence")
async def gw_presence_list(request: Request):
    return await forward("GET", f"{URLS['presence']}/presence", request)

@app.patch(f"{API_PREFIX}/presence/{{userId}}")
async def gw_presence_patch(userId: str, request: Request):
    body = await request.json()
    return await forward("PATCH", f"{URLS['presence']}/presence/{userId}", request, body=body)


#--------------------------USUARIOS (CORREGIDO)--------------------------

# Health check del servicio users
@app.get(f"{API_PREFIX}/users/health")
async def gw_users_health(request: Request):
    return await forward("GET", f"{URLS['users']}/health", request)

# Registrar usuario
@app.post(f"{API_PREFIX}/users")
async def gw_users_create(request: Request):
    body = await request.json()
    return await forward("POST", f"{URLS['users']}/v1/users/register", request, body=body)

# Login
@app.post(f"{API_PREFIX}/users/login")
async def gw_users_login(request: Request):
    body = await request.json()
    return await forward("POST", f"{URLS['users']}/v1/auth/login", request, body=body)

# Leer usuario autenticado
@app.get(f"{API_PREFIX}/users/me")
async def gw_users_me(request: Request):
    return await forward("GET", f"{URLS['users']}/v1/users/me", request)

# Actualizar perfil propio
@app.patch(f"{API_PREFIX}/users/me")
async def gw_users_update_me(request: Request):
    body = await request.json()
    return await forward("PATCH", f"{URLS['users']}/v1/users/me", request, body=body)


#--------------------------CANALES--------------------------

# Health Check del servicio de canales
@app.get(f"{API_PREFIX}/channels/health")
async def gw_channels_health(request: Request):
    return await forward("GET", f"{URLS['channels']}/health", request)

# Crear canal
@app.post(f"{API_PREFIX}/channels")
async def gw_channels_create(request: Request):
    body = await request.json()
    return await forward("POST", f"{URLS['channels']}/v1/channels/", request, body=body)

# Listar canales
@app.get(f"{API_PREFIX}/channels")
async def gw_channels_list(request: Request):
    return await forward("GET", f"{URLS['channels']}/v1/channels/", request)

# Obtener canal por ID
@app.get(f"{API_PREFIX}/channels/{{channel_id}}")
async def gw_channels_get(channel_id: str, request: Request):
    return await forward("GET", f"{URLS['channels']}/v1/channels/{channel_id}", request)

# Modificar canal
@app.put(f"{API_PREFIX}/channels/{{channel_id}}")
async def gw_channels_put(channel_id: str, request: Request):
    body = await request.json()
    return await forward("PUT", f"{URLS['channels']}/v1/channels/{channel_id}", request, body=body)

# Desactivar canal
@app.delete(f"{API_PREFIX}/channels/{{channel_id}}")
async def gw_channels_delete(channel_id: str, request: Request):
    return await forward("DELETE", f"{URLS['channels']}/v1/channels/{channel_id}", request)

# Reactivar canal
@app.post(f"{API_PREFIX}/channels/{{channel_id}}/reactivate")
async def gw_channels_reactivate(channel_id: str, request: Request):
    return await forward("POST", f"{URLS['channels']}/v1/channels/{channel_id}/reactivate", request)

# Info básica
@app.get(f"{API_PREFIX}/channels/{{channel_id}}/basic")
async def gw_channels_basic(channel_id: str, request: Request):
    return await forward("GET", f"{URLS['channels']}/v1/channels/{channel_id}/basic", request)

# Estado del canal
@app.get(f"{API_PREFIX}/channels/{{channel_id}}/status")
async def gw_channels_status(channel_id: str, request: Request):
    return await forward("GET", f"{URLS['channels']}/v1/channels/{channel_id}/status", request)


#--------------------------MIEMBROS (Canales)--------------------------

# Agregar usuario a un canal
@app.post(f"{API_PREFIX}/members")
async def gw_members_add(request: Request):
    body = await request.json()
    # Asumo que members también está bajo /v1
    return await forward("POST", f"{URLS['channels']}/v1/members/", request, body=body)

# Eliminar usuario de canal
@app.delete(f"{API_PREFIX}/members")
async def gw_members_remove(request: Request):
    body = await request.json()
    return await forward("DELETE", f"{URLS['channels']}/v1/members/", request, body=body)

# Obtener canales de un usuario
@app.get(f"{API_PREFIX}/members/{{user_id}}")
async def gw_members_user_channels(user_id: str, request: Request):
    return await forward("GET", f"{URLS['channels']}/v1/members/{user_id}", request)

# Obtener canales por owner
@app.get(f"{API_PREFIX}/members/owner/{{owner_id}}")
async def gw_members_by_owner(owner_id: str, request: Request):
    return await forward("GET", f"{URLS['channels']}/v1/members/owner/{owner_id}", request)

# Obtener miembros de un canal
@app.get(f"{API_PREFIX}/members/channel/{{channel_id}}")
async def gw_members_by_channel(channel_id: str, request: Request):
    return await forward("GET", f"{URLS['channels']}/v1/members/channel/{channel_id}", request)


#--------------------------MENSAJES--------------------------
@app.post(f"{API_PREFIX}/messages")
async def gw_send_message(request: Request):
    body = await request.json()
    return await forward("POST", f"{URLS['messages']}/messages", request, body=body)


#--------------------------MODERACIÓN--------------------------
@app.post(f"{API_PREFIX}/moderation/check")
async def gw_moderation_check(request: Request):
    body = await request.json()
    return await forward("POST", f"{URLS['moderation']}/moderate", request, body=body)


#--------------------------BUSQUEDA--------------------------
@app.get(f"{API_PREFIX}/search")
async def gw_search(q: str, request: Request):
    return await forward("GET", f"{URLS['search']}/search", request, params={"q": q})


#--------------------------WIKIPEDIA BOT--------------------------
@app.get(f"{API_PREFIX}/wiki")
async def gw_wiki(q: str, request: Request):
    return await forward("GET", f"{URLS['wikipedia']}/chat", request, params={"q": q})


#--------------------------ARCHIVOS--------------------------
@app.post(f"{API_PREFIX}/files/upload")
async def gw_files_upload(request: Request):
    body = await request.json()
    return await forward("POST", f"{URLS['files']}/upload", request, body=body)


#--------------------------HILOS--------------------------
@app.get(f"{API_PREFIX}/threads")
async def gw_threads(request: Request):
    return await forward("GET", f"{URLS['threads']}/threads", request)


#--------------------------CHATBOT PROGRAMACION--------------------------
@app.post(f"{API_PREFIX}/chatbot")
async def gw_chatbot(request: Request):
    body = await request.json()
    return await forward("POST", f"{URLS['chatbot']}/ask", request, body=body)