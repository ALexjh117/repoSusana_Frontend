import { Fragment, useMemo, useState } from 'react'
import { ocupacion, type Alerta, type Frase, type Medicamento, type Pabellon, type Quirofano, type Urgencias } from './api'
import { Cruz, Donut, EsperaChart, fechaCorta, Icon, RobotFace, nombre, resumenCamas, saludo, tono, type IconName } from './bits'
import { useMemo, useState } from 'react'
import { ocupacion, type Alerta, type Frase, type Medicamento, type Pabellon, type Pulso, type Quirofano, type Urgencias } from './api'
import { Cruz, Donut, EsperaChart, fechaCorta, Icon, nombre, resumenCamas, saludo, tono, type IconName } from './bits'

const PRINCIPIOS = [
  ['Deriva', 'Abre el servicio de la pregunta'],
  ['Explica', 'Muestra el número y la nota'],
  ['Anticipa', 'Avisa lo que se está acabando'],
  ['Simula', 'Compara programado y hecho'],
  ['Decide', 'Deja el pulso en el turno'],
] as const

const TRIAGE = ['#e25b4a', '#e07a3a', '#e0a33a', '#1a9a62', '#3d8fd1']

export function Login({ onEnter }: { onEnter: () => void }) {
  const [aviso, setAviso] = useState('')
  return (
    <main className="login">
      <section className="login-hero">
        <img src="/fachada-susana.png" alt="Fachada del Hospital Susana López de Valencia en la ladera, con las montañas del Cauca al fondo." />
        <div className="login-shade" />
        <div className="login-top">
          <div className="brand on-photo">
            <Cruz />
            <div>
              <strong>Hospital</strong>
              <span>Susana López de Valencia</span>
            </div>
          </div>
          <span className="sede-pill">E.S.E. · Popayán</span>
        </div>
        <div className="login-copy">
          <p className="eyebrow">Sede La Ladera · Ciudad Blanca</p>
          <h1>ANA <em>IA</em></h1>
          <p>Inteligencia que cuida, decisiones que salvan.</p>
        </div>
        <p className="login-foot">Centro de inteligencia operacional hospitalaria</p>
      </section>
      <section className="login-panel">
        <form
          className="card login-card"
          onSubmit={(event) => {
            event.preventDefault()
            onEnter()
          }}
        >
          <h2>Bienvenido</h2>
          <p className="muted">Entra para ver el pulso del hospital.</p>
          <label htmlFor="usuario">Usuario</label>
          <input id="usuario" defaultValue="carlos.torres" autoComplete="username" />
          <label htmlFor="clave">Contraseña</label>
          <input id="clave" type="password" defaultValue="demo" autoComplete="current-password" />
          <button className="btn full" type="submit">Iniciar sesión</button>
          <button
            className="linkish"
            type="button"
            onClick={() => setAviso('En esta demo el turno entra con el usuario del jefe.')}
          >
            ¿Olvidaste tu contraseña?
          </button>
          {aviso && <p className="muted" role="status">{aviso}</p>}
        </form>
        <p className="login-note">Calle 15 No. 17A-196, La Ladera · Popayán, Cauca</p>
      </section>
    </main>
  )
}

