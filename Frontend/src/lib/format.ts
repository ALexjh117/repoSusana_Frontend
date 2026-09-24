import type { Pabellon } from '../api'

const NOMBRES: Record<string, string> = {
  UCI_ADULTOS: 'UCI adultos',
  URGENCIAS: 'Urgencias',
  MEDICINA_INTERNA: 'Medicina interna',
  PEDIATRIA: 'Pediatría',
  CIRUGIA: 'Cirugía',
}

export function nombre(servicio: string) {
  return NOMBRES[servicio] ?? servicio.replaceAll('_', ' ')
}

export function saludo(fecha = new Date()) {
  const hora = Number(
    fecha.toLocaleString('en-US', { hour: 'numeric', hour12: false, timeZone: 'America/Bogota' }),
  )
  if (hora < 12) return 'Buenos días'
  if (hora < 19) return 'Buenas tardes'
  return 'Buenas noches'
}

export function fechaCorta(fecha = new Date()) {
  return fecha.toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'America/Bogota',
  })
}

export function tono(pct: number) {
  if (pct >= 85) return 'hot'
  if (pct >= 65) return 'warm'
  return 'ok'
}

export function resumenCamas(pabellones: Pabellon[]) {
  const camas = pabellones.flatMap((pabellon) => pabellon.camas)
  const ocupadas = camas.filter((cama) => cama.estado_cama === 'OCUPADA').length
  const limpieza = camas.filter((cama) => cama.estado_cama === 'EN_LIMPIEZA').length
  const libres = camas.filter((cama) => cama.estado_cama === 'DISPONIBLE').length
  const otras = camas.length - ocupadas - limpieza - libres
  const pct = camas.length ? Math.round((ocupadas * 100) / camas.length) : 0
  return { total: camas.length, ocupadas, limpieza, libres, otras, pct }
}
