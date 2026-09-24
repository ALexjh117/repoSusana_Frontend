const AVISOS: Record<string, { etiqueta: string; nota: string; icon: 'farmacia' | 'camas' | 'alertas' }> = {
  medicamento: {
    etiqueta: 'Farmacia',
    nota: 'El stock no alcanza cinco días al ritmo de consumo de hoy.',
    icon: 'farmacia',
  },
  ocupacion: {
    etiqueta: 'Camas',
    nota: 'El servicio está en o por encima del 80% de ocupación.',
    icon: 'camas',
  },
  limpieza: {
    etiqueta: 'Aseo',
    nota: 'La cama vuelve a recepción cuando aseo marca que ya está limpia.',
    icon: 'camas',
  },
}

export function fichaAviso(tipo: string) {
  return AVISOS[tipo] ?? {
    etiqueta: 'Turno',
    nota: 'Revisa el dato antes de cerrar el turno.',
    icon: 'alertas' as const,
  }
}

export function textoAlerta(texto: string) {
  const nombres: [string, string][] = [
    ['UCI ADULTOS', 'UCI adultos'],
    ['MEDICINA INTERNA', 'Medicina interna'],
    ['PEDIATRIA', 'Pediatría'],
    ['CIRUGIA', 'Cirugía'],
    ['URGENCIAS', 'Urgencias'],
  ]
  const legible = nombres.reduce((actual, [crudo, lindo]) => actual.replaceAll(crudo, lindo), texto)
  return legible.replace(/(\d+)\.0(?!\d)/g, '$1')
}
