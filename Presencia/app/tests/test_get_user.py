def test_user_not_found(client):
    resp = client.get("/api/v1.0.0/presence/u404")
    assert resp.status_code == 404

def test_user_found(client, monkeypatch):
    from app.main import presences_collection
    presences_collection.find_one.return_value = {
        "_id": "123",
        "userId": "u1",
        "device": "web",
        "status": "online",
        "connectedAt": "2025-01-01T00:00:00",
        "lastSeen": "2025-01-01T00:00:00"
    }
    resp = client.get("/api/v1.0.0/presence/u1")
    assert resp.status_code == 200
