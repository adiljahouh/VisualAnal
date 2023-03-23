FROM python:3.11.2-slim
EXPOSE 8000
WORKDIR /app
COPY . .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

ENTRYPOINT [ "gunicorn", "-b", "0.0.0.0:8000", "app:app" ]
