import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import type { Pabellon } from './api'

export type IconName =
  | 'inicio'
  | 'camas'
  | 'urgencias'
  | 'quirofanos'
  | 'farmacia'
  | 'alertas'
  | 'diccionario'
  | 'reportes'
  | 'hospital'
  | 'chat'
  | 'pin'

export type Mensaje = { yo: boolean; texto: string }

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

export function Cruz({ className = 'cross' }: { className?: string }) {
  return (
    <span className={className} aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <path d="M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7z" fill="currentColor" />
      </svg>
    </span>
  )
}

const ICONS: Record<IconName, ReactNode> = {
  inicio: (
    <>
      <path d="M4 10.5 12 3l8 7.5" />
      <path d="M6 9.8V20h12V9.8" />
      <path d="M10 20v-5h4v5" />
    </>
  ),
  camas: (
    <>
      <path d="M3 18V9a2 2 0 0 1 2-2h11a4 4 0 0 1 4 4v7" />
      <path d="M3 14h18" />
      <path d="M7 7v5" />
    </>
  ),
  urgencias: <path d="M3 12h4l2.2-5 4.2 10L16 12h5" />,
  quirofanos: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v8M8 12h8" />
    </>
  ),
  farmacia: (
    <>
      <rect x="7" y="3" width="10" height="18" rx="5" transform="rotate(35 12 12)" />
      <path d="M9.2 9.2l5.6 5.6" />
    </>
  ),
  alertas: (
    <>
      <path d="M6 16V11a6 6 0 1 1 12 0v5l1.4 2H4.6z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </>
  ),
  diccionario: (
    <>
      <path d="M5 4.5h11A2.5 2.5 0 0 1 18.5 7v12.5H8A3 3 0 0 0 5 22.5z" />
      <path d="M5 4.5v18" />
    </>
  ),
  reportes: (
    <>
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="M8 15.5 11 11l3 2.5 4.5-6" />
    </>
  ),
  hospital: (
    <>
      <path d="M4 20V7l8-3 8 3v13" />
      <path d="M9 20v-5h6v5" />
      <path d="M12 8v4M10 10h4" />
    </>
  ),
  chat: (
    <>
      <path d="M5 6.5h14v9H8.5L5 18.5z" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10z" />
      <circle cx="12" cy="11" r="1.6" />
    </>
  ),
}

export function Icon({ name }: { name: IconName }) {
  return (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name]}
    </svg>
  )
}

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

export function RobotFace() {
  return (
    <svg className="robot-svg" viewBox="0 0 72 72" aria-hidden="true">
      <line x1="36" y1="8" x2="36" y2="15" stroke="#e7fff5" strokeWidth="2" strokeLinecap="round" />
      <circle cx="36" cy="6.5" r="3" fill="#c8ffe6" />
      <rect x="16" y="16" width="40" height="28" rx="14" fill="#fff" />
      <rect x="22" y="24" width="28" height="11" rx="5.5" fill="#12382f" />
      <circle cx="30" cy="29.5" r="2.1" fill="#3dffb0" />
      <circle cx="42" cy="29.5" r="2.1" fill="#3dffb0" />
      <path d="M30 38.5h12" stroke="#9bb5ab" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="22" y="46" width="28" height="16" rx="8" fill="#e9fff6" />
      <circle cx="31" cy="54" r="2" fill="#148a5c" />
      <circle cx="41" cy="54" r="2" fill="#148a5c" />
    </svg>
  )
}

export function ChatPanel({
  abierto,
  instant,
  mensajes,
  pensando,
  preguntas,
  inputRef,
  onCerrar,
  onEscape,
  onEnviar,
}: {
  abierto: boolean
  instant: boolean
  mensajes: Mensaje[]
  pensando: boolean
  preguntas: string[]
  inputRef: RefObject<HTMLInputElement | null>
  onCerrar: () => void
  onEscape: () => void
  onEnviar: (texto: string) => void
}) {
  const [texto, setTexto] = useState('')
  const lista = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const nodo = lista.current
    if (nodo) nodo.scrollTop = nodo.scrollHeight
  }, [mensajes, pensando, abierto])

  return (
    <section
      id="susana-chat"
      className="chat-panel"
      data-open={abierto}
      data-instant={instant}
      role="dialog"
      aria-label="SUSANA IA"
      inert={!abierto}
      onKeyDown={(event) => {
        if (event.key === 'Escape') onEscape()
      }}
    >
      <header className="chat-head">
        <Cruz className="cross sm" />
        <div>
          <strong>SUSANA IA</strong>
          <span className="chat-status"><i className="online" /> En el turno</span>
        </div>
        <button className="icon-btn" type="button" onClick={onCerrar} aria-label="Cerrar chat">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </header>
      <div className="thread" ref={lista}>
        {mensajes.map((mensaje, index) => (
          <p className={mensaje.yo ? 'bubble me' : 'bubble'} key={`${index}-${mensaje.texto.slice(0, 12)}`}>
            {mensaje.texto}
          </p>
        ))}
        {pensando && <p className="bubble">Estoy mirando el pulso del turno…</p>}
      </div>
      <div className="chips">
        {preguntas.map((pregunta) => (
          <button className="chip" key={pregunta} type="button" onClick={() => onEnviar(pregunta)} disabled={pensando}>
            {pregunta}
          </button>
        ))}
      </div>
      <form
        className="composer"
        onSubmit={(event) => {
          event.preventDefault()
          const limpia = texto.trim()
          if (!limpia) return
          setTexto('')
          onEnviar(limpia)
        }}
      >
        <input
          ref={inputRef}
          value={texto}
          onChange={(event) => setTexto(event.target.value)}
          placeholder="Escribe tu pregunta"
          aria-label="Pregunta para SUSANA IA"
          autoComplete="off"
        />
        <button className="send" type="submit" aria-label="Enviar" disabled={pensando}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </form>
    </section>
  )
}
