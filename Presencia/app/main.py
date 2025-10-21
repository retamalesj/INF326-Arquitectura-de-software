from fastapi import FastAPI, HTTPException, Body, APIRouter
from pydantic import BaseModel, model_validator
from datetime import datetime, timedelta
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorClient
from enum import Enum

from .events import Emit

app = FastAPI(
    title="Servicio de Presencia",
    description="API para registrar, actualizar y consultar el estado de conexión de los usuarios.",
    version="0.0.1"
)

router_v1 = APIRouter(prefix="/api/v1.0.0", tags=["v1.0.0 - Servicio de presencia"])

class StatusEnum(str, Enum):
    online = "online"
    offline = "offline"

class DeviceEnum(str, Enum):
    web = "web"
    mobile = "mobile"
    desktop = "desktop"
    unknown = "unknown"

class UserPresence(BaseModel):
    id: str
    userId: str
    device: DeviceEnum
    status: StatusEnum
    connectedAt: datetime
    lastSeen: datetime

    def __init__(self, **kargs):
        if "_id" in kargs:
            kargs["id"] = str(kargs["_id"])
        BaseModel.__init__(self, **kargs)

class UserConnection(BaseModel):
    userId: str
    device: Optional[DeviceEnum] = DeviceEnum.unknown
    ip: Optional[str] = None

# Duda a seguir con respecto de heartbeat. Tal vez sea necesario otra manera.
class UserStatusUpdate(BaseModel):
    status: Optional[StatusEnum] = None
    heartbeat: Optional[bool] = False

    @model_validator(mode="after")
    def check_at_least_one(cls, model):
        if model.status is None and not model.heartbeat:
            raise ValueError("Debe enviarse al menos 'status' o 'heartbeat'")
        return model

MONGO_URI = "mongodb://mongodb_presencia:27017"
DB_NAME = "presence_db"
COLLECTION_NAME = "presences"

client = AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]
presences_collection  = db[COLLECTION_NAME]

HEARTBEAT_TIMEOUT = timedelta(seconds=60) # Tiempo máximo sin actualización antes de marcar offline

emit_events = Emit()

async def mark_offline_if_inactive(user):
    last_seen = user.get("lastSeen")
    if last_seen:
        diff = datetime.utcnow() - last_seen
        if diff > HEARTBEAT_TIMEOUT and user["status"] != StatusEnum.offline.value:
            status_offline: StatusEnum = StatusEnum.offline
            await presences_collection.update_one({"userId": user["userId"] }, {"$set": {"status": status_offline.value}})
            await emit_events.send(user["userId"], status_offline.value, { "status": status_offline.value })

@router_v1.get("/presence/health", summary="Verifica el estado operativo del servicio de presencia y la conexión a MongoDB")
async def health_check():
    try:
        await db.command("ping")
        return {
            "status": "OK",
            "message": "Servicio operativo"
        }
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Error de conexión con MongoDB: {str(e)}")

@router_v1.post("/presence", summary="Registrar conexión a un usuario.")
async def register_presence(
    data: UserConnection = Body(
        openapi_examples={
            "from_web": {
                "summary": "Conexión desde la web",
                "description": "Usuario conectado desde el portal web.",
                "value": {"userId": "12345", "device": "web", "ip": "192.168.1.1"}
            },
            "from_mobile": {
                "summary": "Conexión desde móvil",
                "description": "Usuario conectado desde la aplicación móvil.",
                "value": {"userId": "67890", "device": "mobile", "ip": "10.0.0.5"}
            },
            "without_device": {
                "summary": "Dispositivo no especificado",
                "description": "Usuario conectado sin indicar dispositivo.",
                "value": {"userId": "24680"}
            },
        },
    )
):
    now = datetime.utcnow()
    status_online: StatusEnum = StatusEnum.online

    presence_data = {
        "userId": data.userId,
        "device": data.device,
        "status": status_online.value,
        "connectedAt": now.isoformat(),
        "lastSeen": now.isoformat()
    }

    await presences_collection.update_one(
        {"userId": data.userId},
        {"$set": presence_data},
        upsert=True
    )

    await emit_events.send(data.userId, status_online.value, presence_data)

    return {
        "status": "OK",
        "message": "",
        "data": presence_data
    }

