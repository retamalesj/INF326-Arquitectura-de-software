from contextlib import asynccontextmanager
from fastapi import FastAPI
import httpx
from fastapi.middleware.cors import CORSMiddleware
from routers import presence, users, programmingChatbot, wikipedia, moderation, threads, search, files, messages, channels, members, calculator
from config import API_PREFIX
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

# HEALTH DEL GATEWAY
@app.get(f"{API_PREFIX}/health")
async def health():
    return {"status": "OK", "message": "API Gateway operativo"}

app.include_router(presence, prefix=API_PREFIX)
app.include_router(users, prefix=API_PREFIX)
app.include_router(channels, prefix=API_PREFIX)
app.include_router(members, prefix=API_PREFIX)
app.include_router(moderation, prefix=API_PREFIX)
app.include_router(search, prefix=API_PREFIX)
app.include_router(threads, prefix=API_PREFIX)
app.include_router(files, prefix=API_PREFIX)
app.include_router(messages, prefix=API_PREFIX)
app.include_router(wikipedia, prefix=API_PREFIX)
app.include_router(programmingChatbot, prefix=API_PREFIX)
app.include_router(calculator , prefix=API_PREFIX)