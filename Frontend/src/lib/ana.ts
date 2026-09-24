import type { Alerta, Medicamento, Pabellon, Quirofano, Urgencias } from '../api'
import type { AIResponse } from '../components/ai/visuals'
import { nombre } from './format'

export type AnaPage = 'inicio' | 'camas' | 'urgencias' | 'quirofanos' | 'farmacia' | 'alertas' | 'diccionario' | 'reportes' | 'hospital'

export const PREGUNTAS = [
  '¿Cuántas camas de UCI están ocupadas hoy?',
  '¿Cuál es la espera promedio en urgencias?',
  '¿Qué servicio tuvo más ingresos este mes?',
  '¿Qué medicamentos presentan mayor consumo?',
  '¿Qué anomalías detectó ANA IA?',
  '¿Qué podría pasar si aumenta la demanda?',
]

export const MODULOS: Record<AnaPage, string> = {
  inicio: 'Resumen del hospital',
  camas: 'Camas',
  urgencias: 'Urgencias',
  quirofanos: 'Quirófanos',
  farmacia: 'Farmacia',
  alertas: 'Alertas',
  reportes: 'Reportes',
  diccionario: 'Diccionario de datos',
  hospital: 'El hospital',
}

const ORDEN_PREGUNTAS: Record<AnaPage, number[]> = {
  inicio: [0, 1, 2, 3, 4, 5],
  camas: [0, 3, 1, 4, 5, 2],
  urgencias: [1, 0, 4, 5, 2, 3],
  quirofanos: [2, 1, 4, 5, 0, 3],
  farmacia: [3, 4, 0, 1, 5, 2],
  alertas: [4, 0, 3, 1, 5, 2],
  reportes: [2, 1, 3, 4, 5, 0],
  diccionario: [0, 1, 2, 3, 4, 5],
  hospital: [0, 1, 2, 3, 4, 5],
}

export function preguntasParaModulo(page: AnaPage) {
  const orden = ORDEN_PREGUNTAS[page]
  return [...new Set([...orden, ...PREGUNTAS.map((_, index) => index)])].map((index) => PREGUNTAS[index])
}

