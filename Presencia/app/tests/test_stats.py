def test_stats_ok(client):
    resp = client.get("/api/v1.0.0/presence/stats")
    assert resp.status_code == 200

def test_stats_has_data_format(client):
    body = client.get("/api/v1.0.0/presence/stats").json()
    assert "data" in body
    assert "online" in body["data"]
    assert "offline" in body["data"]
