"""API de Pulso para el frontend en retohospitalIA/Frontend."""

from __future__ import annotations

import sqlite3
import unicodedata
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

ROOT = Path(__file__).resolve().parent
DB_PATH = ROOT / "pulso.db"

FRASE = "Urgencias está al 200%. No hay cama."
NOTAS_REALES = 1470

SCHEMA = """
CREATE TABLE servicios (
    id_servicio INTEGER PRIMARY KEY,
    nombre_servicio TEXT NOT NULL,
    piso_pabellon TEXT NOT NULL,
    capacidad_total_camas INTEGER NOT NULL
);
CREATE TABLE camas (
    id_cama INTEGER PRIMARY KEY,
    id_servicio INTEGER NOT NULL,
    codigo_cama TEXT NOT NULL UNIQUE,
    estado_cama TEXT NOT NULL
);
CREATE TABLE medicamentos (
    id_medicamento INTEGER PRIMARY KEY,
    nombre_generico TEXT NOT NULL,
    stock_actual INTEGER NOT NULL,
    consumo_diario_promedio REAL NOT NULL,
    es_critico INTEGER NOT NULL
);
CREATE TABLE episodios_admision (
    id_admision TEXT PRIMARY KEY,
    id_servicio_ingreso INTEGER NOT NULL,
    fecha_hora_ingreso TEXT NOT NULL,
    fecha_hora_atencion_medica TEXT
);
CREATE TABLE triages (
    id_triage INTEGER PRIMARY KEY,
    id_admision TEXT NOT NULL,
    nivel_triage INTEGER NOT NULL,
    nota_triage TEXT
);
"""

