import { Fragment, useMemo, useState } from 'react'
import { ocupacion, type Pabellon } from '../api'
import { Donut, Icon } from '../components'
import { fechaCorta, nombre, resumenCamas, tono } from '../lib/format'

export function Camas({
  pabellones,
  onLimpiar,
}: {
  pabellones: Pabellon[]
  onLimpiar: (id: number) => Promise<void>
}) {
  const [abierto, setAbierto] = useState<string | null>(null)
  const [ojo, setOjo] = useState<string | null>(null)
  const [busqueda, setBusqueda] = useState('')
  const [aviso, setAviso] = useState('')
  const camas = resumenCamas(pabellones)
  const partes = [
    { value: camas.ocupadas, color: '#1a9a62', label: 'Ocupadas' },
    { value: camas.limpieza, color: '#e0a33a', label: 'En aseo' },
    { value: camas.libres, color: '#8fd0b4', label: 'Libres' },
    { value: camas.otras, color: '#8aa099', label: 'Otras' },
  ]
  const pctLibres = camas.total ? Math.round((camas.libres * 100) / camas.total) : 0
  const maxLibres = Math.max(...pabellones.map((pabellon) => pabellon.libres), 1)

  const encontrada = useMemo(() => {
    const codigo = busqueda.trim().toUpperCase()
    if (!codigo) return null
    return pabellones.flatMap((item) => item.camas).find((cama) => cama.codigo_cama.toUpperCase() === codigo) ?? null
  }, [busqueda, pabellones])

  return (
    <div className="page camas-page">
      <header className="camas-header">
        <div className="camas-header-copy">
          <div className="camas-header-context"><Icon name="hospital" /> Sede La Ladera · {fechaCorta()}</div>
          <h1>Gestión de camas</h1>
          <p>Consulta la ocupación y disponibilidad de camas por servicio.</p>
        </div>
        <span className="camas-header-mark" aria-hidden="true"><Icon name="camas" /></span>
      </header>

      <section className="camas-summary" aria-label="Resumen de camas">
        <article className="camas-summary-card is-total">
          <div className="camas-summary-top">
            <span>Total camas</span>
            <span className="camas-summary-icon"><Icon name="camas" /></span>
          </div>
          <strong>{camas.total || '—'}</strong>
          <span className="camas-summary-note">{camas.total ? 'Camas cargadas' : 'Sin camas cargadas'}</span>
        </article>
        <article className="camas-summary-card is-occupied">
          <div className="camas-summary-top">
            <span>Ocupadas</span>
            <span className="camas-summary-icon"><Icon name="camas" /></span>
          </div>
          <strong>{camas.total ? camas.ocupadas : '—'}</strong>
          <span className="camas-summary-note">{camas.total ? `${camas.pct}% de ocupación` : 'Sin datos de ocupación'}</span>
          {camas.total > 0 && <div className="camas-summary-meter"><span style={{ width: `${camas.pct}%` }} /></div>}
        </article>
        <article className="camas-summary-card is-available">
          <div className="camas-summary-top">
            <span>Disponibles</span>
            <span className="camas-summary-icon"><Icon name="camas" /></span>
          </div>
          <strong>{camas.total ? camas.libres : '—'}</strong>
          <span className="camas-summary-note">{camas.total ? `${pctLibres}% del total` : 'Sin camas cargadas'}</span>
          {camas.total > 0 && <div className="camas-summary-meter is-free"><span style={{ width: `${pctLibres}%` }} /></div>}
        </article>
      </section>

      <div className="camas-status-strip" aria-label="Estados de las camas">
        <span><i className="is-cleaning" />En aseo <strong>{camas.limpieza}</strong></span>
        <span><i className="is-other" />Otras <strong>{camas.otras}</strong></span>
        <span className="camas-status-total">Total <strong>{camas.total}</strong></span>
      </div>

      <section className="camas-search-panel">
        <div className="camas-search-copy">
          <p className="camas-section-kicker">Búsqueda de camas</p>
          <h2>Encuentra una cama por código</h2>
          <span>El ojo muestra el conteo del servicio y la lista abre únicamente las camas que aseo puede marcar.</span>
        </div>
        <div className="camas-search-field">
          <span className="camas-search-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="10.8" cy="10.8" r="6.4" />
              <path d="m16 16 4.2 4.2" />
            </svg>
          </span>
          <input
            className="camas-search-input"
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
            placeholder="Buscar por código, por ejemplo UCI-18"
            aria-label="Buscar cama por código"
          />
        </div>
        {busqueda && (
          <div className="camas-search-result">
            {encontrada ? (
              <>
                <div>
                  <strong>{encontrada.codigo_cama}</strong>
                  <span>{nombre(encontrada.nombre_servicio)} · {encontrada.estado_cama.replaceAll('_', ' ')}</span>
                </div>
                {encontrada.estado_cama === 'EN_LIMPIEZA' && (
                  <button className="camas-clean-button" type="button" onClick={() => { void onLimpiar(encontrada.id_cama).then(() => setAviso(`${encontrada.codigo_cama} ya está disponible para recepción.`)).catch(() => setAviso('No se pudo marcar la cama.')) }}>
                    Ya está limpia
                  </button>
                )}
              </>
            ) : (
              <p>No hay una cama con ese código.</p>
            )}
          </div>
        )}
      </section>

      <section className="camas-table-panel">
        <header className="camas-panel-head">
          <div>
            <p className="camas-section-kicker">Estado por servicio</p>
            <h2>Servicios y pabellones</h2>
          </div>
          <span className="camas-count-pill">{pabellones.length} servicios</span>
        </header>
        <p className="camas-table-note">La ocupación y la disponibilidad se calculan con los datos de cada servicio.</p>
        <div className="camas-table-scroll">
          <table className="camas-service-table">
            <thead>
              <tr>
                <th>Servicio</th>
                <th>Pabellón</th>
                <th>Ocupación</th>
                <th>Disponibles</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pabellones.map((pabellon) => {
                const enLimpieza = pabellon.camas.filter((cama) => cama.estado_cama === 'EN_LIMPIEZA')
                const pct = ocupacion(pabellon)
                const total = pabellon.camas.length
                const detalleVisible = ojo === pabellon.nombre || abierto === pabellon.nombre
                return (
                  <Fragment key={pabellon.nombre}>
                    <tr className={abierto === pabellon.nombre ? 'is-open' : ''}>
                      <td>
                        <button
                          className="camas-service-trigger"
                          type="button"
                          aria-expanded={abierto === pabellon.nombre}
                          onClick={() => setAbierto(abierto === pabellon.nombre ? null : pabellon.nombre)}
                        >
                          <span className="camas-service-icon"><Icon name="camas" /></span>
                          <span className="camas-service-name"><strong>{nombre(pabellon.nombre)}</strong><small>{total} camas</small></span>
                          <span className="camas-chevron" aria-hidden="true">⌄</span>
                        </button>
                      </td>
                      <td><span className="camas-floor">{pabellon.piso}</span></td>
                      <td>
                        <div className="camas-occupancy-cell">
                          <div className="camas-table-track"><div className={`camas-table-fill ${tono(pct)}`} style={{ width: `${pct}%` }} /></div>
                          <strong>{pct}%</strong>
                        </div>
                      </td>
                      <td><div className="camas-available-cell"><strong>{pabellon.libres}</strong><span>/ {total || '—'}</span></div></td>
                      <td>
                        <button
                          className="camas-eye-button"
                          type="button"
                          aria-pressed={ojo === pabellon.nombre}
                          aria-label={`Ver conteo de ${nombre(pabellon.nombre)}`}
                          title={`Ver conteo de ${nombre(pabellon.nombre)}`}
                          onClick={() => setOjo(ojo === pabellon.nombre ? null : pabellon.nombre)}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                    {detalleVisible && (
                      <tr className="camas-detail-row">
                        <td colSpan={5}>
                          <div className="camas-detail-content">
                            {ojo === pabellon.nombre && (
                              <div className="camas-count-summary">
                                <span><i className="is-occupied" />{pabellon.ocupadas} ocupadas</span>
                                <span><i className="is-cleaning" />{pabellon.limpieza} en limpieza</span>
                                <span><i className="is-free" />{pabellon.libres} libres</span>
                              </div>
                            )}
                            {abierto === pabellon.nombre && (
                              <div className="camas-cleaning-list">
                                <div className="camas-detail-title"><strong>Camas en limpieza</strong><span>{enLimpieza.length} para revisar</span></div>
                                {enLimpieza.length === 0 && <p>Este servicio no tiene camas en limpieza.</p>}
                                {enLimpieza.map((cama) => (
                                  <div className="camas-cleaning-row" key={cama.id_cama}>
                                    <strong>{cama.codigo_cama}</strong>
                                    <button
                                      className="camas-clean-button"
                                      type="button"
                                      onClick={() => {
                                        void onLimpiar(cama.id_cama)
                                          .then(() => setAviso(`${cama.codigo_cama} ya está disponible para recepción.`))
                                          .catch(() => setAviso('No se pudo marcar la cama.'))
                                      }}
                                    >
                                      Ya está limpia
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}
              {pabellones.length === 0 && <tr><td className="camas-table-empty" colSpan={5}>Todavía no llegan los pabellones.</td></tr>}
            </tbody>
          </table>
        </div>
        {aviso && <p className="camas-status-message" role="status">{aviso}</p>}
      </section>

      <section className="camas-visual-grid">
        <article className="camas-chart-panel">
          <header className="camas-panel-head">
            <div>
              <p className="camas-section-kicker">Resumen global</p>
              <h2>Ocupación de camas</h2>
            </div>
            <span className="camas-chart-total">{camas.total ? `${camas.total} camas` : 'Sin datos'}</span>
          </header>
          <div className="camas-donut-layout">
            <div className="camas-donut-wrap">
              <Donut parts={partes} />
              <div className="camas-donut-center"><strong>{camas.total ? `${camas.pct}%` : '—'}</strong><span>ocupadas</span></div>
            </div>
            <div className="camas-legend">
              {partes.filter((parte) => parte.value > 0).map((parte) => (
                <div key={parte.label}><i style={{ background: parte.color }} /><span>{parte.label}</span><strong>{parte.value}</strong></div>
              ))}
              {partes.every((parte) => parte.value === 0) && <p>Sin estados cargados.</p>}
            </div>
          </div>
          <p className="camas-chart-caption">{camas.ocupadas} de {camas.total} camas ocupadas</p>
        </article>

        <article className="camas-chart-panel">
          <header className="camas-panel-head">
            <div>
              <p className="camas-section-kicker">Capacidad libre</p>
              <h2>Disponibles por pabellón</h2>
            </div>
            <span className="camas-chart-total">{camas.libres} libres</span>
          </header>
          <div className="camas-bars-chart" role="img" aria-label="Camas disponibles por pabellón">
            {pabellones.length > 0 ? pabellones.map((pabellon) => {
              const alto = (pabellon.libres / maxLibres) * 100
              return (
                <div className="camas-bar-column" key={pabellon.nombre}>
                  <span className="camas-bar-value">{pabellon.libres}</span>
                  <div className="camas-bar-track"><span style={{ height: `${alto}%` }} /></div>
                  <strong title={pabellon.piso}>{pabellon.piso}</strong>
                </div>
              )
            }) : <p className="camas-table-empty">Sin pabellones para graficar.</p>}
          </div>
          <p className="camas-chart-caption">Camas libres reportadas por cada pabellón</p>
        </article>
      </section>
    </div>
  )
}
