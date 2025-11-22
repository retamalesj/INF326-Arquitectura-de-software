from fastapi import APIRouter, Request, Path, Header, HTTPException
from utils.forward import forward
from config import URLS

router = APIRouter(prefix="/messages", tags=["Messages"])

# ---------------- POST ----------------
@router.post("/threads/{thread_id}/messages")
async def gw_create_message(
    request: Request,
    thread_id: str = Path(...),
    x_user_id: str = Header(..., alias="X-User-Id"),
):
    body = await request.json()
    return await forward(
        "POST",
        f"{URLS['messages']}/threads/{thread_id}/messages",
        request,
        body=body,
        headers={"X-User-Id": x_user_id},
    )

# ---------------- GET ----------------
@router.get("/threads/{thread_id}/messages")
async def gw_list_messages(
    request: Request,
    thread_id: str = Path(...),
    limit: int = 50,
    cursor: str | None = None,
):
    params = {"limit": limit}
    if cursor:
        params["cursor"] = cursor
    return await forward(
        "GET",
        f"{URLS['messages']}/threads/{thread_id}/messages",
        request,
        params=params,
    )

# ---------------- PUT ----------------
@router.put("/threads/{thread_id}/messages/{message_id}")
async def gw_update_message(
    request: Request,
    thread_id: str = Path(...),
    message_id: str = Path(...),
    x_user_id: str = Header(..., alias="X-User-Id"),
):
    body = await request.json()
    return await forward(
        "PUT",
        f"{URLS['messages']}/threads/{thread_id}/messages/{message_id}",
        request,
        body=body,
        headers={"X-User-Id": x_user_id},
    )

# ---------------- DELETE ----------------
@router.delete("/threads/{thread_id}/messages/{message_id}")
async def gw_delete_message(
    request: Request,
    thread_id: str = Path(...),
    message_id: str = Path(...),
    x_user_id: str = Header(..., alias="X-User-Id"),
):
    return await forward(
        "DELETE",
        f"{URLS['messages']}/threads/{thread_id}/messages/{message_id}",
        request,
        headers={"X-User-Id": x_user_id},
    )
