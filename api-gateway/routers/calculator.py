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
        body_request = await request.json()
        query = body_request.get("query", "")

        body_graphql = {
            "query": f"""
            {{
                resolverEcuacion(query: "{query}") {{
                    query
                    solution
                }}
            }}
            """
        }

    except Exception:
        raise HTTPException(status_code=400, detail="El cuerpo debe ser un JSON válido")

    try:
        response = await forward("POST", f"{URLS['calculator']}/solve/", request, body=body_graphql)
        solution = response['data']['resolverEcuacion']['solution']
    
    except (KeyError, TypeError) as e:
        raise ValueError(f"No se pudo obtener la solución: {e}")

    return { "solutions": solution }


# ---------------------------------------------------------
# Calculo Integral

@router.post("/integrate")
async def gw_calc_integrate(request: Request):
    """
    Resuelve integrales.
    Input UI: { "query": "x**2" } (Asume integración respecto a x)
    """
    try:
        body_request = await request.json()
        query = body_request.get("query", "")

        body_graphql = {
            "query": f"""
            {{
                resolverIntegral(query: "{query}") {{
                    query
                }}
            }}
            """
        }
    except Exception:
        raise HTTPException(status_code=400, detail="El cuerpo debe ser un JSON válido")

    try:
        response = await forward("POST", f"{URLS['calculator']}/integrate/", request, body=body_graphql)
        solution = response['data']['resolverIntegral']['query']
    
    except (KeyError, TypeError) as e:
        raise ValueError(f"No se pudo obtener la solución: {e}")

    return { "solutions": solution }

# ---------------------------------------------------------
# Calculo Diferencial
@router.post("/derive")
async def gw_calc_derive(request: Request):
    """
    Resuelve derivadas.
    Input UI: { "query": "x**2" } -> Output esperado: "2*x"
    """
    try:
        body_request = await request.json()
        query = body_request.get("query", "")

        body_graphql = {
            "query": f"""
            {{
                resolverDerivada(query: "{query}") {{
                    query
                    operation
                    result
                }}
            }}
            """
        }

    except Exception:
        raise HTTPException(status_code=400, detail="El cuerpo debe ser un JSON válido")

    try:
        response = await forward("POST", f"{URLS['calculator']}/derive/", request, body=body_graphql)
        solution = response['data']['resolverDerivada']['result']
    
    except (KeyError, TypeError) as e:
        raise ValueError(f"No se pudo obtener la solución: {e}")

    return { "solutions": solution }