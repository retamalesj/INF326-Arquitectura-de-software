from fastapi import APIRouter, Request
from utils.forward import forward
from config import URLS

router = APIRouter(prefix="/messages", tags=["Messages"])
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
@router.post("/")
async def gw_send_message(request: Request):
    body = await request.json()
    return await forward("POST", f"{URLS['messages']}/messages", request, body=body)
