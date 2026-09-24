export type Cama = {
  id_cama: number
  codigo_cama: string
  estado_cama: string
  nombre_servicio: string
  piso_pabellon: string
}

export type Pabellon = {
  nombre: string
  piso: string
  ocupadas: number
  limpieza: number
  libres: number
  camas: Cama[]
}

export type Alerta = {
  tipo: string
  texto: string
  urgente: boolean
}

export type Frase = {
  texto: string
  notas: number
  detalle: string
}

export type Quirofano = {
  id_quirofano: number
  nombre_sala: string
  tipo_quirofano: string
  estado: string
  programadas: number
  realizadas: number
}

export type Medicamento = {
  nombre_generico: string
  stock_actual: number
  consumo_diario_promedio: number
  es_critico: number
  dias: number
}

export type Urgencias = {
  espera_promedio: number
  por_triage: { nivel: number; minutos: number; pacientes: number }[]
}

export type Accion = {
  id: string
  tipo: string
  rubro: string
  destinatario: string
  prioridad: string
  titulo: string
  recomendacion: string
}

export type Pulso = {
  generado_en: string
  riesgo: string
  resumen: string
  acciones: Accion[]
}

const API = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "")

async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${API}${path}`)
  if (!response.ok) throw new Error(path)
  return response.json() as Promise<T>
}

export const api = {
  frase: () => get<Frase>("/api/frase"),
  alertas: () => get<Alerta[]>("/api/alertas"),
  pabellones: () => get<Pabellon[]>("/api/pabellones"),
  quirofanos: () => get<Quirofano[]>("/api/quirofanos"),
  medicamentos: () => get<Medicamento[]>("/api/medicamentos"),
  urgencias: () => get<Urgencias>("/api/urgencias"),
  acciones: () => get<Pulso>("/api/acciones"),
  marcarLimpia: async (id: number) => {
    const response = await fetch(`${API}/api/camas/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado_cama: "DISPONIBLE" }),
    })
    if (!response.ok) throw new Error("No se pudo marcar la cama")
    return response.json() as Promise<Cama>
  },
  preguntar: async (pregunta: string) => {
    const response = await fetch(`${API}/api/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pregunta }),
    })
    if (!response.ok) throw new Error("consulta")
    return response.json() as Promise<{ respuesta: string; foco: string | null }>
  },
}

export function totalCamas(pabellon: Pabellon) {
  return pabellon.camas.length || 1
}

export function ocupacion(pabellon: Pabellon) {
  return Math.round((pabellon.ocupadas * 100) / totalCamas(pabellon))
}
