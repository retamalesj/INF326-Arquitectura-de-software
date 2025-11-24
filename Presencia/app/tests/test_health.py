def test_health_ok(client):
    resp = client.get("/api/v1.0.0/presence/health")
    assert resp.status_code == 200

def test_health_returns_fields(client):
    resp = client.get("/api/v1.0.0/presence/health")
    body = resp.json()
    assert body["status"] == "OK"
    assert "message" in body