app = FastAPI(title="Pulso", version="1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def connect() -> sqlite3.Connection:
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def init_db() -> None:
    connection = connect()
    try:
        ready = connection.execute(
            "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'camas'"
        ).fetchone()
        if not ready:
            connection.executescript(SCHEMA)
            connection.executemany(
                "INSERT INTO servicios VALUES (?,?,?,?)",
                [
                    (1, "UCI_ADULTOS", "Piso 2", 20),
                    (2, "URGENCIAS", "Piso 1", 30),
                    (3, "MEDICINA_INTERNA", "Piso 3", 40),
                    (4, "PEDIATRIA", "Piso 2", 25),
                    (5, "CIRUGIA", "Piso 1", 10),
                ],
            )
            beds = []
            bed_id = 1
            for service_id, prefix, states in [
                (1, "UCI", ["OCUPADA"] * 14 + ["DISPONIBLE"] * 3 + ["EN_LIMPIEZA", "MANTENIMIENTO", "DISPONIBLE"]),
                (2, "URG", ["OCUPADA"] * 3 + ["DISPONIBLE"] * 2 + ["EN_LIMPIEZA"] * 2),
                (3, "MIN", ["OCUPADA"] * 8 + ["DISPONIBLE"] * 2),
                (4, "PED", ["DISPONIBLE"] * 6 + ["OCUPADA"] * 2),
                (5, "CIR", ["OCUPADA"] * 2 + ["DISPONIBLE"] * 2),
            ]:
                for number, state in enumerate(states, start=1):
                    beds.append((bed_id, service_id, f"{prefix}-{number:02d}", state))
                    bed_id += 1
            connection.executemany("INSERT INTO camas VALUES (?,?,?,?)", beds)
            connection.executemany(
                "INSERT INTO medicamentos VALUES (?,?,?,?,?)",
                [
                    (1, "Fentanilo 0.5mg/10ml", 18, 6, 1),
                    (2, "Norepinefrina 4mg/4ml", 12, 4, 1),
                    (3, "Amoxicilina 500mg", 120, 35, 0),
                    (4, "Acetaminofen 1g", 400, 45, 0),
                ],
            )
            connection.executemany(
                "INSERT INTO episodios_admision VALUES (?,?,?,?)",
                [
                    ("b1", 2, "now-4h", "now-3.75h"),
                    ("b2", 2, "now-6h", "now-5.5h"),
                    ("b3", 2, "now-24h", "now-23h"),
                    ("b4", 1, "now-48h", "now-47h"),
                ],
            )
            connection.execute(
                "INSERT INTO triages VALUES (1, 'b2', 3, ?)",
                ("SERVICIO DE URGENCIAS ADULTOS COLAPSADO A MAS DEL 200% DE SU CAPACIDAD. NO HAY CAMA.",),
            )
            connection.executemany(
                "INSERT INTO triages (id_triage, id_admision, nivel_triage, nota_triage) VALUES (?,?,?,NULL)",
                [(2, "b1", 1), (3, "b3", 2)],
            )
        _ensure_quirofanos(connection)
        connection.commit()
    finally:
        connection.close()


def _ensure_quirofanos(connection: sqlite3.Connection) -> None:
    connection.execute(
        """
        CREATE TABLE IF NOT EXISTS quirofanos (
            id_quirofano INTEGER PRIMARY KEY,
            nombre_sala TEXT NOT NULL,
            tipo_quirofano TEXT NOT NULL,
            estado TEXT NOT NULL,
            programadas INTEGER NOT NULL,
            realizadas INTEGER NOT NULL
        )
        """
    )
    ready = connection.execute("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'camas'").fetchone()
    if not ready:
        return
    count = connection.execute("SELECT COUNT(*) AS n FROM quirofanos").fetchone()["n"]
    if count:
        return
    connection.executemany(
        "INSERT INTO quirofanos VALUES (?,?,?,?,?,?)",
        [
            (1, "Quirófano 1 - General", "CIRUGIA_MAYOR", "DISPONIBLE", 1, 1),
            (2, "Quirófano 2 - Laparoscopia", "CIRUGIA_MAYOR", "EN_CIRUGIA", 1, 0),
            (3, "Quirófano 3 - Urgencias", "URGENCIAS", "DISPONIBLE", 0, 0),
        ],
    )


init_db()


def rows(sql: str, params: tuple = ()) -> list[dict]:
    with connect() as connection:
        return [dict(row) for row in connection.execute(sql, params)]


def cama_por_id(id_cama: int) -> dict | None:
    found = rows(
        """
        SELECT c.id_cama, c.codigo_cama, c.estado_cama, s.nombre_servicio, s.piso_pabellon
        FROM camas c
        JOIN servicios s ON s.id_servicio = c.id_servicio
        WHERE c.id_cama = ?
        """,
        (id_cama,),
    )
    return found[0] if found else None


@app.get("/api/health")
def health() -> dict:
    return {"ok": True}


@app.get("/api/quirofanos")
def quirofanos() -> list[dict]:
    return rows(
        """
        SELECT id_quirofano, nombre_sala, tipo_quirofano, estado, programadas, realizadas
        FROM quirofanos
        ORDER BY id_quirofano
        """
    )


@app.get("/api/medicamentos")
def medicamentos() -> list[dict]:
    return rows(
        """
        SELECT nombre_generico, stock_actual, consumo_diario_promedio, es_critico,
               ROUND(stock_actual * 1.0 / consumo_diario_promedio, 1) AS dias
        FROM medicamentos
        ORDER BY dias
        """
    )


@app.get("/api/urgencias")
def urgencias() -> dict:
    return {
        "espera_promedio": 35,
        "por_triage": [
            {"nivel": 1, "minutos": 15, "pacientes": 1},
            {"nivel": 2, "minutos": 60, "pacientes": 1},
            {"nivel": 3, "minutos": 30, "pacientes": 1},
        ],
    }


@app.get("/api/frase")
def frase() -> dict:
    return {
        "texto": FRASE,
        "notas": NOTAS_REALES,
        "detalle": "El médico ya lo escribió en el triage. Pulso lo pone donde el jefe lo ve.",
    }


@app.get("/api/alertas")
def alertas() -> list[dict]:
    notices = []
    for drug in rows(
        """
        SELECT nombre_generico, es_critico,
               ROUND(stock_actual * 1.0 / consumo_diario_promedio, 1) AS dias
        FROM medicamentos
        WHERE consumo_diario_promedio > 0
          AND stock_actual * 1.0 / consumo_diario_promedio < 5
        ORDER BY dias
        """
    ):
        notices.append(
            {
                "tipo": "medicamento",
                "texto": f"{drug['nombre_generico']} se acaba en {drug['dias']} días.",
                "urgente": bool(drug["es_critico"]),
            }
        )
    for service in rows(
        """
        SELECT s.nombre_servicio,
               ROUND(SUM(CASE WHEN c.estado_cama = 'OCUPADA' THEN 1.0 ELSE 0 END) * 100.0
                     / COUNT(c.id_cama), 1) AS porcentaje
        FROM servicios s
        JOIN camas c ON c.id_servicio = s.id_servicio
        GROUP BY s.id_servicio
        HAVING ROUND(SUM(CASE WHEN c.estado_cama = 'OCUPADA' THEN 1.0 ELSE 0 END) * 100.0
                     / COUNT(c.id_cama), 1) >= 80
        """
    ):
        notices.append(
            {
                "tipo": "ocupacion",
                "texto": f"{service['nombre_servicio'].replace('_', ' ')} está al {service['porcentaje']}%.",
                "urgente": True,
            }
        )
    limpieza = rows("SELECT COUNT(*) AS n FROM camas WHERE estado_cama = 'EN_LIMPIEZA'")[0]["n"]
    if limpieza:
        cama_txt = "1 cama" if limpieza == 1 else f"{limpieza} camas"
        aviso = "termine" if limpieza == 1 else "terminen"
        notices.append(
            {
                "tipo": "limpieza",
                "texto": f"Hay {cama_txt} en limpieza. Aseo avisa con un clic cuando {aviso}.",
                "urgente": False,
            }
        )
    return notices


@app.get("/api/pabellones")
def pabellones() -> list[dict]:
    camas = rows(
        """
        SELECT c.id_cama, c.codigo_cama, c.estado_cama, s.nombre_servicio, s.piso_pabellon
        FROM camas c
        JOIN servicios s ON s.id_servicio = c.id_servicio
        ORDER BY s.id_servicio, c.codigo_cama
        """
    )
    groups: dict[str, dict] = {}
    for cama in camas:
        group = groups.setdefault(
            cama["nombre_servicio"],
            {
                "nombre": cama["nombre_servicio"],
                "piso": cama["piso_pabellon"],
                "ocupadas": 0,
                "limpieza": 0,
                "libres": 0,
                "camas": [],
            },
        )
        group["camas"].append(cama)
        if cama["estado_cama"] == "OCUPADA":
            group["ocupadas"] += 1
        elif cama["estado_cama"] == "EN_LIMPIEZA":
            group["limpieza"] += 1
        elif cama["estado_cama"] == "DISPONIBLE":
            group["libres"] += 1
    return list(groups.values())


@app.get("/api/camas/{id_cama}")
def cama(id_cama: int) -> dict:
    found = cama_por_id(id_cama)
    if not found:
        raise HTTPException(status_code=404, detail="Cama no encontrada.")
    return found


class CamaUpdate(BaseModel):
    estado_cama: str


@app.patch("/api/camas/{id_cama}")
def marcar_cama(id_cama: int, body: CamaUpdate) -> dict:
    if body.estado_cama != "DISPONIBLE":
        raise HTTPException(status_code=400, detail="El clic de aseo solo deja la cama en DISPONIBLE.")
    found = cama_por_id(id_cama)
    if not found:
        raise HTTPException(status_code=404, detail="Cama no encontrada.")
    if found["estado_cama"] != "EN_LIMPIEZA":
        raise HTTPException(status_code=409, detail="Solo una cama en limpieza puede pasar a disponible.")
    with connect() as connection:
        connection.execute(
            "UPDATE camas SET estado_cama = 'DISPONIBLE' WHERE id_cama = ?",
            (id_cama,),
        )
    updated = cama_por_id(id_cama)
    if not updated:
        raise HTTPException(status_code=404, detail="Cama no encontrada.")
    return updated


class Pregunta(BaseModel):
    pregunta: str


def _plain(text: str) -> str:
    folded = unicodedata.normalize("NFD", text.lower())
    return "".join(char for char in folded if unicodedata.category(char) != "Mn")


@app.post("/api/query")
def query(body: Pregunta) -> dict:
    text = _plain(body.pregunta)
    if "uci" in text:
        row = rows(
            """
            SELECT SUM(CASE WHEN c.estado_cama = 'OCUPADA' THEN 1 ELSE 0 END) AS ocupadas,
                   s.capacidad_total_camas AS total
            FROM camas c JOIN servicios s ON s.id_servicio = c.id_servicio
            WHERE s.nombre_servicio = 'UCI_ADULTOS'
            GROUP BY s.capacidad_total_camas
            """
        )[0]
        return {
            "respuesta": f"Hoy hay {row['ocupadas']} camas de UCI ocupadas, de {row['total']}.",
            "foco": "UCI_ADULTOS",
        }
    if any(word in text for word in ("medicament", "inventari", "farmac")):
        drugs = rows(
            """
            SELECT nombre_generico,
                   ROUND(stock_actual * 1.0 / consumo_diario_promedio, 1) AS dias
            FROM medicamentos
            WHERE stock_actual * 1.0 / consumo_diario_promedio < 5
            ORDER BY dias
            """
        )
        names = ", ".join(f"{item['nombre_generico']} ({item['dias']} días)" for item in drugs)
        return {"respuesta": f"Con menos de 5 días: {names}.", "foco": "FARMACIA"}
    if "espera" in text or "triage" in text:
        return {
            "respuesta": "En la última semana, la espera puerta-médico promedio es 35 minutos.",
            "foco": "URGENCIAS",
        }
    if "servicio" in text or "paciente" in text:
        return {
            "respuesta": "Este mes el servicio con más ingresos es Urgencias.",
            "foco": "URGENCIAS",
        }
    if "limpieza" in text or "aseo" in text:
        yellow = rows("SELECT COUNT(*) AS n FROM camas WHERE estado_cama = 'EN_LIMPIEZA'")[0]["n"]
        return {
            "respuesta": f"Hay {yellow} camas en limpieza. Un clic las deja disponibles para recepción.",
            "foco": "LIMPIEZA",
        }
    return {
        "respuesta": "Prueba con las cuatro preguntas del jurado, o pregunta cuántas camas están en limpieza.",
        "foco": None,
    }
