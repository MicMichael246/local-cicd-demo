from app import app


def test_health():
    client = app.test_client()
    response = client.get("/health")
    assert response.status_code == 200
    assert response.get_json() == {"status": "ok"}


def test_home_serves_tetris():
    client = app.test_client()
    with client.get("/") as response:
        assert response.status_code == 200
        assert b"TETRIS" in response.data
