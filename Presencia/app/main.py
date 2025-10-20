from fastapi import FastAPI, HTTPException, Path
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import Dict, Optional, List
from motor.motor_asyncio import AsyncIOMotorClient
import aio_pika
import json

from .events import Emit

app = FastAPI(
    title="Servicio de Presencia",
    description="API para registrar, actualizar y consultar el estado de conexión de los usuarios.",
    version="0.0.1"
)

class UserConnection(BaseModel):
    userId: str
    device: Optional[str] = "unknown"
    ip: Optional[str] = None

    class Config:
        schema_extra = {
            "example": {
                "userId": "12345",
                "device": "web",
                "ip": "192.168.1.1"
            }
        }

# Duda a seguir con respecto de heartbeat. Tal vez sea necesario otra manera.
class UserStatusUpdate(BaseModel):
    status: Optional[str] = None
    heartbeat: Optional[bool] = False
    
    class Config:
        schema_extra = {
            "example": {
                "status": "offline",
                "heartbeat": True
            }
        }

MONGO_URI = "mongodb://mongodb_presencia:27017"
DB_NAME = "presence_db"
COLLECTION_NAME = "presences"

client = AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]
presences_collection  = db[COLLECTION_NAME]

HEARTBEAT_TIMEOUT = timedelta(seconds=60) # Tiempo máximo sin actualización antes de marcar offline

emit_events = Emit()

async def marcar_offline_si_inactivo(userId: str):
    user = await presences_collection .find_one({"userId": userId})
    if not user:
        return

    last_seen = user.get("lastSeen")
    if last_seen:
        diff = datetime.utcnow() - last_seen
        if diff > HEARTBEAT_TIMEOUT and user["status"] != "offline":
            await presences_collection .update_one({"userId": userId}, {"$set": {"status": "offline"}})
            await emit_events.send(userId, "offline", user.dict())

#Empezando con los endpoints:
@app.post("/presence", summary="Registrar conexión a un usuario.")
async def register_presence(data: UserConnection):
    now = datetime.utcnow()
    presence_data = {
        "userId": data.userId,
        "device": data.device,
        "status": "online",
        "connectedAt": now,
        "lastSeen": now
    }

    await presences_collection .update_one(
        {"userId": data.userId},
        {"$set": presence_data},
        upsert=True
    )

    await emit_events.send(data.userId, "online", "a")
    return {"userId": data.userId, "status": "online", "connectedAt": now.isoformat() + "Z"}

@app.patch("/presence/{userId}", summary="Actualizar estado")
async def update_presence(userId: str, update: UserStatusUpdate):
    now = datetime.utcnow()
    doc = await presences_collection .find_one({"userId": userId})
    if not doc:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    new_status = doc["status"]

    if update.heartbeat:
        await presences_collection .update_one({"userId": userId}, {"$set": {"lastSeen": now}})
        await marcar_offline_si_inactivo(userId)
        return {"userId": userId, "status": doc["status"], "lastSeen": now.isoformat() + "Z"}

    if update.status:
        new_status = update.status.lower()
        await presences_collection .update_one(
            {"userId": userId},
            {"$set": {"status": new_status, "lastSeen": now}}
        )
        await emit_events.send(userId, new_status, "")

    return {"userId": userId, "status": new_status, "lastSeen": now.isoformat() + "Z"}

@app.get("/presence/{userId}")
async def get_user_presence(userId: str, update: UserStatusUpdate):
    status = []
    return {
        "userId": userId,
        "status": status
    }

@app.get("/presence", summary="Listar todos los usuarios online", response_model=List[Dict])
async def list_online_users():
    cursor = presences_collection .find({"status": "online"})
    users = []
    async for doc in cursor:
        users.append({"userId": doc["userId"], "status": doc["status"]})
    return users

@app.delete("/presence/{userId}")
async def delete_presence(userId: str):

    return {"message": f"User {userId} disconnected"}