import type { Quirofano } from '../api'
import { Icon, SectionHeader } from '../components'
import { fraseCodigo } from '../lib/texto'

export function Quirofanos({ quirofanos }: { quirofanos: Quirofano[] }) {
  const enCirugia = quirofanos.filter((sala) => sala.estado === 'EN_CIRUGIA').length
  const disponibles = quirofanos.length - enCirugia
  const programadas = quirofanos.reduce((sum, sala) => sum + sala.programadas, 0)
  const realizadas = quirofanos.reduce((sum, sala) => sum + sala.realizadas, 0)
  const max = Math.max(...quirofanos.flatMap((sala) => [sala.programadas, sala.realizadas]), 1)

  return (
    <div className="page camas-page quirofanos-page">
      <SectionHeader icon="quirofanos" title="Gestión de quirófanos" subtitle="Control del estado y programación de salas." />

      <section className="camas-summary quirofanos-summary" aria-label="Resumen de quirófanos">
        <article className="camas-summary-card is-total">
          <div className="camas-summary-top"><span>Total salas</span><span className="camas-summary-icon"><Icon name="quirofanos" /></span></div>
          <strong>{quirofanos.length}</strong>
          <span className="camas-summary-note">Salas del turno</span>
        </article>
        <article className="camas-summary-card is-occupied">
          <div className="camas-summary-top"><span>En cirugía</span><span className="camas-summary-icon"><Icon name="quirofanos" /></span></div>
          <strong>{quirofanos.length ? enCirugia : '—'}</strong>
          <span className="camas-summary-note">{quirofanos.length ? `${disponibles} salas disponibles` : 'Sin salas'}</span>
        </article>
        <article className="camas-summary-card is-available">
          <div className="camas-summary-top"><span>Disponibles</span><span className="camas-summary-icon"><Icon name="quirofanos" /></span></div>
          <strong>{quirofanos.length ? disponibles : '—'}</strong>
          <span className="camas-summary-note">Salas fuera de cirugía</span>
        </article>
        <article className="camas-summary-card is-programmed">
          <div className="camas-summary-top"><span>Programadas</span><span className="camas-summary-icon"><Icon name="quirofanos" /></span></div>
          <strong>{programadas}</strong>
          <span className="camas-summary-note">En la agenda</span>
        </article>
      </section>

      <div className="camas-status-strip" aria-label="Resumen de estados de quirófanos">
        <span><i className="is-occupied" />En cirugía <strong>{enCirugia}</strong></span>
        <span><i className="is-free" />Disponibles <strong>{disponibles}</strong></span>
        <span className="camas-status-total">Realizadas <strong>{realizadas}</strong></span>
      </div>

      <section className="camas-table-panel quirofanos-table-panel">
        <header className="camas-panel-head">
          <div><p className="camas-section-kicker">Salas del turno</p><h2>Estado actual</h2></div>
          <span className="camas-count-pill">{quirofanos.length} salas</span>
        </header>
        <div className="camas-table-scroll">
          <table className="camas-service-table quirofanos-table">
            <thead><tr><th>Sala</th><th>Tipo</th><th>Estado</th><th>Programadas</th><th>Realizadas</th></tr></thead>
            <tbody>
              {quirofanos.map((sala) => (
                <tr key={sala.id_quirofano}>
                  <td><div className="quirofanos-room-name"><span className="quirofanos-room-icon"><Icon name="quirofanos" /></span><strong>{sala.nombre_sala}</strong></div></td>
                  <td><span className="quirofanos-type">{fraseCodigo(sala.tipo_quirofano)}</span></td>
                  <td><span className={sala.estado === 'EN_CIRUGIA' ? 'camas-status is-busy' : 'camas-status is-available'}><i />{sala.estado === 'EN_CIRUGIA' ? 'En cirugía' : 'Disponible'}</span></td>
                  <td><div className="quirofanos-count-cell"><strong>{sala.programadas}</strong><span>programadas</span></div></td>
                  <td><div className="quirofanos-count-cell"><strong>{sala.realizadas}</strong><span>realizadas</span></div></td>
                </tr>
              ))}
              {quirofanos.length === 0 && <tr><td className="camas-table-empty" colSpan={5}>Sin salas cargadas.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      <section className="camas-chart-panel quirofanos-program-panel">
        <header className="camas-panel-head">
          <div><p className="camas-section-kicker">Capacidad de las salas</p><h2>Programación y realización</h2></div>
          <span className="camas-chart-total">{programadas} programadas</span>
        </header>
        <div className="quirofanos-program-legend"><span><i className="is-programmed" />Programadas</span><span><i className="is-realized" />Realizadas</span></div>
        <div className="quirofanos-program-chart" role="img" aria-label="Programación y realización por quirófano">
          {quirofanos.length > 0 ? quirofanos.map((sala) => {
            const altoProgramadas = sala.programadas > 0 ? Math.max(8, (sala.programadas / max) * 100) : 0
            const altoRealizadas = sala.realizadas > 0 ? Math.max(8, (sala.realizadas / max) * 100) : 0
            return (
              <div className="quirofanos-program-column" key={sala.id_quirofano}>
                <div className="quirofanos-program-bars">
                  <span className="is-programmed" style={{ height: `${altoProgramadas}%` }} />
                  <span className="is-realized" style={{ height: `${altoRealizadas}%` }} />
                </div>
                <strong>{sala.nombre_sala.replace('Quirófano ', 'Q')}</strong>
                <div className="quirofanos-program-values"><span>{sala.programadas} progr.</span><span>{sala.realizadas} realiz.</span></div>
              </div>
            )
          }) : <p className="camas-table-empty">Sin salas para graficar.</p>}
        </div>
        <p className="camas-chart-caption">{programadas} programadas · {realizadas} realizadas en el turno</p>
      </section>
    </div>
  )
}
