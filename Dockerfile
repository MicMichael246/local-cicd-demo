FROM python:3.12-slim
LABEL org.opencontainers.image.source=https://github.com/MicMichael246/local-cicd-demo
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app.py .
COPY static/ static/
CMD ["python", "app.py"]
