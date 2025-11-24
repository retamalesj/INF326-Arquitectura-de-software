def test_register_valid_user(client):
    resp = client.post("/api/v1.0.0/presence", json={"userId": "u1", "device": "web"})
    assert resp.status_code == 200

def test_register_missing_user_id(client):
    resp = client.post("/api/v1.0.0/presence", json={"device": "web"})
    assert resp.status_code == 400