@router_v1.get("/presence", summary="Lista todos los usuarios con su estado de presencia")
async def list_users(status: Optional[StatusEnum] = None):
    base_filter = {}
    if status:
        base_filter["status"] = status.value

    users = await presences_collection.find(base_filter).to_list(length=None)

    return {
        "status": "OK",
        "message": "Usuarios listados correctamente",
        "data": {
            "total_users": len(users),
            "users": [UserPresence(**user) for user in users]
        }
    }    

@router_v1.get("/presence/stats", summary="Devuelve estadísticas agregadas de presencia, incluyendo usuarios online y offline")
async def get_presence_stats():
    online_count = await presences_collection.count_documents({"status": StatusEnum.online.value})
    offline_count = await presences_collection.count_documents({"status": StatusEnum.offline.value})
    total = online_count + offline_count

    return {
        "status": "OK",
        "message": "Estadísticas de presencia obtenidas correctamente",
        "data": {
            "total": total,
            "online": online_count,
            "offline": offline_count
        }
    }

@router_v1.get("/presence/{userId}", summary="Obtiene la información de presencia de un usuario específico por su ID")
async def get_user_presence(userId: str):
    user = await presences_collection.find_one({ "userId": userId })
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    return {
        "status": "OK",
        "message": "Usuario encontrado correctamente",
        "data": UserPresence(**user)
    }

@router_v1.patch("/presence/{userId}", summary="Actualiza el estado de un usuario (online/offline) o actualiza su última vez visto")
async def update_presence(
    userId: str,
    update: UserStatusUpdate = Body(
        openapi_examples={
            "set_offline": {
                "summary": "Cambiar estado a offline",
                "description": "El usuario se desconecta explícitamente.",
                "value": {"status": "offline"}
            },
            "set_online": {
                "summary": "Cambiar estado a online",
                "description": "El usuario vuelve a conectarse manualmente.",
                "value": {"status": "online"}
            },
            "heartbeat_signal": {
                "summary": "Enviar heartbeat",
                "description": "Refresca la última conexión del usuario (lastSeen), esto NO actualiza su status.",
                "value": {"heartbeat": True}
            },
            "invalid_both": {
                "summary": "Error por enviar ambos campos",
                "description": "Ejemplo inválido: no se pueden enviar `status` y `heartbeat` juntos.",
                "value": {"status": "offline", "heartbeat": True}
            },
        },
    )
):
    if update.heartbeat and update.status:
        raise HTTPException(
            status_code=422,
            detail="No se puede enviar heartbeat y status al mismo tiempo"
        )

    user = await presences_collection.find_one({ "userId": userId })
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    now = datetime.utcnow()
    update_data = {}

    if update.heartbeat:
        update_data["lastSeen"] = now

    if update.status:
        status: StatusEnum = update.status
        update_data["status"] = status.value
        update_data["lastSeen"] = now

    await presences_collection.update_one({ "userId": userId }, {"$set": update_data })

    if update.status:
        await emit_events.send(userId, status.value, { "status": status.value })

    if update.heartbeat:
        await mark_offline_if_inactive(user)

    return {
        "status": "OK",
        "message": "Se procesó correctamente",
        "data": None
    }

@router_v1.delete("/presence/{userId}", summary="Elimina la información de presencia de un usuario de la base de datos")
async def delete_presence(userId: str):
    user = await presences_collection.delete_one({"userId": userId})
    if user.deleted_count == 0:
        raise HTTPException(status_code=404, detail=f"Usuario {userId} no encontrado")
    
    return {
        "status": "OK",
        "message": "Usuario borrado de la base de datos de presencia.",
        "data": None
    }

app.include_router(router_v1)