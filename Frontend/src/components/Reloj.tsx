import { useEffect, useState } from 'react'

export function Reloj() {
  const [ahora, setAhora] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setAhora(new Date()), 30000)
    return () => window.clearInterval(id)
  }, [])
  const hora = ahora.toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Bogota',
  })
  return <time className="reloj" dateTime={ahora.toISOString()}>{hora}</time>
}
