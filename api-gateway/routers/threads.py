from fastapi import APIRouter, Request
from utils.forward import forward
from config import URLS

router = APIRouter(prefix="/threads", tags=["Threads"])
"""POST
/threads/{thread_id}/messages
Create Message


GET
/threads/{thread_id}/messages
List Messages


PUT
/threads/{thread_id}/messages/{message_id}
Update Message


DELETE
/threads/{thread_id}/messages/{message_id}
Delete Message
"""
@router.get("")
async def gw_threads(request: Request):
    return await forward("GET", f"{URLS['threads']}/threads", request)
