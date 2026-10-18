import requests

BASE = "http://127.0.0.1:8000/api"

r = requests.post(f"{BASE}/login/", json={"username": "stark", "password": "bigstrongpass"})
print(r.status_code)
print(r.text[:500])
