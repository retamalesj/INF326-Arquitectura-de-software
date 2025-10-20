from fastapi import FastAPI, HTTPException, Path
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import Dict, Optional, List
from motor.motor_asyncio import AsyncIOMotorClient
import aio_pika
import json

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
                {"status": "offline"},
                {"heartbeat": True}
            ]
        }
    }

MONGO_URI = "mongodb://mongodb_presencia:27017"
DB_NAME = "presence_db"
COLLECTION_NAME = "presences"

client = AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]

HEARTBEAT_TIMEOUT = timedelta(seconds=60) #tiempo máximo sin actualización antes de marcar offline

#Configuracion RabbitMQ

RABBITMQ_URL = "amqp://guest:guest@rabbitmq/"  # nombre del servicio en Docker
RABBITMQ_QUEUE = "presence_events"

rabbit_connection = None
rabbit_channel = None

#Funciones auxiliares para los endpoints
async def emitir_evento(event_type: str, data: dict):
    if not rabbit_channel:
        print("RabbitMQ no conectado, no se emitio el evento.")
        return

    payload = {
        "type": event_type,
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "data": data
    }

    message = aio_pika.Message(body=json.dumps(payload).encode())
    await rabbit_channel.default_exchange.publish(message, routing_key=RABBITMQ_QUEUE)
    print(f"[EVENTO] {event_type} publicado en RabbitMQ -> {payload}")

async def marcar_offline_si_inactivo(userId: str):
    doc = await collection.find_one({"userId": userId})
    if not doc:
        return

    last_seen = doc.get("lastSeen")
    if last_seen:
        diff = datetime.utcnow() - last_seen
        if diff > HEARTBEAT_TIMEOUT and doc["status"] != "offline":
            await collection.update_one({"userId": userId}, {"$set": {"status": "offline"}})
            await emitir_evento("presence.user.offline", {"userId": userId})

#Empezando con los endpoints:
@app.post("/presence", summary="Registrar conexion")
async def register_presence(data: Presencia):
    now = datetime.utcnow()
    presence_data = {
        "userId": data.userId,
        "device": data.device,
        "status": "online",
        "connectedAt": now,
        "lastSeen": now
    }

    await collection.update_one(
        {"userId": data.userId},
        {"$set": presence_data},
        upsert=True
    )

    await emitir_evento("presence.user.online", {"userId": data.userId})
    return {"userId": data.userId, "status": "online", "connectedAt": now.isoformat() + "Z"}

@app.patch("/presence/{userId}", summary="Actualizar estado")
async def update_presence(userId: str, update: ActualizacionEstado):
    now = datetime.utcnow()
    doc = await collection.find_one({"userId": userId})
    if not doc:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    new_status = doc["status"]

    if update.heartbeat:
        await collection.update_one({"userId": userId}, {"$set": {"lastSeen": now}})
        await marcar_offline_si_inactivo(userId)
        return {"userId": userId, "status": doc["status"], "lastSeen": now.isoformat() + "Z"}

    if update.status:
        new_status = update.status.lower()
        await collection.update_one(
            {"userId": userId},
            {"$set": {"status": new_status, "lastSeen": now}}
        )
        await emitir_evento(f"presence.user.{new_status}", {"userId": userId})

    return {"userId": userId, "status": new_status, "lastSeen": now.isoformat() + "Z"}


@app.get("/presence/{userId}")
async def get_user_presence(userId: str, update: ActualizacionEstado):
    status = []
    return {
        "userId": userId,
        "status": status
    }

@app.get("/presence", summary="Listar todos los usuarios online", response_model=List[Dict])
async def list_online_users():
    cursor = collection.find({"status": "online"})
    users = []
    async for doc in cursor:
        users.append({"userId": doc["userId"], "status": doc["status"]})
    return users

@app.delete("/presence/{userId}")
async def delete_presence(userId: str):

    return {"message": f"User {userId} disconnected"}


@app.on_event("startup")
async def startup_event():
    global rabbit_connection, rabbit_channel
    print("Conectando a MongoDB y RabbitMQ")

    # Conexion a RabbitMQ
    rabbit_connection = await aio_pika.connect_robust(RABBITMQ_URL)
    rabbit_channel = await rabbit_connection.channel()
    await rabbit_channel.declare_queue(RABBITMQ_QUEUE, durable=True)

    print("Conectado a RabbitMQ y MongoDB")


@app.on_event("shutdown")
async def shutdown_event():
    global rabbit_connection
    client.close()
    if rabbit_connection:
        await rabbit_connection.close()
    print("Conexion con MongoDB y RabbitMQ cerrada")