# Python Environment
Suggested to use virtual environment.

Create virtual environment (python refers to python3).
```
python -m venv venv
```

Activate virtual environment.
```
# Windows
. venv/Script/activate

# Unix
. venv/bin/activate
```

Install pip requirements
```
pip install -r requirements.txt
```

# Run Development
Useful to set debug to true in app.py.
```
python app.py
```

# Run Production
Use gunicorn.
```
gunicorn app:app
```

# Docker
Building image.
```
docker build -t 2amv10-backend .
```

Running container.
```
docker run --rm --name 2amv10-backend -p 5000:8000 -d 2amv10-backend
```

Stopping container.
```
docker container stop 2amv10-backend
```
