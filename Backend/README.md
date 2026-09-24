# Backend de Pulso

El frontend está en `Frontend`. Este servicio le entrega la frase, las alertas, los pabellones y el clic de limpieza.

## Cómo encenderlo

```powershell
cd C:\Users\Alex\retohospitalIA\Backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

Queda en `http://127.0.0.1:8000`. La documentación sale en `http://127.0.0.1:8000/docs`.

## Rutas

| Método | Ruta | Para qué |
|---|---|---|
| GET | `/api/frase` | La frase grande |
| GET | `/api/alertas` | Avisos de medicamento, ocupación y limpieza |
| GET | `/api/pabellones` | Cada piso con sus camas y el conteo |
| GET | `/api/camas/{id}` | Ficha de una cama |
| PATCH | `/api/camas/{id}` | El clic de aseo. Body: `{"estado_cama":"DISPONIBLE"}` |
| POST | `/api/query` | Pregunta en español. Body: `{"pregunta":"..."}` |
