def test_delete_success(client):
    resp = client.delete("/api/v1.0.0/presence/u1")
    assert resp.status_code == 200

def test_delete_user_not_found(client, monkeypatch):
    from app.main import presences_collection
    presences_collection.delete_one.return_value.deleted_count = 0
    resp = client.delete("/api/v1.0.0/presence/u999")
    assert resp.status_code == 404
