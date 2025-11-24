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
        async def to_list(self, length=None):
            return []  # lista vacía para tests

    monkeypatch.setattr(main.presences_collection, "find", lambda *args, **kwargs: FakeCursor())
    monkeypatch.setattr(main.presences_collection, "find_one", AsyncMock(return_value=None))
    monkeypatch.setattr(main.presences_collection, "update_one", AsyncMock(return_value=None))
    monkeypatch.setattr(main.presences_collection, "delete_one", AsyncMock(return_value=type("obj", (), {"deleted_count": 1})))
    monkeypatch.setattr(main.presences_collection, "count_documents", AsyncMock(return_value=0))

    # --- Mock comando "ping" de health_check ---
    monkeypatch.setattr(main.db, "command", AsyncMock(return_value={"ok": 1}))

    # --- Mock RabbitMQ ---
    monkeypatch.setattr(main.emit_events, "send", AsyncMock(return_value=None))
