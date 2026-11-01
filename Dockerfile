FROM python:3.15-slim@sha256:94d3426f1def7db4a106a232ac121bfd975393e5dfd40a619b955fae45fe7913
LABEL org.opencontainers.image.source=https://github.com/MicMichael246/local-cicd-demo
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
RUN useradd --uid 10001 --no-create-home --shell /usr/sbin/nologin appuser
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app.py gunicorn.conf.py ./
COPY static/ static/
USER 10001
CMD ["gunicorn", "-c", "gunicorn.conf.py", "app:app"]
