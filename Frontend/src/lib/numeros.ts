export function cantidad(valor: number) {
  return valor.toLocaleString('es-CO', { maximumFractionDigits: 1 })
}

export function diasTexto(dias: number) {
  const texto = Number.isInteger(dias) ? String(dias) : cantidad(dias)
  return `${texto} ${dias === 1 ? 'día' : 'días'}`
}
