import type { Urgencias } from '../api'
import { Donut, EsperaChart, Icon, SectionHeader } from '../components'
import { TRIAGE } from '../lib/triage'

export function Urgencias({ urgencias }: { urgencias: Urgencias | null }) {
  if (!urgencias) {
    return (
      <div className="page camas-page urgencias-page">
        <SectionHeader icon="urgencias" title="Servicio de Urgencias" subtitle="Atención inmediata y seguimiento en tiempo real." />
        <article className="camas-table-panel"><p className="urgencias-empty">Sin datos de urgencias.</p></article>
      </div>
    )
  }

  const pacientes = urgencias.por_triage.reduce((sum, fila) => sum + fila.pacientes, 0)
  const triageUno = urgencias.por_triage.find((fila) => fila.nivel === 1)
  const max = Math.max(...urgencias.por_triage.map((fila) => fila.minutos), 1)
  const triagePartes = urgencias.por_triage.map((fila) => ({ value: fila.pacientes, color: TRIAGE[fila.nivel - 1] }))

  return (
    <div className="page camas-page urgencias-page">
      <SectionHeader icon="urgencias" title="Servicio de Urgencias" subtitle="Atención inmediata y seguimiento en tiempo real." />

      <section className="camas-summary urgencias-summary" aria-label="Resumen de urgencias">
        <article className="camas-summary-card is-total">
          <div className="camas-summary-top"><span>Pacientes en muestra</span><span className="camas-summary-icon"><Icon name="urgencias" /></span></div>
          <strong>{pacientes}</strong>
          <span className="camas-summary-note">Pacientes reportados</span>
        </article>
        <article className="camas-summary-card is-occupied">
          <div className="camas-summary-top"><span>Tiempo promedio</span><span className="camas-summary-icon"><Icon name="urgencias" /></span></div>
          <strong>{urgencias.espera_promedio} <small>min</small></strong>
          <span className="camas-summary-note">Espera puerta a médico</span>
        </article>
        <article className="camas-summary-card is-available">
          <div className="camas-summary-top"><span>Triage I</span><span className="camas-summary-icon"><Icon name="urgencias" /></span></div>
          <strong>{triageUno ? `${triageUno.minutos} min` : '—'}</strong>
          <span className="camas-summary-note">Nivel 1 reportado</span>
        </article>
      </section>

      <section className="urgencias-visual-grid">
        <article className="camas-chart-panel urgencias-triage-panel">
          <header className="camas-panel-head">
            <div><p className="camas-section-kicker">Niveles de atención</p><h2>Distribución por triage</h2></div>
            <span className="camas-chart-total">{pacientes} pacientes</span>
          </header>
          <div className="urgencias-triage-layout">
            <div className="urgencias-triage-list">
              {urgencias.por_triage.map((fila) => {
                const barra = Math.max(8, (fila.minutos / max) * 100)
                return (
                  <div className="urgencias-triage-row" key={fila.nivel}>
                    <i style={{ background: TRIAGE[fila.nivel - 1] }} />
                    <div className="urgencias-triage-name"><strong>Triage {fila.nivel}</strong><span>{fila.pacientes} pacientes</span></div>
                    <strong className="urgencias-triage-time">{fila.minutos}<small> min</small></strong>
                    <div className="urgencias-triage-bar"><span style={{ width: `${barra}%`, background: TRIAGE[fila.nivel - 1] }} /></div>
                  </div>
                )
              })}
              {urgencias.por_triage.length === 0 && <p className="urgencias-empty">Sin niveles de triage reportados.</p>}
            </div>
            <div className="camas-donut-wrap">
              <Donut parts={triagePartes} />
              <div className="camas-donut-center"><strong>{pacientes}</strong><span>pacientes</span></div>
            </div>
          </div>
          <p className="camas-chart-caption">Cantidad y tiempo reportado por cada nivel</p>
        </article>

        <article className="camas-chart-panel">
          <header className="camas-panel-head">
            <div><p className="camas-section-kicker">Comportamiento de la espera</p><h2>Tiempo de espera</h2></div>
            <span className="camas-chart-total">Minutos</span>
          </header>
          <div className="urgencias-line-chart"><EsperaChart puntos={urgencias.por_triage} /></div>
          <div className="urgencias-chart-labels">
            {urgencias.por_triage.map((fila) => <span key={fila.nivel}>Triage {fila.nivel}<br />{fila.minutos} min</span>)}
          </div>
          <p className="camas-chart-caption">Espera promedio: <strong>{urgencias.espera_promedio} min</strong></p>
        </article>
      </section>

      <section className="camas-table-panel urgencias-table-panel">
        <header className="camas-panel-head">
          <div><p className="camas-section-kicker">Resumen por prioridad</p><h2>Pacientes por triage</h2></div>
          <span className="camas-count-pill">{urgencias.por_triage.length} niveles</span>
        </header>
        <div className="camas-table-scroll">
          <table className="camas-service-table urgencias-table">
            <thead><tr><th>Nivel</th><th>Pacientes</th><th>Espera promedio</th><th>Distribución</th></tr></thead>
            <tbody>
              {urgencias.por_triage.map((fila) => {
                const porcentaje = pacientes ? Math.round((fila.pacientes * 100) / pacientes) : 0
                return (
                  <tr key={fila.nivel}>
                    <td><span className="urgencias-level-badge"><i style={{ background: TRIAGE[fila.nivel - 1] }} />Triage {fila.nivel}</span></td>
                    <td><div className="camas-available-cell"><strong>{fila.pacientes}</strong><span>pacientes</span></div></td>
                    <td><strong className="urgencias-table-time">{fila.minutos} min</strong></td>
                    <td><div className="urgencias-table-meter"><div className="camas-table-track"><span style={{ width: `${porcentaje}%` }} /></div><strong>{porcentaje}%</strong></div></td>
                  </tr>
                )
              })}
              {urgencias.por_triage.length === 0 && <tr><td className="camas-table-empty" colSpan={4}>Sin datos por triage.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
