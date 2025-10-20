from fastapi import FastAPI, HTTPException, Path
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import Dict, Optional
from motor.motor_asyncio import AsyncIOMotorClient

app = FastAPI(title="Presence Service")

app = FastAPI(
    title="Servicio de Presencia",
    description="API para registrar, actualizar y consultar el estado de conexión de los usuarios.",
    version="0.0.1"
)
class Presencia(BaseModel):
    userId: str
    device: Optional[str] = "unknown"
    ip: Optional[str] = None

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "userId": "123",
                    "device": "web",
                    "ip": "121.000.000",
                }
            ]
        }
    }

#Duda a seguir con respecto de heartbeat. Tal vez sea necesario otra manera.
class ActualizacionEstado(BaseModel):
    status: Optional[str] = None
    heartbeat: Optional[bool] = False
    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "status": "Online",
                    "heartbeat": "True",
                }
            ]
        }
    }

MONGO_URI = "mongodb://localhost:27017"
DB_NAME = "presence_db"
COLLECTION_NAME = "presences"

client = AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]

HEARTBEAT_TIMEOUT = timedelta(seconds=60) #tiempo máximo sin actualización antes de marcar offline

#Empezando con los endpoints:
@app.post("/presence")
async def register_presence(data: Presencia):
    return {
        "userId": data.userId,
        "status": "online",
        "connectedAt": now.isoformat() + "Z"
    }

@app.patch("/presence/{userId}")
async def update_presence(userId: str, update: ActualizacionEstado):
    return {
        "userId": userId,
        "status": status,
        "lastSeen": now.isoformat() + "Z"
    }


@app.get("/presence/{userId}")
async def get_user_presence(userId: str, update: ActualizacionEstado):
    status = []
    return {
        "userId": userId,
        "status": status
    }

@app.get("/presence")
async def list_online_users():
    """Listar todos los usuarios actualmente online."""
    online_users= []
    return online_users

@app.delete("/presence/{userId}")
async def delete_presence(userId: str):

    return {"message": f"User {userId} disconnected"}


@app.on_event("startup")
async def startup_event():
    print("Conectado a MongoDB")


@app.on_event("shutdown")
async def shutdown_event():
    client.close()
    print("Conexión con MongoDB cerrada")