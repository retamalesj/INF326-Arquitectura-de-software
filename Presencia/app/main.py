from fastapi import FastAPI, HTTPException, Body
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

@app.post("/presence", summary="Registrar conexión a un usuario.")
async def register_presence(
    data: UserConnection = Body(
        openapi_examples={
            "normal": {
                "summary": "Web device",
                "description": "Usuario conectado desde la web",
                "value": {"userId": "12345", "device": "web", "ip": "192.168.1.1"}
            }
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

@app.patch("/presence/{userId}", summary="Actualizar estado")
async def update_presence(
    userId: str,
    update: UserStatusUpdate = Body(
        openapi_examples={
            "normal": {
                "summary": "Actualizar el estado de un usuario.",
                "description": "A **normal** item works correctly.",
                "value": {
                    "status": "offline"
                },
            },
            "converted": {
                "summary": "An example with converted data",
                "description": "FastAPI can convert price `strings` to actual `numbers` automatically",
                "value": {
                    "name": "Bar",
                    "price": "35.4",
                },
            }
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

@app.get("/presence/{userId}")
async def get_user_presence(userId: str):
    user = await presences_collection.find_one({ "userId": userId })
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    return {
        "status": "OK",
        "message": "Usuario encontrado correctamente",
        "data": UserPresence(**user)
    }

@app.get("/presence", summary="Listar todos los usuarios")
async def list_users(status: Optional[StatusEnum] = None):
    base_filter = {}
    if status:
        base_filter["status"] = status.value

    users = await presences_collection.find(base_filter).to_list(length=None)
    
    return {
        "status": "OK",
        "message": "Usuarios listados correctamente",
        "data": [UserPresence(**user) for user in users]
    }    
    
@app.delete("/presence/{userId}")
async def delete_presence(userId: str):
    user = await presences_collection.delete_one({"userId": userId})
    if user.deleted_count == 0:
        raise HTTPException(status_code=404, detail=f"Usuario {userId} no encontrado")
    
    return {
        "status": "OK",
        "message": "Usuario borrado de la base de datos de presencia.",
        "data": None
    }