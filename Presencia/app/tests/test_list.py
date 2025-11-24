def test_list_all_users(client):
    resp = client.get("/api/v1.0.0/presence")
    assert resp.status_code == 200
    body = resp.json()

    assert body["data"]["total_users"] == 5

    # validamos la estructura de cada user inyectado
    for i, user in enumerate(body["data"]["users"], start=1):
        assert "userId" in user
        assert user["device"] in ["web", "mobile", "desktop"]
        assert user["status"] in ["online", "offline"]
        assert "connectedAt" in user
        assert "lastSeen" in user

    # validamos algunos usuarios en específico
    assert body["data"]["users"][0]["userId"] == "u1"
    assert body["data"]["users"][1]["device"] == "mobile"
    assert body["data"]["users"][2]["status"] == "online"

def test_list_only_online(client):
    resp = client.get("/api/v1.0.0/presence?status=online")
    assert resp.status_code == 200

    body = resp.json()

    assert body["data"]["total_users"] == 3
    assert all(u["status"] == "online" for u in body["data"]["users"])

    # validamos la estructura de cada usuario online
    for user in body["data"]["users"]:
        assert "userId" in user
        assert user["device"] in ["web", "mobile", "desktop"]
        assert "connectedAt" in user
        assert "lastSeen" in user

    # validamos algunos usuarios en específico
    assert body["data"]["users"][0]["userId"] == "u1"
    assert body["data"]["users"][2]["status"] == "online"
