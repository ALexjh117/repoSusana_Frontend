import { ocupacion, type Alerta, type Frase, type Medicamento, type Pabellon, type Pulso, type Quirofano, type Urgencias } from '../api'
import { AccionesTurno, Cruz, EsperaChart, Icon, RobotFace } from '../components'
import { fichaAviso, textoAlerta } from '../lib/avisos'
import { fechaCorta, nombre, resumenCamas, saludo, tono } from '../lib/format'
import { cantidad, diasTexto } from '../lib/numeros'
import { PRINCIPIOS } from '../lib/principios'
import { fraseCodigo } from '../lib/texto'

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
        <img src="/hospital-umi.jpg" alt="Edificio de UMI Pediatría del Hospital Susana López de Valencia, Popayán." />
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

      <AccionesTurno pulso={pulso} onAbrir={onAbrirAccion} />

      <section className="inicio-grid inicio-primary-grid">
        <article className="inicio-panel inicio-services-panel">
          <header className="inicio-panel-head">
            <div>
              <p className="inicio-section-kicker">Capacidad por servicio</p>
              <h2>Estado de los servicios</h2>
            </div>
            <span className="inicio-count-pill">{pabellones.length} servicios</span>
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
