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
