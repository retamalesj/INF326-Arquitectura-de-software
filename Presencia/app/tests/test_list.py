def test_list_all_users(client):
    resp = client.get("/api/v1.0.0/presence")
    assert resp.status_code == 200

def test_list_only_online(client):
    resp = client.get("/api/v1.0.0/presence?status=online")
    assert resp.status_code == 200
