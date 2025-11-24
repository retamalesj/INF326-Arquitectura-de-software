import httpx
from fastapi import Request, HTTPException

async def forward(method: str, url: str, request: Request, body=None, params=None):
    client: httpx.AsyncClient = request.app.state.client
    
    # 1. Copiar headers del request original
    headers = dict(request.headers)
    headers.pop("host", None)
    headers.pop("content-length", None)
    
    headers["Accept-Encoding"] = "identity"

    # 2. Preparar argumentos base para httpx
    req_kwargs = {
        "method": method,
        "url": url,
        "params": params,
        "follow_redirects": True,
        "timeout": 60.0 # Aumentamos timeout por si suben archivos grandes
    }

    # 3. Ver si es JSON o es Archivo/Stream
    if body is not None:
        # ---JSON---
        headers.pop("content-type", None)
        req_kwargs["json"] = body
        req_kwargs["headers"] = headers
    else:
        # ---STREAM---
        req_kwargs["content"] = request.stream()
        req_kwargs["headers"] = headers

    # 4. Limpieza de URL (manteniendo protocolo)
    if "://" in req_kwargs["url"]:
        protocol, path = req_kwargs["url"].split("://", 1)
        path = path.replace("//", "/")
        req_kwargs["url"] = f"{protocol}://{path}"

    try:
        # 5. Ejecutar la petición con los argumentos construidos
        r = await client.request(**req_kwargs)

        if r.status_code >= 400:
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