import pytest
from fastapi.testclient import TestClient
from app.main import app
from unittest.mock import AsyncMock

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture(autouse=True)
def mock_dependencies(monkeypatch):
    import app.main as main

    # --- Mock Mongo find (necesita soportar to_list) ---
    class FakeCursor:
        def __init__(self, query=None):
            self.data = [
                {"_id": "1", "userId": "u1", "device": "web", "status": "online", "connectedAt": "2025-01-01T00:00:00", "lastSeen": "2025-01-01T00:00:00"},
                {"_id": "2", "userId": "u2", "device": "mobile", "status": "offline", "connectedAt": "2025-01-02T00:00:00", "lastSeen": "2025-01-02T00:00:00"},
                {"_id": "3", "userId": "u3", "device": "desktop", "status": "online", "connectedAt": "2025-01-03T00:00:00", "lastSeen": "2025-01-03T00:00:00"},
                {"_id": "4", "userId": "u4", "device": "web", "status": "offline", "connectedAt": "2025-01-04T00:00:00", "lastSeen": "2025-01-04T00:00:00"},
                {"_id": "5", "userId": "u5", "device": "mobile", "status": "online", "connectedAt": "2025-01-05T00:00:00", "lastSeen": "2025-01-05T00:00:00"},
            ]
            self.query = query

        async def to_list(self, length=None):
            if self.query and self.query.get("status") == "online":
                return [u for u in self.data if u["status"] == "online"]
            return self.data

    monkeypatch.setattr(
        main.presences_collection,
        "find",
        lambda query=None, *args, **kwargs: FakeCursor(query=query)
    )
    monkeypatch.setattr(main.presences_collection, "find_one", AsyncMock(return_value=None))
    monkeypatch.setattr(main.presences_collection, "update_one", AsyncMock(return_value=None))
    monkeypatch.setattr(main.presences_collection, "delete_one", AsyncMock(return_value=type("obj", (), {"deleted_count": 1})))
    monkeypatch.setattr(main.presences_collection, "count_documents", AsyncMock(return_value=0))

    # --- Mock comando "ping" de health_check ---
    monkeypatch.setattr(main.db, "command", AsyncMock(return_value={"ok": 1}))

    # --- Mock RabbitMQ ---
    monkeypatch.setattr(main.emit_events, "send", AsyncMock(return_value=None))