function sinAcentos(texto: string) {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

function porcentaje(parte: number, total: number) {
  return total ? Math.round((parte * 100) / total) : 0
}

function tonoIA(pct: number): 'green' | 'amber' | 'red' {
  if (pct >= 85) return 'red'
  if (pct >= 65) return 'amber'
  return 'green'
}

export function visualAna(
  pregunta: string,
  page: AnaPage,
  pabellones: Pabellon[],
  urgencias: Urgencias | null,
  quirofanos: Quirofano[],
  medicamentos: Medicamento[],
  alertas: Alerta[],
): AIResponse[] | undefined {
  const q = sinAcentos(pregunta)
  const pideSimulacion = q.includes('simul') || q.includes('escenario') || (q.includes('demanda') && /\d+\s*%/.test(q))
  const pidePrediccion = q.includes('predic') || q.includes('podria pasar') || q.includes('que puede pasar')

  if (pideSimulacion || pidePrediccion) {
    const porcentajePedido = q.match(/(?:\+\s*)?(\d+)\s*%/)
    const escenario = porcentajePedido ? `+${porcentajePedido[1]}% demanda` : 'Demanda aumentada'
    if (pideSimulacion) {
      return [{
        tipo: 'simulation',
        title: 'Simulación de demanda',
        scenario: escenario,
        metrics: [
          { label: 'Escenario', value: escenario, note: 'Solicitud del usuario' },
          { label: 'Proyección', value: 'No disponible', note: 'El backend no entrega modelos' },
        ],
        note: 'Escenario hipotético. No se presentan cifras hasta disponer de un modelo de simulación validado.',
        options: ['+5%', '+10%', '+15%', '+20%'],
        actions: ['Ver datos actuales', '¿Qué anomalías detectó ANA IA?'],
      }]
    }
    return [{
      tipo: 'forecast',
      title: 'Proyección de demanda',
      text: 'El backend no entrega una proyección validada para esta pregunta. ANA IA no puede estimarla sin inventar datos.',
      note: 'Se distingue la ausencia de predicción de un dato observado.',
      actions: ['Ver estado actual', 'Simular escenario'],
    }]
  }

  if (q.includes('anomal') || q.includes('alerta')) {
    if (alertas.length === 0) return undefined
    const urgentes = alertas.filter((alerta) => alerta.urgente).length
    const tipos = new Set(alertas.map((alerta) => alerta.tipo)).size
    return [{
      tipo: 'insight',
      title: 'Insight de ANA IA',
      text: `El turno recibió ${alertas.length} alertas. ANA IA separa las señales observadas de cualquier interpretación o predicción.`,
      evidence: [
        { label: 'Alertas recibidas', value: String(alertas.length) },
        { label: 'Urgentes', value: String(urgentes), tone: urgentes ? 'red' : 'green' },
        { label: 'Tipos de señal', value: String(tipos) },
      ],
      footer: 'Estos valores provienen de las alertas cargadas por la aplicación.',
      actions: ['Ver todas las alertas', '¿Qué podría pasar si aumenta la demanda?'],
    }]
  }

  if (q.includes('medicament') || q.includes('consumo')) {
    if (medicamentos.length === 0) return undefined
    const diasMax = Math.max(...medicamentos.map((med) => med.dias), 1)
    const marked = medicamentos.filter((med) => med.es_critico).length
    const low = medicamentos.filter((med) => med.dias < 5).length
    return [
      {
        tipo: 'stats',
        title: 'Inventario de medicamentos',
        subtitle: 'Datos observados del turno',
        stats: [
          { label: 'Referencias', value: String(medicamentos.length) },
          { label: 'Menos de 5 días', value: String(low), tone: low ? 'amber' : 'green' },
          { label: 'Marcados críticos', value: String(marked), tone: marked ? 'red' : 'green' },
        ],
      },
      {
        tipo: 'progress',
        title: 'Cobertura por medicamento',
        subtitle: 'Días disponibles respecto al máximo reportado',
        rows: medicamentos.map((med) => ({
          label: med.nombre_generico,
          value: `${med.dias.toLocaleString('es-CO', { maximumFractionDigits: 1 })} días`,
          detail: `Stock ${med.stock_actual} · consumo ${med.consumo_diario_promedio.toLocaleString('es-CO', { maximumFractionDigits: 1 })} al día`,
          percentage: Math.max(0, Math.min(100, (med.dias / diasMax) * 100)),
          tone: med.dias < 5 ? (med.es_critico ? 'red' : 'amber') : 'green',
        })),
        footer: 'La barra compara la cobertura reportada; no representa stock adicional.',
      },
    ]
  }

  if (q.includes('urgencia') || q.includes('espera') || q.includes('triage')) {
    if (!urgencias || urgencias.por_triage.length === 0) return undefined
    const pacientes = urgencias.por_triage.reduce((sum, fila) => sum + fila.pacientes, 0)
    const mayor = [...urgencias.por_triage].sort((a, b) => b.minutos - a.minutos)[0]
    return [
      {
        tipo: 'stats',
        title: 'Espera promedio en urgencias',
        subtitle: 'Datos observados',
        stats: [
          { label: 'Espera promedio', value: `${urgencias.espera_promedio} min` },
          { label: 'Pacientes en muestra', value: String(pacientes) },
          { label: 'Mayor espera', value: `Triage ${mayor.nivel}`, note: `${mayor.minutos} min` },
        ],
      },
      {
        tipo: 'trend',
        title: 'Espera por nivel de triage',
        subtitle: 'Comparación de niveles reportados',
        value: `${urgencias.espera_promedio} min`,
        unit: 'promedio',
        points: urgencias.por_triage.map((fila) => fila.minutos),
        note: 'Estos puntos representan niveles de triage; no son una serie temporal histórica.',
        actions: ['Ver estado de urgencias', '¿Qué podría pasar si aumenta la demanda?'],
      },
    ]
  }

  if (q.includes('quir') || q.includes('cirug') || q.includes('sala')) {
    if (quirofanos.length === 0) return undefined
    const enCirugia = quirofanos.filter((sala) => sala.estado === 'EN_CIRUGIA').length
    const programadas = quirofanos.reduce((sum, sala) => sum + sala.programadas, 0)
    const realizadas = quirofanos.reduce((sum, sala) => sum + sala.realizadas, 0)
    return [
      {
        tipo: 'stats',
        title: 'Estado de quirófanos',
        subtitle: 'Datos observados del turno',
        stats: [
          { label: 'Total salas', value: String(quirofanos.length) },
          { label: 'En cirugía', value: String(enCirugia), tone: enCirugia ? 'amber' : 'green' },
          { label: 'Programadas', value: String(programadas) },
          { label: 'Realizadas', value: String(realizadas) },
        ],
      },
      {
        tipo: 'table',
        title: 'Detalle por sala',
        columns: ['Sala', 'Estado', 'Programadas', 'Realizadas'],
        rows: quirofanos.map((sala) => [sala.nombre_sala, sala.estado === 'EN_CIRUGIA' ? 'En cirugía' : 'Disponible', String(sala.programadas), String(sala.realizadas)]),
        footer: 'Solo se muestran los estados y conteos disponibles en la API.',
      },
    ]
  }

  if (q.includes('cama') || q.includes('uci') || (page === 'camas' && q.includes('disponib'))) {
    if (pabellones.length === 0) return undefined
    const uci = pabellones.find((pabellon) => pabellon.nombre === 'UCI_ADULTOS')
    if (q.includes('uci') && !uci) return undefined
    const todas = pabellones.flatMap((pabellon) => pabellon.camas)
    const total = uci ? uci.camas.length : todas.length
    const ocupadas = uci ? uci.ocupadas : todas.filter((cama) => cama.estado_cama === 'OCUPADA').length
    const libres = uci ? uci.libres : todas.filter((cama) => cama.estado_cama === 'DISPONIBLE').length
    const pct = porcentaje(ocupadas, total)
    const rows = pabellones.map((pabellon) => {
      const p = porcentaje(pabellon.ocupadas, pabellon.camas.length)
      return {
        label: nombre(pabellon.nombre),
        value: `${pabellon.ocupadas} / ${pabellon.camas.length}`,
        detail: `${pabellon.libres} libres · ${pabellon.limpieza} en aseo`,
        percentage: p,
        tone: tonoIA(p),
      }
    })
    return [
      {
        tipo: 'stats',
        title: uci ? 'Ocupación de UCI — Hoy' : 'Ocupación hospitalaria',
        subtitle: 'Datos observados',
        stats: [
          { label: 'Ocupadas', value: String(ocupadas) },
          { label: 'Disponibles', value: String(libres), tone: 'green' },
          { label: 'Ocupación', value: `${pct}%`, tone: tonoIA(pct) },
        ],
        footer: 'Los conteos corresponden a los estados de camas reportados por la API.',
      },
      {
        tipo: 'progress',
        title: 'Detalle por servicio',
        subtitle: 'Ocupación calculada con los datos reales',
        rows,
      },
    ]
  }

  return undefined
}
