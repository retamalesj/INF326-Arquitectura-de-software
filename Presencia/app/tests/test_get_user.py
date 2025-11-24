from app.main import presences_collection

def test_user_not_found(client):
    resp = client.get("/api/v1.0.0/presence/u404")
    assert resp.status_code == 404
    body = resp.json()
    assert body == {"detail": "Usuario no encontrado"}

def test_user_found(client):
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

    body = resp.json()

    assert body["status"] == "OK"
    assert body["data"]["id"] == "123"
    assert body["data"]["userId"] == "u1"
    assert body["data"]["device"] == "web"
    assert body["data"]["status"] == "online"
    assert body["data"]["connectedAt"] == "2025-01-01T00:00:00"
    assert body["data"]["lastSeen"] == "2025-01-01T00:00:00"
