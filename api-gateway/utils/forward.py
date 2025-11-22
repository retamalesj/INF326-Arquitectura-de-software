import httpx
from fastapi import Request, HTTPException

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
