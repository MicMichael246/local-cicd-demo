FROM python:3.12-slim
LABEL org.opencontainers.image.source=https://github.com/MicMichael246/local-cicd-demo
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
RUN useradd --uid 10001 --no-create-home --shell /usr/sbin/nologin appuser
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app.py .
COPY static/ static/
USER 10001
CMD ["python", "app.py"]
