from fastapi import APIRouter, Request
from utils.forward import forward
from config import URLS

router = APIRouter(prefix="/files", tags=["Files"])


# ---------- ENDPOINTS ----------
# Health Check
@router.get("/healthz")
async def gw_files_health(request: Request):
    return await forward("GET", f"{URLS['files']}/healthz", request)

# Subir Archivo
@router.post("/upload")
async def gw_files_upload(request: Request):
    params = dict(request.query_params)
    return await forward("POST", f"{URLS['files']}/v1/files", request, params=params)

# Listar Archivos
@router.get("")
async def gw_files_list(request: Request):
    params = dict(request.query_params)
    return await forward("GET", f"{URLS['files']}/v1/files", request, params=params)

# Obtener Archivo por ID
@router.get("/{file_id}")
async def gw_files_get(file_id: str, request: Request):
    return await forward("GET", f"{URLS['files']}/v1/files/{file_id}", request)


@router.delete("/{file_id}")
async def gw_files_delete(file_id: str, request: Request):
    return await forward("DELETE", f"{URLS['files']}/v1/files/{file_id}", request)


@router.post("/{file_id}/presign-download")
async def gw_files_presign_download(file_id: str, request: Request):
    body = await request.json()
    return await forward("POST", f"{URLS['files']}/v1/files/{file_id}/presign-download", request, body=body)

