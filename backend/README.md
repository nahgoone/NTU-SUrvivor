### Run Backend

````bash
cd backend
python -m venv .venv
# Windows PowerShell
.\.venv\Scripts\Activate

pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000```
````
