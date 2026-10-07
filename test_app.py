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


def test_security_headers():
    client = app.test_client()
    response = client.get("/health")
    assert response.headers["X-Content-Type-Options"] == "nosniff"
    assert "default-src 'self'" in response.headers["Content-Security-Policy"]


def test_static_assets():
    client = app.test_client()
    for path in ("/static/style.css", "/static/tetris.js"):
        with client.get(path) as response:
            assert response.status_code == 200
