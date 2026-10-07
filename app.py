from flask import Flask, send_from_directory

app = Flask(__name__, static_folder="static")


@app.route("/")
def home():
    return send_from_directory(app.static_folder, "index.html")


@app.route("/health")
def health():
    return {"status": "ok"}


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)  # nosec B104
# PR flow demo
