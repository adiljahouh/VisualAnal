FROM python:3.11.2-slim
EXPOSE 8000
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .

ENTRYPOINT [ "gunicorn", "-b", "0.0.0.0:8000", "app:app" ]
