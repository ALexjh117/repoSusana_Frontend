import type { Pulso } from '../api'
import { Icon, type IconName } from './icons'

function riesgoLegible(riesgo: string) {
  if (riesgo === 'ALTO') return 'Riesgo alto'
  if (riesgo === 'MEDIO') return 'Riesgo medio'
  if (riesgo === 'BAJO') return 'Riesgo bajo'
  return `Riesgo ${riesgo.toLowerCase()}`
}

function etiquetaPrioridad(prioridad: string) {
  if (prioridad === 'critica') return 'Crítica'
  if (prioridad === 'alta') return 'Este turno'
  return 'Seguimiento'
}

function iconoAccion(destinatario: string): IconName {
  if (destinatario === 'Farmacia') return 'farmacia'
  if (destinatario === 'Gestión de camas') return 'camas'
  if (destinatario === 'Quirófanos') return 'quirofanos'
  if (destinatario === 'Jefe de urgencias') return 'urgencias'
  return 'alertas'
}

export function AccionesTurno({
  pulso,
  onAbrir,
}: {
  pulso: Pulso | null
  onAbrir: (destinatario: string) => void
}) {
  if (!pulso || pulso.acciones.length === 0) return null
  const alto = pulso.riesgo === 'ALTO'
  return (
    <section className="pulso-turno" aria-label="Acciones del turno">
      <article className={alto ? 'card pulso-resumen alto' : 'card pulso-resumen'}>
        <p className="eyebrow">Acciones del turno</p>
        <h2>{riesgoLegible(pulso.riesgo)}</h2>
        <p>{pulso.resumen}</p>
      </article>
      <div className="aviso-grid">
        {pulso.acciones.map((accion) => {
          const critica = accion.prioridad === 'critica'
          return (
            <button
              className={critica ? 'aviso urgente' : 'aviso'}
              key={accion.id}
              type="button"
              onClick={() => onAbrir(accion.destinatario)}
            >
              <span className="aviso-icon"><Icon name={iconoAccion(accion.destinatario)} /></span>
              <div>
                <p className="aviso-tipo">{accion.destinatario}</p>
                <h2>{accion.titulo}</h2>
                <p className="muted">{accion.recomendacion}</p>
              </div>
              <span className={critica ? 'tag hot' : 'tag warn'}>{etiquetaPrioridad(accion.prioridad)}</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
