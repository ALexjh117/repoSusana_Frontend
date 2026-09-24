import type { ReactNode } from 'react'

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
