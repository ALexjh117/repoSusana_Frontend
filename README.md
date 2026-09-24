# ANA IA

Centro de inteligencia operacional del **Hospital Susana López de Valencia E.S.E.**, sede La Ladera, Popayán. ANA IA junta en un solo turno lo que el jefe necesita ver: camas, urgencias, quirófanos, farmacia y las acciones que salen de esos datos.

La aplicación tiene dos partes, en repositorios distintos:

| Parte | Dónde está | Qué hace |
|---|---|---|
| Frontend | Este repositorio, carpeta `Frontend` | La página pública, el ingreso y el tablero |
| Backend | `retobackd_susana/Backend` | La API que lee PostgreSQL y arma las respuestas |

El navegador nunca se conecta a la base. Solo habla con la API.

## Cómo se usa

1. Abre la aplicación. En local es [http://localhost:5173](http://localhost:5173).
2. La primera pantalla es la página del hospital. Pulsa **Iniciar sesión**.
3. Entra al turno. En la demo los campos ya vienen con `carlos.torres` y `demo`. El ingreso no valida contra un directorio: al enviar el formulario se abre el tablero del jefe de turno, Dr. Carlos Torres.
4. El menú de la izquierda cambia de módulo. El botón del robot abre **ANA IA**.

| Pantalla | Para qué sirve |
|---|---|
| Inicio | Pulso del turno: ocupación, urgencias, quirófanos, farmacia, alertas y acciones |
| Camas | Cada pabellón, el estado de las camas y el clic de aseo |
| Urgencias | Espera puerta-médico por nivel de triage |
| Quirófanos | Salas, lo programado y lo realizado |
| Farmacia | Stock, consumo y días que alcanza cada medicamento |
| Alertas | Avisos de medicamento, ocupación y limpieza, más las acciones del turno |
| Reportes | El mismo turno visto en tablas |
| Diccionario | De qué tabla y campo sale cada número |
| El hospital | Sedes y contacto |

En **Camas**, una cama en limpieza se puede marcar disponible. Ese clic llama a la API y la base pasa la cama a `DISPONIBLE`.

En el chat se escribe una pregunta o se elige una sugerida. ANA responde con el dato de la API y, cuando corresponde, abre el módulo (farmacia, urgencias o camas). Estas preguntas salen de la base:

- ¿Cuántas camas de UCI están ocupadas hoy?
- ¿Qué medicamentos tienen menos de 5 días?
- ¿Cuál es la espera promedio en urgencias?
- ¿Qué servicio tuvo más ingresos este mes?
- ¿Cuántas camas están en limpieza?

Las preguntas de anomalías arman una tarjeta con las alertas que ya cargó el tablero. Una pregunta de simulación o de “qué pasaría si sube la demanda” deja claro que no hay un modelo de predicción: no inventa cifras.

Las **acciones del turno** (pedido de farmacia, cama por liberar, quirófano alterno, alerta predictiva y causa de la espera) salen de `GET /api/acciones` y se ven en Inicio y en Alertas. n8n es opcional: reparte ese mismo pulso a las bandejas de cada jefe. Sin n8n, el tablero igual las muestra.

## Cómo levantarla en local

Hacen falta Node.js, Python 3 y PostgreSQL. Primero la API, después la pantalla.

### Backend

En el proyecto del backend:

```powershell
cd C:\Users\Alex\retobackd_susana\Backend
copy .env.example .env
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python scripts\setup_local_db.py
uvicorn app:app --reload --port 8000
```

Antes de `setup_local_db.py`, `.env` necesita `DATABASE_URL` con el usuario y la clave de PostgreSQL local. El script pide PostgreSQL 17 (`psql` y `pg_dump` en `C:\Program Files\PostgreSQL\17\bin`) y carga el esquema `hospital`.

La API queda en [http://127.0.0.1:8000](http://127.0.0.1:8000). [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) lista las rutas. `GET /api/health` confirma que PostgreSQL responde.

Si la base ya está en Supabase, no corras el script local: llena `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` y `DB_SSLMODE` en `.env` y arranca `uvicorn` igual. Esas claves no van al frontend.

### Frontend

En este repositorio:

```powershell
cd Frontend
copy .env.example .env
npm install
npm run dev
```

En local deja `VITE_API_URL` vacío. Vite reenvía `/api` a `http://127.0.0.1:8000`, así que el navegador no necesita CORS. Si el puerto 5173 está ocupado, Vite avisa el puerto nuevo; el proxy sigue funcionando.

Otros comandos, dentro de `Frontend`:

```powershell
npm run build
npm run preview
npm run lint
```

## Cómo se conectan

```
Navegador  →  Frontend (Vite, puerto 5173)  →  API (FastAPI, puerto 8000)  →  PostgreSQL, esquema hospital
```

Publicado, el frontend ya no tiene proxy. En el build se define `VITE_API_URL` con la URL del backend, sin barra al final, por ejemplo `https://pulso.onrender.com`. En el backend, `CORS_ORIGINS` tiene que incluir la URL del frontend.

## Rutas de la API

| Método | Ruta | Para qué |
|---|---|---|
| GET | `/api/health` | Confirma la conexión a PostgreSQL |
| GET | `/api/frase` | Frase del turno |
| GET | `/api/alertas` | Medicamento corto, ocupación alta y camas en limpieza |
| GET | `/api/acciones` | Acciones del turno para el tablero y para n8n |
| GET | `/api/pabellones` | Pisos, conteos y camas |
| GET | `/api/quirofanos` | Salas, programadas y realizadas |
| GET | `/api/medicamentos` | Inventario y días de autonomía |
| GET | `/api/urgencias` | Espera por triage de la última semana |
| GET | `/api/camas/{id}` | Una cama |
| PATCH | `/api/camas/{id}` | Clic de aseo. Cuerpo: `{"estado_cama":"DISPONIBLE"}` |
| POST | `/api/query` | Pregunta en español. Cuerpo: `{"pregunta":"..."}` |

## Dónde está el código del frontend

```
Frontend/src/pages        una pantalla por archivo
Frontend/src/components   iconos, chat, tarjetas de ANA y piezas compartidas
Frontend/src/lib          preguntas de ANA y cálculos que usan varias pantallas
Frontend/src/styles       estilos, un archivo por zona de la interfaz
Frontend/src/api.ts       tipos y llamadas a la API
Frontend/src/App.tsx      página pública, ingreso y menú del turno
```

El flujo de n8n, si se quiere usar, está en el proyecto del backend: `n8n/pulso_acciones_turno.json`. Se importa en n8n y, con la API en el puerto 8000, se ejecuta el workflow. El detalle de bandejas y del cron de 15 minutos está en el README de ese backend.
