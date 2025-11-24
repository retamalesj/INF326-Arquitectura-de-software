def test_update_user_not_found(client):
    resp = client.patch("/api/v1.0.0/presence/u123", json={"status": "offline"})
    assert resp.status_code == 404

def test_update_valid_status(client, monkeypatch):
    from app.main import presences_collection
    presences_collection.find_one.return_value = {"userId": "u1", "status": "online"}
    resp = client.patch("/api/v1.0.0/presence/u1", json={"status": "offline"})
    assert resp.status_code == 200
