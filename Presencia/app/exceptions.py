# exceptions.py
from fastapi import Request, FastAPI
from fastapi.responses import JSONResponse
import logging

logger = logging.getLogger("presence_service")

class MongoConnectionError(Exception):
    def __init__(self, detail: str = "Error de conexion con MongoDB"):
        self.detail = detail

class RabbitMQError(Exception):
    def __init__(self, detail: str = "Error de conexion o envío a RabbitMQ"):
        self.detail = detail

def register_exception_handlers(app: FastAPI):
    @app.exception_handler(MongoConnectionError)
    async def mongo_connection_error_handler(request: Request, exc: MongoConnectionError):
        logger.error(f"[MongoDB] {exc.detail}")
        return JSONResponse(
            status_code=503,
            content={"status": "ERROR", "message": exc.detail, "data": None},
        )

    @app.exception_handler(RabbitMQError)
    async def rabbitmq_error_handler(request: Request, exc: RabbitMQError):
        logger.error(f"[RabbitMQ] {exc.detail}")
        return JSONResponse(
            status_code=503,
            content={"status": "ERROR", "message": exc.detail, "data": None},
        )

    @app.exception_handler(Exception)
    async def generic_exception_handler(request: Request, exc: Exception):
        logger.exception(f"[Unhandled] {exc}")
        return JSONResponse(
            status_code=500,
            content={"status": "ERROR", "message": "Error interno del servidor", "data": None},
        )
