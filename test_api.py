import requests
import json
from datetime import datetime

# Configuración
BASE_URL = "http://localhost:8000"
API_KEY = "Cisco_Net_2026_ClaveSegura"

print("="*80)
print("PRUEBAS DE SEGURIDAD - API CON FIRMAS DIGITALES")
print("="*80)
print(f"Fecha: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
print()

# PRUEBA 1: GET sin protección (público)
print("="*80)
print("PRUEBA 1: GET /favoritos (Endpoint público - SIN protección)")
print("="*80)
try:
    response = requests.get(f"{BASE_URL}/favoritos")
    print(f"Status Code: {response.status_code} ✓")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"Error: {e}")
print()

# PRUEBA 2: POST SIN firma (debe fallar 401)
print("="*80)
print("PRUEBA 2: POST /favoritos SIN firma digital (Debe fallar 401)")
print("="*80)
print("Comando equivalente:")
print("curl -X POST http://localhost:8000/favoritos \\")
print("  -H \"Content-Type: application/json\" \\")
print("  -d '{\"nombre\": \"Pikachu\", \"tipo\": \"Eléctrico\"}'")
print()
try:
    headers = {"Content-Type": "application/json"}
    data = {"nombre": "Pikachu", "tipo": "Eléctrico"}
    response = requests.post(f"{BASE_URL}/favoritos", json=data, headers=headers)
    print(f"Status Code: {response.status_code} ❌ (FALLO - Debería ser 401)")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
except requests.exceptions.HTTPError as e:
    print(f"Status Code: {e.response.status_code} ✓ (ERROR ESPERADO)")
    print(f"Response: {json.dumps(e.response.json(), indent=2)}")
print()

# PRUEBA 3: POST CON firma correcta (debe funcionar 200)
print("="*80)
print("PRUEBA 3: POST /favoritos CON firma digital correcta (Debe funcionar 200)")
print("="*80)
print("Comando equivalente:")
print(f"curl -X POST http://localhost:8000/favoritos \\")
print(f"  -H \"Content-Type: application/json\" \\")
print(f"  -H \"X-API-KEY: {API_KEY}\" \\")
print(f"  -d '{{\"nombre\": \"Charizard\", \"tipo\": \"Fuego\"}}'")
print()
try:
    headers = {
        "Content-Type": "application/json",
        "X-API-KEY": API_KEY
    }
    data = {"nombre": "Charizard", "tipo": "Fuego"}
    response = requests.post(f"{BASE_URL}/favoritos", json=data, headers=headers)
    print(f"Status Code: {response.status_code} ✓")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"Error: {e}")
print()

# PRUEBA 4: GET favoritos después de insertar
print("="*80)
print("PRUEBA 4: GET /favoritos (Verificar que se guardó el favorito)")
print("="*80)
try:
    response = requests.get(f"{BASE_URL}/favoritos")
    print(f"Status Code: {response.status_code} ✓")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"Error: {e}")
print()

# PRUEBA 5: DELETE SIN firma (debe fallar 401)
print("="*80)
print("PRUEBA 5: DELETE /favoritos/1 SIN firma digital (Debe fallar 401)")
print("="*80)
print("Comando equivalente:")
print("curl -X DELETE http://localhost:8000/favoritos/1")
print()
try:
    headers = {}
    response = requests.delete(f"{BASE_URL}/favoritos/1", headers=headers)
    print(f"Status Code: {response.status_code} ❌ (FALLO - Debería ser 401)")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
except requests.exceptions.HTTPError as e:
    print(f"Status Code: {e.response.status_code} ✓ (ERROR ESPERADO)")
    print(f"Response: {json.dumps(e.response.json(), indent=2)}")
print()

# PRUEBA 6: DELETE CON firma correcta (debe funcionar 200)
print("="*80)
print("PRUEBA 6: DELETE /favoritos/1 CON firma digital correcta (Debe funcionar 200)")
print("="*80)
print(f"Comando equivalente:")
print(f"curl -X DELETE http://localhost:8000/favoritos/1 \\")
print(f"  -H \"X-API-KEY: {API_KEY}\"")
print()
try:
    headers = {"X-API-KEY": API_KEY}
    response = requests.delete(f"{BASE_URL}/favoritos/1", headers=headers)
    print(f"Status Code: {response.status_code} ✓")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"Error: {e}")
print()

print("="*80)
print("PRUEBAS COMPLETADAS")
print("="*80)
