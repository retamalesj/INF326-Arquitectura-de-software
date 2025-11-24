from fastapi import APIRouter, Request, HTTPException
from utils.forward import forward
from config import URLS

router = APIRouter(prefix="/calculator", tags=["Calculator"])

# ---------------------------------------------------------
# Algebra basica, Cuadraticas

@router.post("/solve")
async def gw_calc_solve(request: Request):
    """
    Resuelve ecuaciones matemáticas.
    Input UI: { "query": "x**2 - 25" }
    Output:   { "query": "...", "solution": [-5, 5] }
    """
    try:
        # Validamos que el body sea JSON válido antes de enviarlo
        body = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="El cuerpo debe ser un JSON válido")

    return await forward("POST", f"{URLS['calculator']}/solve/", request, body=body)


# ---------------------------------------------------------
# Calculo Integral

@router.post("/integrate")
async def gw_calc_integrate(request: Request):
    """
    Resuelve integrales.
    Input UI: { "query": "x**2" } (Asume integración respecto a x)
    """
    try:
        body = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="El cuerpo debe ser un JSON válido")

    return await forward("POST", f"{URLS['calculator']}/integrate/", request, body=body)


# ---------------------------------------------------------
# Calculo Diferencial
@router.post("/derive")
async def gw_calc_derive(request: Request):
    """
    Resuelve derivadas.
    Input UI: { "query": "x**2" } -> Output esperado: "2*x"
    """
    try:
        body = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="El cuerpo debe ser un JSON válido")

    return await forward("POST", f"{URLS['calculator']}/derive/", request, body=body)