from fastapi import APIRouter, Request
from utils.forward import forward
from config import URLS

router = APIRouter(prefix="/search", tags=["Search"])

"""GET
/api/presence-gateway/search/api/message/search_message
Searchmessages


GET
/api/presence-gateway/search/api/files/search_files
Searchfiles


GET
/api/presence-gateway/search/api/threads/id/{thread_id}
Read Id


GET
/api/presence-gateway/search/api/threads/author/{created_by}
Read Author


GET
/api/presence-gateway/search/api/threads/daterange
Read Date Range


GET
/api/presence-gateway/search/api/threads/keyword/{thread_keyword}
Read Keyword


GET
/api/presence-gateway/search/api/threads/status/{status}
Read Keyword


GET
/api/presence-gateway/search/api/channel/search_channel
Searchchannel


GET
/api/presence-gateway/search/api/healthz
Health Check


GET
/api/presence-gateway/search/api/livez
Liveness Check"""

@router.get("")
async def gw_search(q: str, request: Request):
    return await forward("GET", f"{URLS['search']}/search", request, params={"q": q})
