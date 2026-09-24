export function fraseCodigo(codigo: string) {
  const limpio = codigo.toLowerCase().replaceAll('_', ' ').replace('cirugia', 'cirugía')
  return limpio.charAt(0).toUpperCase() + limpio.slice(1)
}
