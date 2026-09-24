export function Donut({ parts }: { parts: { value: number; color: string }[] }) {
  const total = parts.reduce((sum, part) => sum + part.value, 0) || 1
  const radius = 42
  const circ = 2 * Math.PI * radius
  let cursor = 0
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <circle cx="60" cy="60" r={radius} fill="none" stroke="#e7f1ec" strokeWidth="14" />
      {parts.map((part, index) => {
        const length = (part.value / total) * circ
        const offset = -cursor
        cursor += length
        if (part.value <= 0) return null
        return (
          <circle
            key={`${part.color}-${index}`}
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={part.color}
            strokeWidth="14"
            strokeDasharray={`${length} ${circ - length}`}
            strokeDashoffset={offset}
            transform="rotate(-90 60 60)"
          />
        )
      })}
    </svg>
  )
}

export function EsperaChart({ puntos }: { puntos: { nivel: number; minutos: number }[] }) {
  const width = 280
  const height = 112
  const max = Math.max(...puntos.map((punto) => punto.minutos), 1)
  const step = puntos.length > 1 ? width / (puntos.length - 1) : 0
  const coords = puntos.map((punto, index) => {
    const x = index * step
    const y = height - 16 - (punto.minutos / max) * (height - 32)
    return [x, y] as const
  })
  const line = coords.map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const area = coords.length ? `${line} L${width},${height} L0,${height} Z` : ''
  return (
    <svg className="line-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Minutos de espera por nivel de triage">
      <defs>
        <linearGradient id="espera-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a9a62" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#1a9a62" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#espera-fill)" />
      <path d={line} fill="none" stroke="#127a56" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      {coords.map(([x, y], index) => (
        <circle key={puntos[index].nivel} cx={x} cy={y} r="4" fill="#fff" stroke="#127a56" strokeWidth="2" />
      ))}
    </svg>
  )
}
