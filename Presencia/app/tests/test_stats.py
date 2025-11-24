from app.main import presences_collection
from unittest.mock import AsyncMock

def test_stats_ok(client):
    resp = client.get("/api/v1.0.0/presence/stats")
    assert resp.status_code == 200

def test_stats_values(client):
    resp = client.get("/api/v1.0.0/presence/stats")
    body = resp.json()

    assert body["data"]["total"] == 5
    assert body["data"]["online"] == 3
    assert body["data"]["offline"] == 2

def test_stats_no_users(monkeypatch, client):
    async def count_zero(query=None):
        return 0

    monkeypatch.setattr(presences_collection, "count_documents", AsyncMock(side_effect=count_zero))

    resp = client.get("/api/v1.0.0/presence/stats")
    body = resp.json()

    assert body["data"]["total"] == 0
    assert body["data"]["online"] == 0
    assert body["data"]["offline"] == 0