export function Inicio({
  frase,
  pabellones,
  urgencias,
  quirofanos,
  alertas,
  medicamentos,
  preguntas,
  onAbrirChat,
  onPreguntar,
  onVerAlertas,
  pulso,
  onAbrirAccion,
}: {
  frase: Frase | null
  pabellones: Pabellon[]
  urgencias: Urgencias | null
  quirofanos: Quirofano[]
  alertas: Alerta[]
  medicamentos: Medicamento[]
  preguntas: string[]
  onAbrirChat: () => void
  onPreguntar: (texto: string) => void
  onVerAlertas: () => void
  pulso: Pulso | null
  onAbrirAccion: (destinatario: string) => void
}) {
  const camas = resumenCamas(pabellones)
  const enCirugia = quirofanos.filter((sala) => sala.estado === 'EN_CIRUGIA').length
  const uso = quirofanos.length ? Math.round((enCirugia * 100) / quirofanos.length) : 0
  const criticos = medicamentos.filter((med) => med.dias < 5).length
  const markedCritical = medicamentos.filter((med) => med.es_critico).length
  const urgentes = alertas.filter((alerta) => alerta.urgente).length
  const pacientesUrgencias = urgencias?.por_triage.reduce((sum, fila) => sum + fila.pacientes, 0) ?? 0
  const triageMasEspera = urgencias
    ? [...urgencias.por_triage].sort((a, b) => b.minutos - a.minutos)[0]
    : null
  const programadas = quirofanos.reduce((sum, sala) => sum + sala.programadas, 0)
  const realizadas = quirofanos.reduce((sum, sala) => sum + sala.realizadas, 0)
  const salasDisponibles = quirofanos.length - enCirugia

  return (
    <div className="page inicio-page">
      <section className="inicio-hero">
        <img src="/fachada-susana.png" alt="" />
        <div className="inicio-hero-overlay" />
        <div className="inicio-hero-content">
          <div className="inicio-hero-copy">
            <p className="inicio-eyebrow"><span className="inicio-eyebrow-dot" />Panel de turno · {saludo()}, Dr. Carlos</p>
            <h1>{frase?.texto ?? 'Cargando el pulso del turno…'}</h1>
            <p>
              {frase
                ? `${frase.detalle} Aparece en ${frase.notas.toLocaleString('es-CO')} notas de triage.`
                : 'Sede La Ladera · Popayán, Cauca'}
            </p>
          </div>
          <div className="inicio-hero-actions">
            <div className="inicio-hero-date">
              <span>Estado del hospital</span>
              <strong>{fechaCorta()}</strong>
              <small><Icon name="pin" /> Sede La Ladera</small>
            </div>
            <button className="inicio-primary-button" type="button" onClick={onAbrirChat}>
              <Icon name="chat" />
              Hablar con ANA IA
            </button>
          </div>
        </div>
      </section>

      <section className="inicio-kpis" aria-label="Resumen general del hospital">
        <article className="inicio-kpi inicio-kpi-primary">
          <div className="inicio-kpi-top">
            <span>Ocupación hospitalaria</span>
            <span className="inicio-kpi-icon"><Icon name="camas" /></span>
          </div>
          <div className="inicio-kpi-value">
            <strong>{pabellones.length ? `${camas.pct}%` : '—'}</strong>
            <span>{camas.total ? `${camas.ocupadas} de ${camas.total} camas` : 'Sin camas cargadas'}</span>
          </div>
          {camas.total > 0 && <div className="inicio-kpi-meter"><span style={{ width: `${camas.pct}%` }} /></div>}
        </article>
        <article className="inicio-kpi">
          <div className="inicio-kpi-top">
            <span>Espera en urgencias</span>
            <span className="inicio-kpi-icon"><Icon name="urgencias" /></span>
          </div>
          <div className="inicio-kpi-value">
            <strong>{urgencias ? `${urgencias.espera_promedio} min` : '—'}</strong>
            <span>{urgencias ? `${pacientesUrgencias} pacientes en la muestra` : 'Sin datos de urgencias'}</span>
          </div>
          <span className="inicio-kpi-footnote">Puerta a médico</span>
        </article>
        <article className="inicio-kpi">
          <div className="inicio-kpi-top">
            <span>Uso de quirófanos</span>
            <span className="inicio-kpi-icon"><Icon name="quirofanos" /></span>
          </div>
          <div className="inicio-kpi-value">
            <strong>{quirofanos.length ? `${uso}%` : '—'}</strong>
            <span>{quirofanos.length ? `${enCirugia} de ${quirofanos.length} en cirugía` : 'Sin salas'}</span>
          </div>
          <span className="inicio-kpi-footnote">{quirofanos.length ? `${salasDisponibles} disponibles` : 'Sin salas'}</span>
        </article>
        <article className={`inicio-kpi${urgentes ? ' is-critical' : ''}`}>
          <div className="inicio-kpi-top">
            <span>Alertas críticas</span>
            <span className="inicio-kpi-icon"><Icon name="alertas" /></span>
          </div>
          <div className="inicio-kpi-value">
            <strong>{urgentes}</strong>
            <span>{alertas.length ? `${alertas.length} en el turno` : 'Sin alertas en este turno'}</span>
          </div>
          <span className="inicio-kpi-footnote">Requieren mirada</span>
        </article>
        <article className={`inicio-kpi${criticos ? ' is-attention' : ''}`}>
          <div className="inicio-kpi-top">
            <span>Medicamentos por revisar</span>
            <span className="inicio-kpi-icon"><Icon name="farmacia" /></span>
          </div>
          <div className="inicio-kpi-value">
            <strong>{criticos}</strong>
            <span>{medicamentos.length ? `${medicamentos.length} referencias cargadas` : 'Sin inventario cargado'}</span>
          </div>
          <span className="inicio-kpi-footnote">Menos de 5 días</span>
        </article>
      </section>

      <section className="inicio-grid inicio-primary-grid">
        <article className="inicio-panel inicio-services-panel">
          <header className="inicio-panel-head">
            <div>
              <p className="inicio-section-kicker">Capacidad por servicio</p>
              <h2>Estado de los servicios</h2>
            </div>
            <span className="inicio-count-pill">{pabellones.length} servicios</span>
      <AccionesTurno pulso={pulso} onAbrir={onAbrirAccion} />

      <section className="dash-main">
        <article className="card">
          <header className="card-head">
            <h2>Estado por servicio</h2>
          </header>
          <div className="inicio-service-list">
            {pabellones.map((pabellon) => {
              const pct = ocupacion(pabellon)
              return (
                <div className="inicio-service-row" key={pabellon.nombre}>
                  <div className="inicio-service-label">
                    <span className="inicio-service-icon"><Icon name="camas" /></span>
                    <div>
                      <strong>{nombre(pabellon.nombre)}</strong>
                      <span>{pabellon.piso}</span>
                    </div>
                  </div>
                  <div className="inicio-service-data">
                    <div className="inicio-service-bar">
                      <div className="inicio-track"><div className={`inicio-fill ${tono(pct)}`} style={{ width: `${pct}%` }} /></div>
                      <strong>{pct}%</strong>
                    </div>
                    <div className="inicio-service-counts">
                      <span>{pabellon.ocupadas} ocupadas</span>
                      <span>{pabellon.libres} libres</span>
                      <span>{pabellon.limpieza} en aseo</span>
                    </div>
                  </div>
                </div>
              )
            })}
            {pabellones.length === 0 && <p className="inicio-empty">Todavía no llegan los pabellones.</p>}
          </div>
        </article>

        <article className="inicio-panel inicio-urgency-panel">
          <header className="inicio-panel-head">
            <div>
              <p className="inicio-section-kicker">Puerta de entrada</p>
              <h2>Urgencias</h2>
            </div>
            <span className="inicio-live-dot"><i />Datos del turno</span>
          </header>
          {urgencias ? (
            <>
              <div className="inicio-urgency-metrics">
                <div>
                  <span>Pacientes en muestra</span>
                  <strong>{pacientesUrgencias}</strong>
                </div>
                <div>
                  <span>Espera promedio</span>
                  <strong>{urgencias.espera_promedio}<small> min</small></strong>
                </div>
              </div>
              <div className="inicio-chart-heading">
                <span>Tiempo de espera por triage</span>
                <span>Minutos</span>
              </div>
              <div className="inicio-chart">
                <EsperaChart puntos={urgencias.por_triage} />
                <div className="inicio-chart-labels">
                  {urgencias.por_triage.map((fila) => (
                    <span key={fila.nivel}>Triage {fila.nivel}<br />{fila.minutos} min</span>
                  ))}
                </div>
              </div>
              {triageMasEspera && (
                <p className="inicio-panel-footnote">Mayor espera: <strong>Triage {triageMasEspera.nivel}</strong> · {triageMasEspera.minutos} min</p>
              )}
            </>
          ) : (
            <p className="inicio-empty">Sin datos de urgencias.</p>
          )}
        </article>

        <article className="inicio-panel inicio-alerts-panel">
          <header className="inicio-panel-head">
            <div>
              <p className="inicio-section-kicker">Seguimiento del turno</p>
              <h2>Alertas recientes</h2>
            </div>
            <span className="inicio-count-pill">{alertas.length}</span>
          </header>
          <div className="inicio-alert-list">
            {alertas.slice(0, 4).map((alerta) => {
              const ficha = fichaAviso(alerta.tipo)
              return (
                <div className={alerta.urgente ? 'inicio-alert is-urgent' : 'inicio-alert'} key={`${alerta.tipo}-${alerta.texto}`}>
                  <span className="inicio-alert-icon"><Icon name={ficha.icon} /></span>
                  <div className="inicio-alert-copy">
                    <div className="inicio-alert-meta">
                      <span>{ficha.etiqueta}</span>
                      <span className={alerta.urgente ? 'inicio-alert-priority is-urgent' : 'inicio-alert-priority'}>{alerta.urgente ? 'Urgente' : 'Aviso'}</span>
                    </div>
                    <p>{textoAlerta(alerta.texto)}</p>
                    <p className="inicio-alert-context">{ficha.nota}</p>
                  </div>
                </div>
              )
            })}
            {alertas.length === 0 && <p className="inicio-empty">Sin alertas en este turno.</p>}
          </div>
          <button className="inicio-link-button" type="button" onClick={onVerAlertas}>Ver todas las alertas <span>→</span></button>
        </article>
      </section>

      <section className="inicio-grid inicio-operational-grid">
        <article className="inicio-panel inicio-rooms-panel">
          <header className="inicio-panel-head">
            <div>
              <p className="inicio-section-kicker">Agenda del turno</p>
              <h2>Quirófanos</h2>
            </div>
            <span className="inicio-count-pill">{quirofanos.length} salas</span>
          </header>
          {quirofanos.length > 0 ? (
            <>
              <div className="inicio-rooms-summary">
                <div><strong>{enCirugia}</strong><span>En cirugía</span></div>
                <div><strong>{salasDisponibles}</strong><span>Disponibles</span></div>
                <div><strong>{realizadas}/{programadas}</strong><span>Realizadas / programadas</span></div>
              </div>
              <div className="inicio-room-list">
                {quirofanos.map((sala) => (
                  <div className="inicio-room-row" key={sala.id_quirofano}>
                    <div className="inicio-room-name">
                      <span className="inicio-room-icon"><Icon name="quirofanos" /></span>
                      <div>
                        <strong>{sala.nombre_sala}</strong>
                        <span>{fraseCodigo(sala.tipo_quirofano)}</span>
                      </div>
                    </div>
                    <div className="inicio-room-numbers">
                      <span>{sala.programadas} progr.</span>
                      <span>{sala.realizadas} realiz.</span>
                    </div>
                    <span className={sala.estado === 'EN_CIRUGIA' ? 'inicio-status is-busy' : 'inicio-status is-available'}>
                      <i />{sala.estado === 'EN_CIRUGIA' ? 'En cirugía' : 'Disponible'}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="inicio-empty">Sin salas cargadas.</p>
          )}
        </article>

        <article className="inicio-panel inicio-pharmacy-panel">
          <header className="inicio-panel-head">
            <div>
              <p className="inicio-section-kicker">Cobertura de farmacia</p>
              <h2>Medicamentos</h2>
            </div>
            <span className="inicio-count-pill">{medicamentos.length} referencias</span>
          </header>
          {medicamentos.length > 0 ? (
            <>
              <div className="inicio-pharmacy-summary">
                <div><strong>{criticos}</strong><span>Menos de 5 días</span></div>
                <div><strong>{markedCritical}</strong><span>Marcados críticos</span></div>
                <div><strong>{medicamentos.length}</strong><span>En inventario</span></div>
              </div>
              <div className="inicio-med-list">
                {medicamentos.map((med) => {
                  const corto = med.dias < 5
                  const critico = Boolean(med.es_critico)
                  return (
                    <div className="inicio-med-row" key={med.nombre_generico}>
                      <div className="inicio-med-name">
                        <span className="inicio-med-icon"><Icon name="farmacia" /></span>
                        <div>
                          <strong>{med.nombre_generico}</strong>
                          <span>Stock {med.stock_actual} · consumo {cantidad(med.consumo_diario_promedio)} al día</span>
                        </div>
                      </div>
                      <div className="inicio-med-state">
                        <span className={corto ? (critico ? 'inicio-status is-critical' : 'inicio-status is-attention') : 'inicio-status is-available'}>
                          <i />{corto ? (critico ? 'Crítico' : 'Corto') : 'Estable'}
                        </span>
                        <strong>{diasTexto(med.dias)}</strong>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          ) : (
            <p className="inicio-empty">Sin inventario cargado.</p>
          )}
        </article>
      </section>

      <section className="inicio-susana">
        <div className="inicio-susana-copy">
          <div className="inicio-susana-brand">
            <Cruz className="cross sm" />
            <div>
              <p className="inicio-section-kicker">Asistente inteligente</p>
              <h2>ANA IA</h2>
            </div>
          </div>
          <p className="inicio-susana-message">Pregúntame por UCI, medicamentos, espera o el servicio con más ingresos.</p>
          <div className="inicio-susana-questions">
            <span>Preguntas rápidas</span>
            <div className="inicio-susana-chips">
              {preguntas.slice(0, 4).map((pregunta) => (
                <button className="inicio-quick-chip" key={pregunta} type="button" onClick={() => onPreguntar(pregunta)}>
                  {pregunta}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="inicio-susana-visual">
          <div className="inicio-robot-orbit" aria-hidden="true">
            <div className="inicio-robot"><RobotFace /></div>
          </div>
          <div className="inicio-susana-cta">
            <span className="inicio-online"><i />En el turno</span>
            <strong>Una consulta rápida para orientar la siguiente decisión.</strong>
            <button className="inicio-primary-button" type="button" onClick={onAbrirChat}><Icon name="chat" />Abrir chat</button>
          </div>
        </div>
      </section>

      <footer className="inicio-principles">
        <div className="inicio-principles-brand">
          <Cruz className="cross sm" />
          <div>
            <strong>ANA IA</strong>
            <span>Centro de inteligencia operacional hospitalaria</span>
          </div>
        </div>
        <div className="inicio-principles-list">
          {PRINCIPIOS.map(([titulo, detalle]) => (
            <div className="inicio-principle" key={titulo}>
              <span className="inicio-principle-dot">{titulo.slice(0, 1)}</span>
              <div>
                <strong>{titulo}</strong>
                <span>{detalle}</span>
              </div>
            </div>
          ))}
        </div>
        <p>Mejores datos, mejores decisiones, una atención más humana.</p>
      </footer>
    </div>
  )
}

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

function SectionHeader({ icon, title, subtitle }: { icon: IconName; title: string; subtitle: string }) {
  return (
    <header className="camas-header">
      <div className="camas-header-copy">
        <div className="camas-header-context"><Icon name="hospital" /> Sede La Ladera · {fechaCorta()}</div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <span className="camas-header-mark" aria-hidden="true"><Icon name={icon} /></span>
    </header>
  )
}

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

const FAMILIAS: Record<string, { nombre: string; color: string }> = {
  'Fentanilo 0.5mg/10ml': { nombre: 'Opioides', color: '#e25b4a' },
  'Norepinefrina 4mg/4ml': { nombre: 'Vasoactivos', color: '#e07a3a' },
  'Amoxicilina 500mg': { nombre: 'Antibióticos', color: '#3d8fd1' },
  'Acetaminofen 1g': { nombre: 'Analgésicos', color: '#1a9a62' },
}

function familiaDe(nombreMed: string) {
  return FAMILIAS[nombreMed] ?? { nombre: 'Otras', color: '#8aa099' }
}

function cantidad(valor: number) {
  return valor.toLocaleString('es-CO', { maximumFractionDigits: 1 })
}

function diasTexto(dias: number) {
  const texto = Number.isInteger(dias) ? String(dias) : cantidad(dias)
  return `${texto} ${dias === 1 ? 'día' : 'días'}`
}

function FilaMedicamento({ med }: { med: Medicamento }) {
  const corto = med.dias < 5
  const critico = Boolean(med.es_critico)
  const ancho = Math.max(8, Math.min(100, (med.dias / 14) * 100))
  return (
    <div className="med-row">
      <div>
        <strong>{med.nombre_generico}</strong>
        <div className="muted">Stock {med.stock_actual} · consumo {cantidad(med.consumo_diario_promedio)} al día</div>
      </div>
      <div className="med-side">
        <span className={corto ? (critico ? 'tag hot' : 'tag warn') : 'tag'}>
          {corto ? (critico ? 'Crítico' : 'Corto') : 'Estable'}
        </span>
        <em>{diasTexto(med.dias)}</em>
      </div>
      <div className="track meter" aria-hidden="true">
        <div className={`fill ${corto ? 'hot' : 'ok'}`} style={{ width: `${ancho}%` }} />
      </div>
    </div>
  )
}

export function Farmacia({ medicamentos }: { medicamentos: Medicamento[] }) {
  const cortos = medicamentos.filter((med) => med.dias < 5)
  const estables = medicamentos.filter((med) => med.dias >= 5)
  const marcados = medicamentos.filter((med) => med.es_critico).length
  const familias = new Map<string, { color: string; consumo: number }>()
  for (const med of medicamentos) {
    const familia = familiaDe(med.nombre_generico)
    const actual = familias.get(familia.nombre) ?? { color: familia.color, consumo: 0 }
    actual.consumo += med.consumo_diario_promedio
    familias.set(familia.nombre, actual)
  }
  const consumoTotal = medicamentos.reduce((sum, med) => sum + med.consumo_diario_promedio, 0)
  const partes = [...familias.entries()].map(([, familia]) => ({ value: familia.consumo, color: familia.color }))

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <h1>Inventario de medicamentos</h1>
          <p className="muted">Sede La Ladera · {fechaCorta()}</p>
        </div>
      </header>
      <section className="mini-kpis">
        <article className="card kpi">
          <div className="kpi-top">
            <span>Referencias</span>
            <span className="kpi-icon"><Icon name="farmacia" /></span>
          </div>
          <strong>{medicamentos.length}</strong>
          <em>En el inventario del turno</em>
        </article>
        <article className={`card kpi${cortos.length ? ' alert' : ''}`}>
          <div className="kpi-top">
            <span>Menos de 5 días</span>
            <span className="kpi-icon"><Icon name="alertas" /></span>
          </div>
          <strong>{cortos.length}</strong>
          <em>Cobertura que enciende alerta</em>
        </article>
        <article className={`card kpi${marcados ? ' warn' : ''}`}>
          <div className="kpi-top">
            <span>Fármacos críticos</span>
            <span className="kpi-icon"><Icon name="farmacia" /></span>
          </div>
          <strong>{marcados}</strong>
          <em>Marcados en el backend</em>
        </article>
      </section>
      <section className="split lista">
        <article className="card">
          <header className="card-head">
            <h2>Medicamentos con menos de 5 días</h2>
            {cortos.length > 0 && <span className="tag hot">{cortos.length}</span>}
          </header>
          {medicamentos.length === 0 && <p className="muted">Sin inventario cargado.</p>}
          {cortos.map((med) => <FilaMedicamento key={med.nombre_generico} med={med} />)}
          {medicamentos.length > 0 && cortos.length === 0 && <p className="muted">Ningún medicamento está por debajo de 5 días.</p>}
          {estables.length > 0 && (
            <>
              <h3 className="subhead">Cobertura estable</h3>
              {estables.map((med) => <FilaMedicamento key={med.nombre_generico} med={med} />)}
            </>
          )}
        </article>
        <article className="card ocupacion-card">
          <header className="card-head"><h2>Consumo por familia</h2></header>
          {medicamentos.length === 0 ? (
            <p className="muted">Sin inventario cargado.</p>
          ) : (
            <>
              <div className="donut-wrap">
                <Donut parts={partes} />
                <div className="donut-label">
                  <strong>{cantidad(consumoTotal)}</strong>
                  <span>al día</span>
                </div>
              </div>
              <ul className="legend">
                {[...familias.entries()].map(([nombreFamilia, familia]) => (
                  <li key={nombreFamilia}>
                    <i style={{ background: familia.color }} />
                    {nombreFamilia} · {cantidad(familia.consumo)} / día
                  </li>
                ))}
              </ul>
            </>
          )}
        </article>
      </section>
    </div>
  )
}

const AVISOS: Record<string, { etiqueta: string; nota: string; icon: 'farmacia' | 'camas' | 'alertas' }> = {
  medicamento: {
    etiqueta: 'Farmacia',
    nota: 'El stock no alcanza cinco días al ritmo de consumo de hoy.',
    icon: 'farmacia',
  },
  ocupacion: {
    etiqueta: 'Camas',
    nota: 'El servicio está en o por encima del 80% de ocupación.',
    icon: 'camas',
  },
  limpieza: {
    etiqueta: 'Aseo',
    nota: 'La cama vuelve a recepción cuando aseo marca que ya está limpia.',
    icon: 'camas',
  },
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

function fichaAviso(tipo: string) {
  return AVISOS[tipo] ?? {
    etiqueta: 'Turno',
    nota: 'Revisa el dato antes de cerrar el turno.',
    icon: 'alertas' as const,
  }
}

function textoAlerta(texto: string) {
  const nombres: [string, string][] = [
    ['UCI ADULTOS', 'UCI adultos'],
    ['MEDICINA INTERNA', 'Medicina interna'],
    ['PEDIATRIA', 'Pediatría'],
    ['CIRUGIA', 'Cirugía'],
    ['URGENCIAS', 'Urgencias'],
  ]
  const legible = nombres.reduce((actual, [crudo, lindo]) => actual.replaceAll(crudo, lindo), texto)
  return legible.replace(/(\d+)\.0(?!\d)/g, '$1')
}

type FiltroAlerta = 'todas' | 'urgentes' | 'medicamento' | 'ocupacion' | 'limpieza'

export function Alertas({
  alertas,
  pulso,
  onAbrirAccion,
}: {
  alertas: Alerta[]
  pulso: Pulso | null
  onAbrirAccion: (destinatario: string) => void
}) {
  const [filtro, setFiltro] = useState<FiltroAlerta>('todas')
  const urgentes = alertas.filter((alerta) => alerta.urgente).length
  const avisos = alertas.length - urgentes
  const ordenadas = [...alertas].sort((a, b) => Number(b.urgente) - Number(a.urgente))
  const visibles = ordenadas.filter((alerta) => {
    if (filtro === 'urgentes') return alerta.urgente
    if (filtro === 'todas') return true
    return alerta.tipo === filtro
  })
  const filtros: { id: FiltroAlerta; label: string }[] = [
    { id: 'todas', label: 'Todas' },
    { id: 'urgentes', label: 'Urgentes' },
    { id: 'medicamento', label: 'Farmacia' },
    { id: 'ocupacion', label: 'Camas' },
    { id: 'limpieza', label: 'Aseo' },
  ]

  return (
    <div className="page sala-alertas">
      <header className="placa-susana">
        <img src="/fachada-susana.png" alt="" />
        <div className="placa-veil" />
        <div className="placa-copy">
          <p className="eyebrow">En memoria de Susana López de Valencia</p>
          <h1>Alertas del turno</h1>
          <p className="eslogan">Aquí no se le cierra la puerta a nadie.</p>
          <p>Lo que se dice en La Ladera</p>
        </div>
        <aside className="placa-homenaje">
          <Cruz className="cross sm" />
          <p>1910 — 1964</p>
          <strong>Su nombre sigue en este turno</strong>
          <span>Primera dama de Colombia. El hospital de La Ladera la recuerda desde 1964.</span>
        </aside>
      </header>
      <ul className="hitos-susana" aria-label="Memoria de Susana López de Valencia">
        <li>
          <strong>Palmira</strong>
          <span>Nació el 17 de septiembre de 1910</span>
        </li>
        <li>
          <strong>1962 — 1964</strong>
          <span>Primera dama, junto a Guillermo León Valencia</span>
        </li>
        <li>
          <strong>Popayán</strong>
          <span>La Ciudad Blanca guarda su memoria</span>
        </li>
        <li>
          <strong>La Ladera</strong>
          <span>El hospital lleva su nombre desde 1964</span>
        </li>
      </ul>
      <AccionesTurno pulso={pulso} onAbrir={onAbrirAccion} />
      <h2 className="subhead">Avisos que ya estaban en el tablero</h2>
      <section className="mini-kpis">
        <article className={`card kpi${urgentes ? ' alert' : ''}`}>
          <div className="kpi-top">
            <span>Urgentes</span>
            <span className="kpi-icon"><Icon name="alertas" /></span>
          </div>
          <strong>{urgentes}</strong>
          <em>Piden mirada ahora</em>
        </article>
        <article className={`card kpi${avisos ? ' warn' : ''}`}>
          <div className="kpi-top">
            <span>Avisos</span>
            <span className="kpi-icon"><Icon name="alertas" /></span>
          </div>
          <strong>{avisos}</strong>
          <em>Siguen el turno de cerca</em>
        </article>
        <article className="card kpi">
          <div className="kpi-top">
            <span>En el tablero</span>
            <span className="kpi-icon"><Icon name="inicio" /></span>
          </div>
          <strong>{alertas.length}</strong>
          <em>Farmacia, camas y aseo</em>
        </article>
      </section>
      <div className="tabs filtros-sala" aria-label="Filtrar alertas">
        {filtros.map((item) => (
          <button
            key={item.id}
            className={filtro === item.id ? 'active' : ''}
            type="button"
            aria-pressed={filtro === item.id}
            onClick={() => setFiltro(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {visibles.length > 0 && (
        <section className="aviso-grid tablero-sala">
          {visibles.map((alerta) => {
            const ficha = fichaAviso(alerta.tipo)
            return (
              <article className={alerta.urgente ? 'aviso urgente' : 'aviso'} key={`${alerta.tipo}-${alerta.texto}`}>
                <span className="aviso-icon"><Icon name={ficha.icon} /></span>
                <div>
                  <p className="aviso-tipo">{ficha.etiqueta}</p>
                  <h2>{textoAlerta(alerta.texto)}</h2>
                  <p className="muted">{ficha.nota}</p>
                </div>
                <span className={alerta.urgente ? 'tag hot' : 'tag warn'}>{alerta.urgente ? 'Urgente' : 'Aviso'}</span>
              </article>
            )
          })}
        </section>
      )}
      {visibles.length === 0 && (
        <article className="card vacio-sala">
          <Cruz className="cross sm" />
          <div>
            <strong>{alertas.length === 0 ? 'El turno está en calma' : 'Nada en este filtro'}</strong>
            <p className="muted">{alertas.length === 0 ? 'Sin alertas en este turno.' : 'Nada coincide con este filtro.'}</p>
          </div>
        </article>
      )}
    </div>
  )
}

function fraseCodigo(codigo: string) {
  const limpio = codigo.toLowerCase().replaceAll('_', ' ').replace('cirugia', 'cirugía')
  return limpio.charAt(0).toUpperCase() + limpio.slice(1)
}

function BarraPct({ valor, max = 100 }: { valor: number; max?: number }) {
  const ancho = Math.max(0, Math.min(100, max ? (valor / max) * 100 : 0))
  return (
    <div className="pct-cell">
      <div className="track" aria-hidden="true">
        <div className={`fill ${tono(max === 100 ? valor : ancho)}`} style={{ width: `${ancho}%` }} />
      </div>
      <strong>{max === 100 ? `${valor}%` : valor}</strong>
    </div>
  )
}

export function Reportes({
  pabellones,
  urgencias,
  medicamentos,
  quirofanos,
}: {
  pabellones: Pabellon[]
  urgencias: Urgencias | null
  medicamentos: Medicamento[]
  quirofanos: Quirofano[]
}) {
  const [tab, setTab] = useState<'ocupacion' | 'urgencias' | 'farmacia' | 'quirofanos'>('ocupacion')
  const camas = resumenCamas(pabellones)
  const pico = [...pabellones].sort((a, b) => ocupacion(b) - ocupacion(a))[0]
  const pacientes = urgencias?.por_triage.reduce((sum, fila) => sum + fila.pacientes, 0) ?? 0
  const esperaMax = urgencias ? Math.max(...urgencias.por_triage.map((fila) => fila.minutos), 1) : 1
  const cortos = medicamentos.filter((med) => med.dias < 5).length
  const enCirugia = quirofanos.filter((sala) => sala.estado === 'EN_CIRUGIA').length
  const programadas = quirofanos.reduce((sum, sala) => sum + sala.programadas, 0)
  const realizadas = quirofanos.reduce((sum, sala) => sum + sala.realizadas, 0)

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <h1>Reportes y análisis</h1>
          <p className="muted">Turno de hoy · Sede La Ladera · {fechaCorta()}</p>
        </div>
        <div className="tabs" role="tablist" aria-label="Tipo de reporte">
          <button className={tab === 'ocupacion' ? 'active' : ''} type="button" role="tab" aria-selected={tab === 'ocupacion'} onClick={() => setTab('ocupacion')}>Ocupación</button>
          <button className={tab === 'urgencias' ? 'active' : ''} type="button" role="tab" aria-selected={tab === 'urgencias'} onClick={() => setTab('urgencias')}>Urgencias</button>
          <button className={tab === 'quirofanos' ? 'active' : ''} type="button" role="tab" aria-selected={tab === 'quirofanos'} onClick={() => setTab('quirofanos')}>Quirófanos</button>
          <button className={tab === 'farmacia' ? 'active' : ''} type="button" role="tab" aria-selected={tab === 'farmacia'} onClick={() => setTab('farmacia')}>Farmacia</button>
        </div>
      </header>

      {tab === 'ocupacion' && (
        <section className="mini-kpis">
          <article className="card kpi">
            <span>Ocupación</span>
            <strong>{camas.total ? `${camas.pct}%` : '—'}</strong>
            <em>{camas.ocupadas} de {camas.total} camas</em>
          </article>
          <article className="card kpi">
            <span>En aseo</span>
            <strong>{camas.limpieza}</strong>
            <em>Esperan el clic de limpieza</em>
          </article>
          <article className="card kpi">
            <span>Servicio más lleno</span>
            <strong className="texto">{pico ? nombre(pico.nombre) : '—'}</strong>
            <em>{pico ? `${ocupacion(pico)}% de ocupación` : 'Sin pabellones'}</em>
          </article>
        </section>
      )}
      {tab === 'urgencias' && (
        <section className="mini-kpis">
          <article className="card kpi">
            <span>Espera puerta-médico</span>
            <strong>{urgencias ? `${urgencias.espera_promedio} min` : '—'}</strong>
            <em>Promedio de la muestra</em>
          </article>
          <article className="card kpi">
            <span>Pacientes</span>
            <strong>{urgencias ? pacientes : '—'}</strong>
            <em>En los niveles de triage</em>
          </article>
          <article className="card kpi">
            <span>Niveles</span>
            <strong>{urgencias ? urgencias.por_triage.length : '—'}</strong>
            <em>Con tiempo publicado</em>
          </article>
        </section>
      )}
      {tab === 'quirofanos' && (
        <section className="mini-kpis">
          <article className="card kpi">
            <span>En cirugía</span>
            <strong>{quirofanos.length ? `${enCirugia} / ${quirofanos.length}` : '—'}</strong>
            <em>Salas del turno</em>
          </article>
          <article className="card kpi">
            <span>Programadas</span>
            <strong>{programadas}</strong>
            <em>En la agenda</em>
          </article>
          <article className="card kpi">
            <span>Realizadas</span>
            <strong>{realizadas}</strong>
            <em>Ya salieron de sala</em>
          </article>
        </section>
      )}
      {tab === 'farmacia' && (
        <section className="mini-kpis">
          <article className="card kpi">
            <span>Referencias</span>
            <strong>{medicamentos.length}</strong>
            <em>En el inventario</em>
          </article>
          <article className={`card kpi${cortos ? ' alert' : ''}`}>
            <span>Menos de 5 días</span>
            <strong>{cortos}</strong>
            <em>Entran a la alerta</em>
          </article>
          <article className="card kpi">
            <span>Consumo diario</span>
            <strong>{cantidad(medicamentos.reduce((sum, med) => sum + med.consumo_diario_promedio, 0))}</strong>
            <em>Unidades al día</em>
          </article>
        </section>
      )}

      <section className="card">
        {tab === 'ocupacion' && (
          <table className="tabla">
            <thead>
              <tr><th>Servicio</th><th>Piso</th><th>Ocupadas</th><th>Limpieza</th><th>Libres</th><th>Ocupación</th></tr>
            </thead>
            <tbody>
              {pabellones.map((pabellon) => (
                <tr key={pabellon.nombre}>
                  <td>{nombre(pabellon.nombre)}</td>
                  <td>{pabellon.piso}</td>
                  <td>{pabellon.ocupadas}</td>
                  <td>{pabellon.limpieza}</td>
                  <td>{pabellon.libres}</td>
                  <td><BarraPct valor={ocupacion(pabellon)} /></td>
                </tr>
              ))}
              {pabellones.length === 0 && (
                <tr><td colSpan={6}>Todavía no llegan los pabellones.</td></tr>
              )}
            </tbody>
          </table>
        )}
        {tab === 'urgencias' && !urgencias && <p className="muted">Sin datos de urgencias.</p>}
        {tab === 'urgencias' && urgencias && (
          <table className="tabla">
            <thead>
              <tr><th>Triage</th><th>Espera</th><th>Pacientes</th></tr>
            </thead>
            <tbody>
              {urgencias.por_triage.map((fila) => (
                <tr key={fila.nivel}>
                  <td>
                    <span className="triage-dot" style={{ background: TRIAGE[fila.nivel - 1] }} />
                    Triage {fila.nivel}
                  </td>
                  <td><BarraPct valor={fila.minutos} max={esperaMax} /></td>
                  <td>{fila.pacientes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {tab === 'quirofanos' && (
          <table className="tabla">
            <thead>
              <tr><th>Sala</th><th>Tipo</th><th>Programadas</th><th>Realizadas</th><th>Estado</th></tr>
            </thead>
            <tbody>
              {quirofanos.map((sala) => (
                <tr key={sala.id_quirofano}>
                  <td>{sala.nombre_sala}</td>
                  <td>{fraseCodigo(sala.tipo_quirofano)}</td>
                  <td>{sala.programadas}</td>
                  <td>{sala.realizadas}</td>
                  <td>
                    <span className={sala.estado === 'EN_CIRUGIA' ? 'tag busy' : 'tag'}>
                      {sala.estado === 'EN_CIRUGIA' ? 'En cirugía' : 'Disponible'}
                    </span>
                  </td>
                </tr>
              ))}
              {quirofanos.length === 0 && (
                <tr><td colSpan={5}>Sin salas cargadas.</td></tr>
              )}
            </tbody>
          </table>
        )}
        {tab === 'farmacia' && (
          <table className="tabla">
            <thead>
              <tr><th>Medicamento</th><th>Stock</th><th>Consumo / día</th><th>Cobertura</th><th>Estado</th></tr>
            </thead>
            <tbody>
              {medicamentos.map((med) => (
                <tr key={med.nombre_generico}>
                  <td>{med.nombre_generico}</td>
                  <td>{med.stock_actual}</td>
                  <td>{cantidad(med.consumo_diario_promedio)}</td>
                  <td>{diasTexto(med.dias)}</td>
                  <td>
                    <span className={med.dias < 5 ? (med.es_critico ? 'tag hot' : 'tag warn') : 'tag'}>
                      {med.dias < 5 ? (med.es_critico ? 'Crítico' : 'Corto') : 'Estable'}
                    </span>
                  </td>
                </tr>
              ))}
              {medicamentos.length === 0 && (
                <tr><td colSpan={5}>Sin inventario cargado.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}

const TABLAS: {
  id: string
  nombre: string
  vista: string
  para: string
  campos: { nombre: string; detalle: string }[]
}[] = [
  {
    id: 'servicios',
    nombre: 'Servicios',
    vista: 'Camas y ocupación',
    para: 'Los pabellones de La Ladera. De aquí salen el nombre, el piso y el cupo con el que se calcula el porcentaje.',
    campos: [
      { nombre: 'nombre_servicio', detalle: 'Código del pabellón. En pantalla se lee UCI adultos, Urgencias, Medicina interna, Pediatría o Cirugía.' },
      { nombre: 'piso_pabellon', detalle: 'Piso de la sede. Aparece junto al servicio en Camas y en el reporte de ocupación.' },
      { nombre: 'capacidad_total_camas', detalle: 'Cupo del servicio. La ocupación compara las camas ocupadas contra este total.' },
    ],
  },
  {
    id: 'camas',
    nombre: 'Camas',
    vista: 'Camas, aseo y alertas',
    para: 'Cada cama con su código y su estado. El clic de aseo solo cambia una cama que está en limpieza.',
    campos: [
      { nombre: 'codigo_cama', detalle: 'El código que se busca, por ejemplo UCI-18 o URG-02.' },
      { nombre: 'estado_cama', detalle: 'OCUPADA, DISPONIBLE, EN_LIMPIEZA o MANTENIMIENTO. Aseo solo pasa de EN_LIMPIEZA a DISPONIBLE.' },
      { nombre: 'id_servicio', detalle: 'El pabellón al que pertenece. Así se arma el grupo de cada piso.' },
    ],
  },
  {
    id: 'medicamentos',
    nombre: 'Medicamentos',
    vista: 'Farmacia y alertas',
    para: 'Inventario del turno. Los días de cobertura son el stock dividido por el consumo diario. Menos de 5 días enciende la alerta.',
    campos: [
      { nombre: 'nombre_generico', detalle: 'Cómo se lista el fármaco en Farmacia y en la alerta.' },
      { nombre: 'stock_actual', detalle: 'Unidades que hay ahora.' },
      { nombre: 'consumo_diario_promedio', detalle: 'Lo que se gasta en un día. Sirve para los días de cobertura y para el consumo por familia.' },
      { nombre: 'es_critico', detalle: '1 si el fármaco no puede faltar. Esa marca vuelve la alerta urgente.' },
    ],
  },
  {
    id: 'episodios_admision',
    nombre: 'Admisiones',
    vista: 'Urgencias',
    para: 'La muestra del turno: cuándo entró la persona y cuándo la vio el médico. La espera puerta-médico es esa diferencia.',
    campos: [
      { nombre: 'id_servicio_ingreso', detalle: 'Servicio por el que entró. En la muestra, urgencias.' },
      { nombre: 'fecha_hora_ingreso', detalle: 'Hora de llegada a la puerta.' },
      { nombre: 'fecha_hora_atencion_medica', detalle: 'Hora de la atención. Con el ingreso arma los minutos de espera.' },
    ],
  },
  {
    id: 'triages',
    nombre: 'Triage',
    vista: 'Frase del turno',
    para: 'El nivel y la nota que ya escribió el médico. La frase grande del inicio sale de esa nota, no de un texto inventado.',
    campos: [
      { nombre: 'nivel_triage', detalle: 'Del 1 al 5. Colorea la espera y la distribución de Urgencias.' },
      { nombre: 'nota_triage', detalle: 'El texto del médico. ANA IA lo pone donde el jefe de turno lo ve.' },
      { nombre: 'id_admision', detalle: 'Une la nota con el episodio de ingreso.' },
    ],
  },
  {
    id: 'quirofanos',
    nombre: 'Quirófanos',
    vista: 'Quirófanos',
    para: 'Cada sala con lo programado, lo realizado y si está en cirugía.',
    campos: [
      { nombre: 'nombre_sala', detalle: 'Nombre que se ve en la lista, por ejemplo Quirófano 2 - Laparoscopia.' },
      { nombre: 'tipo_quirofano', detalle: 'Cirugía mayor o urgencias.' },
      { nombre: 'estado', detalle: 'EN_CIRUGIA o DISPONIBLE.' },
      { nombre: 'programadas', detalle: 'Cirugías de la agenda.' },
      { nombre: 'realizadas', detalle: 'Cirugías que ya salieron de sala.' },
    ],
  },
]

export function Diccionario() {
  const [id, setId] = useState(TABLAS[0].id)
  const activa = TABLAS.find((tabla) => tabla.id === id) ?? TABLAS[0]

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <h1>Diccionario de datos</h1>
          <p className="muted">Las tablas del backend y el campo del que sale cada número</p>
        </div>
      </header>
      <article className="card dict-lead">
        <Cruz className="cross sm mint" />
        <div>
          <h2>Para qué está esta vista</h2>
          <p>No calcula el turno. Nombra las tablas que ya guarda el backend, para saber de dónde sale una cama, una alerta, un medicamento o la frase del inicio.</p>
        </div>
      </article>
      <section className="catalogo">
        <article className="card catalogo-nav">
          <header className="card-head"><h2>Tablas</h2></header>
          {TABLAS.map((tabla) => (
            <button
              key={tabla.id}
              type="button"
              className={activa.id === tabla.id ? 'active' : ''}
              aria-pressed={activa.id === tabla.id}
              onClick={() => setId(tabla.id)}
            >
              <strong>{tabla.nombre}</strong>
              <span>{tabla.vista}</span>
            </button>
          ))}
        </article>
        <article className="card">
          <header className="card-head catalogo-head">
            <div>
              <p className="eyebrow">{activa.vista}</p>
              <h2>{activa.nombre}</h2>
            </div>
            <span className="tag">{activa.campos.length} campos</span>
          </header>
          <p className="muted">{activa.para}</p>
          <div className="campos">
            {activa.campos.map((campo) => (
              <div className="campo" key={campo.nombre}>
                <code>{campo.nombre}</code>
                <p>{campo.detalle}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  )
}

export function Hospital() {
  return (
    <div className="page">
      <section className="hero hospital-hero">
        <img src="/fachada-susana.png" alt="Fachada del Hospital Susana López de Valencia, edificio blanco y montañas del Cauca." />
        <div className="hero-veil" />
        <div className="hero-copy">
          <p className="eyebrow">E.S.E. · Popayán, Cauca</p>
          <h1>Hospital Susana López de Valencia</h1>
          <p>Inteligencia que cuida, decisiones que salvan.</p>
          <div className="hero-pills">
            <span>Sede La Ladera</span>
            <span>Ciudad Blanca</span>
            <span>CP 190004</span>
          </div>
        </div>
      </section>

      <section className="sede-grid">
        <article className="card sede-feature">
          <img src="/pasillo-susana.png" alt="Pasillo del hospital con luz de la mañana." />
          <div className="sede-copy">
            <p className="eyebrow">Sede principal</p>
            <h2>La Ladera</h2>
            <p>Calle 15 No. 17A-196</p>
            <p>Popayán, Cauca</p>
            <span className="tag">Lunes a viernes · 7:00 a.m. a 5:00 p.m.</span>
          </div>
        </article>
        <div className="sede-side">
          <article className="card sede-copy">
            <span className="kpi-icon"><Icon name="hospital" /></span>
            <h2>San Camilo</h2>
            <p>Carrera 8 No. 9-66, Popayán.</p>
            <p className="muted">Lunes a viernes, de 7:00 a.m. a 5:00 p.m.</p>
          </article>
          <article className="card sede-copy">
            <span className="kpi-icon"><Icon name="pin" /></span>
            <h2>Contacto</h2>
            <p className="telefono">(600) 838 636</p>
            <p className="telefono secundario">(+57) 318 821 1483</p>
          </article>
        </div>
      </section>

      <section className="principles in-page">
        {PRINCIPIOS.map(([titulo, detalle]) => (
          <div className="principle" key={titulo}>
            <span className="dot">{titulo.slice(0, 1)}</span>
            <div>
              <strong>{titulo}</strong>
              <span>{detalle}</span>
            </div>
          </div>
        ))}
      </section>

      <section className="lema">
        <div>
          <strong>Mejores datos, mejores decisiones, una atención más humana.</strong>
          <span>ANA IA · Centro de inteligencia operacional hospitalaria</span>
        </div>
        <Cruz className="cross sm" />
      </section>
    </div>
  )
}
