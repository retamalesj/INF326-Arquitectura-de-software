def test_register_valid_user(client):
    resp = client.post("/api/v1.0.0/presence", json={"userId": "u1", "device": "web"})
    assert resp.status_code == 200

    body = resp.json()

    assert body["status"] == "OK"
    assert body["data"]["userId"] == "u1"
    assert body["data"]["device"] == "web"

def test_register_missing_user_id(client):
    resp = client.post("/api/v1.0.0/presence", json={"device": "web"})
    assert resp.status_code == 400

    body = resp.json()

    assert body["detail"] == "El campo 'userId' es obligatorio."

def test_register_missing_device(client):
    resp = client.post("/api/v1.0.0/presence", json={"userId": "u1"})
    assert resp.status_code == 400

    body = resp.json()

    assert body["detail"] == "El dispositivo 'unknown' no es válido. Use 'web' o 'mobile'."

def test_register_misspelled_device(client):
    resp = client.post("/api/v1.0.0/presence", json={"userId": "u1", "device": "webbbb"})
    assert resp.status_code == 400