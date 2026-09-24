import { useMemo, useState } from 'react'
import { ocupacion, type Alerta, type Frase, type Medicamento, type Pabellon, type Quirofano, type Urgencias } from './api'
import { Cruz, Donut, EsperaChart, fechaCorta, Icon, nombre, resumenCamas, saludo, tono } from './bits'

const PRINCIPIOS = [
  ['Deriva', 'Abre el servicio de la pregunta'],
  ['Explica', 'Muestra el número y la nota'],
  ['Anticipa', 'Avisa lo que se está acabando'],
  ['Simula', 'Compara programado y hecho'],
  ['Decide', 'Deja el pulso en el turno'],
] as const

const TRIAGE = ['#e25b4a', '#e07a3a', '#e0a33a', '#1a9a62', '#3d8fd1']

export function HomePublic({ onLogin }: { onLogin: () => void }) {
  return (
    <main className="public-home">
      <header className="public-nav">
        <a className="public-logo" href="#inicio" aria-label="Hospital Susana López de Valencia">
          <img src="/logo-hospital-susana-transparent.png" alt="Hospital Susana López de Valencia E.S.E." />
        </a>
        <nav className="public-links" aria-label="Navegación principal">
          <a className="active" href="#inicio">Inicio</a>
          <a href="#nosotros">Nosotros</a>
          <a href="#servicios">Servicios</a>
          <a href="#susana">SUSANA IA</a>
        </nav>
        <button className="btn public-login" type="button" onClick={onLogin}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0" /></svg>
          Iniciar sesión
        </button>
      </header>

      <section className="public-hero" id="inicio">
        <img src="/fachada-susana.png" alt="Hospital Susana López de Valencia" />
        <div className="public-hero-veil" />
        <div className="public-hero-inner">
          <div className="public-hero-copy">
            <p className="eyebrow">E.S.E. · POPAYÁN, CAUCA</p>
            <h1>Salud que conecta,<br /><em>inteligencia que cuida.</em></h1>
            <p className="lead">Un hospital que pone a las personas en el centro y utiliza datos e inteligencia para tomar mejores decisiones en cada turno.</p>
            <div className="public-actions">
              <button className="btn" type="button" onClick={onLogin}>Entrar a SUSANA IA <span aria-hidden="true">→</span></button>
              <a className="btn ghost light" href="#nosotros">Conocer el hospital <span aria-hidden="true">↓</span></a>
            </div>
          </div>

          <aside className="public-qr-card" aria-label="Acceso a SUSANA IA">
            <div className="public-qr-title">Escanea el QR</div>
            <p>para acceder a<br />SUSANA IA</p>
            <div className="public-qr">
              <div className="qr-corner tl" /><div className="qr-corner tr" /><div className="qr-corner bl" />
              <div className="qr-pattern" aria-hidden="true">
                <i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i />
                <i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i />
              </div>
            </div>
            <small><span className="qr-phone" aria-hidden="true">▣</span> También puedes<br /><strong>iniciar sesión desde aquí</strong></small>
          </aside>
        </div>

        <div className="public-hero-bottom">
          <span><b className="value-icon">♡</b> Atención humana</span>
          <span><b className="value-icon">⌁</b> Decisiones basadas en datos</span>
          <span><b className="value-icon">♧</b> Compromiso con Popayán</span>
        </div>
      </section>

      <section className="public-section public-about" id="nosotros">
        <div className="public-about-copy">
          <p className="eyebrow dark">NOSOTROS</p>
          <h2>Una mirada completa<br />al hospital, una decisión<br />a la vez.</h2>
          <p>Somos una institución pública al servicio de Popayán y el Cauca. SUSANA IA integra la información operacional para ayudar a los equipos a entender lo que está pasando y actuar oportunamente.</p>
          <a className="public-outline" href="#servicios">Conoce más sobre nosotros <span aria-hidden="true">→</span></a>
        </div>
        <div className="public-about-cards">
          <article className="public-feature-card">
            <span className="public-feature-icon">♧</span>
            <h3>Compromiso<br />con la comunidad</h3>
            <p>Trabajamos por una salud más cercana, humana y de calidad.</p>
          </article>
          <article className="public-feature-card">
            <span className="public-feature-icon">✓</span>
            <h3>Excelencia<br />en el servicio</h3>
            <p>Profesionales y tecnología al servicio de la vida.</p>
          </article>
          <article className="public-feature-card">
            <span className="public-feature-icon">♡</span>
            <h3>Bienestar<br />para todos</h3>
            <p>Tu salud y la de tu familia es nuestra prioridad.</p>
          </article>
        </div>
        <div className="public-about-watermark" aria-hidden="true">✦</div>
      </section>

      <section className="public-section public-services" id="servicios">
        <div className="public-services-head">
          <div>
            <p className="eyebrow dark">SERVICIOS</p>
            <h2>Todo lo que necesitas,<br />en un solo lugar.</h2>
          </div>
          <p>Ofrecemos servicios hospitalarios integrales con el respaldo de un equipo comprometido y tecnología de vanguardia.</p>
        </div>
        <div className="public-service-grid">
          <article className="public-service-card">
            <span className="service-icon">▰</span><span className="service-arrow">→</span>
            <h3>Hospitalización</h3><p>Camas y servicios<br />de hospitalización</p>
          </article>
          <article className="public-service-card">
            <span className="service-icon">✚</span><span className="service-arrow">→</span>
            <h3>Urgencias</h3><p>Atención 24/7</p>
          </article>
          <article className="public-service-card">
            <span className="service-icon">♧</span><span className="service-arrow">→</span>
            <h3>Quirófanos</h3><p>Procedimientos seguros<br />y especializados</p>
          </article>
          <article className="public-service-card">
            <span className="service-icon">▣</span><span className="service-arrow">→</span>
            <h3>Farmacia</h3><p>Medicamentos y<br />dispositivos médicos</p>
          </article>
          <article className="public-service-card">
            <span className="service-icon service-icon-blue">▤</span><span className="service-arrow">→</span>
            <h3>Reportes</h3><p>Información clara<br />y en tiempo real</p>
          </article>
        </div>
      </section>

      <section className="public-susana" id="susana">
        <div className="public-susana-copy">
          <div className="public-susana-brand">
            <img src="/logo-hospital-susana-transparent.png" alt="" />
            <div><strong>SUSANA IA</strong><span>Tu asistente inteligente del hospital</span></div>
          </div>
          <p>Consulta el estado del hospital, resuelve dudas, y toma mejores decisiones con información confiable y actualizada.</p>
          <button className="btn" type="button" onClick={onLogin}>Entrar a SUSANA IA <span aria-hidden="true">→</span></button>
          <div className="public-susana-slogan">La tecnología<br />también cuida <span>♡</span></div>
        </div>
        <div className="public-susana-image">
          <img src="/pasillo-susana.png" alt="Interior del Hospital Susana López de Valencia" />
        </div>
        <div className="public-leaf" aria-hidden="true">◢</div>
      </section>

      <footer className="public-footer">
        <div className="public-footer-main">
          <div className="public-footer-brand">
            <img src="/logo-hospital-susana-transparent.png" alt="Hospital Susana López de Valencia E.S.E." />
          </div>
          <div className="public-footer-address">
            <span className="footer-pin">⌖</span>
            <span>Calle 15 No. 17A-196 · E.S.E.<br />Popayán, Cauca</span>
          </div>
          <div className="public-socials" aria-label="Redes sociales">
            <a href="#" aria-label="Facebook">f</a>
            <a href="#" aria-label="Instagram">◎</a>
            <a href="#" aria-label="YouTube">▶</a>
          </div>
          <div className="public-footer-slogan">Juntos por una salud<br /><em>más humana y eficiente</em></div>
        </div>
        <div className="public-footer-bottom">© 2025 Hospital Susana López de Valencia E.S.E. Todos los derechos reservados.</div>
      </footer>
    </main>
  )
}

export function Login({ onEnter, onBack }: { onEnter: () => void; onBack?: () => void }) {
  const [aviso, setAviso] = useState('')
  const [mostrarClave, setMostrarClave] = useState(false)
  return (
    <main className="login">
      <section className="login-hero">
        <img src="/fachada-susana.png" alt="Fachada del Hospital Susana López de Valencia en la ladera, con las montañas del Cauca al fondo." />
        <div className="login-shade" />
        <div className="login-top">
          <div className="official-logo login-logo">
            <img src="/logo-hospital-susana-transparent.png" alt="Hospital Susana López de Valencia E.S.E." />
          </div>
          <div className="login-top-actions">{onBack && <button className="back-home" type="button" onClick={onBack}>← Volver al inicio</button>}<span className="sede-pill">E.S.E. · Popayán</span></div>
        </div>
        <div className="login-copy">
          <p className="eyebrow">Sede La Ladera · Ciudad Blanca</p>
          <h1>SUSANA <em>IA</em></h1>
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
          <div className="login-input-wrap">
            <span className="field-icon" aria-hidden="true">◉</span>
            <input id="usuario" defaultValue="carlos.torres" autoComplete="username" placeholder="Ingresa tu usuario" />
          </div>
          <label htmlFor="clave">Contraseña</label>
          <div className="login-input-wrap">
            <span className="field-icon" aria-hidden="true">▣</span>
            <input id="clave" type={mostrarClave ? 'text' : 'password'} defaultValue="demo" autoComplete="current-password" placeholder="Ingresa tu contraseña" />
            <button className="password-toggle" type="button" aria-label={mostrarClave ? 'Ocultar contraseña' : 'Mostrar contraseña'} aria-pressed={mostrarClave} onClick={() => setMostrarClave((actual) => !actual)}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.4-5 9.5-5 9.5 5 9.5 5-3.4 5-9.5 5-9.5-5-9.5-5Z"/><circle cx="12" cy="12" r="2.5"/>{mostrarClave ? null : <path d="m4 4 16 16"/>}</svg>
            </button>
          </div>
          <div className="login-options">
            <label className="remember"><input type="checkbox" /> <span>Recordarme</span></label>
            <button className="linkish" type="button" onClick={() => setAviso('En esta demo el turno entra con el usuario del jefe.')}>¿Olvidaste tu contraseña?</button>
          </div>
          <button className="btn full" type="submit">Iniciar sesión</button>
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
}) {
  const camas = resumenCamas(pabellones)
  const enCirugia = quirofanos.filter((sala) => sala.estado === 'EN_CIRUGIA').length
  const uso = quirofanos.length ? Math.round((enCirugia * 100) / quirofanos.length) : 0
  const criticos = medicamentos.filter((med) => med.dias < 5).length
  const urgentes = alertas.filter((alerta) => alerta.urgente).length

  return (
    <div className="page">
      <section className="hero">
        <img src="/pasillo-susana.png" alt="" />
        <div className="hero-veil" />
        <div className="hero-copy">
          <p className="eyebrow">{saludo()}, Dr. Carlos</p>
          <h1>{frase?.texto ?? 'Cargando el pulso del turno…'}</h1>
          <p>
            {frase
              ? `${frase.detalle} Aparece en ${frase.notas.toLocaleString('es-CO')} notas de triage.`
              : 'Sede La Ladera · Popayán, Cauca'}
          </p>
        </div>
      </section>

      <section className="kpis">
        <article className="card kpi">
          <div className="kpi-top">
            <span>Ocupación hospitalaria</span>
            <span className="kpi-icon"><Icon name="camas" /></span>
          </div>
          <strong>{pabellones.length ? `${camas.pct}%` : '—'}</strong>
          <em>{camas.total ? `${camas.ocupadas} de ${camas.total} camas` : 'Sin camas cargadas'}</em>
        </article>
        <article className="card kpi">
          <div className="kpi-top">
            <span>Espera en urgencias</span>
            <span className="kpi-icon"><Icon name="urgencias" /></span>
          </div>
          <strong>{urgencias ? `${urgencias.espera_promedio} min` : '—'}</strong>
          <em>Puerta a médico</em>
        </article>
        <article className="card kpi">
          <div className="kpi-top">
            <span>Uso de quirófanos</span>
            <span className="kpi-icon"><Icon name="quirofanos" /></span>
          </div>
          <strong>{quirofanos.length ? `${uso}%` : '—'}</strong>
          <em>{quirofanos.length ? `${enCirugia} de ${quirofanos.length} en cirugía` : 'Sin salas'}</em>
        </article>
        <article className={`card kpi${urgentes ? ' alert' : ''}`}>
          <div className="kpi-top">
            <span>Alertas críticas</span>
            <span className="kpi-icon"><Icon name="alertas" /></span>
          </div>
          <strong>{urgentes}</strong>
          <em>Requieren mirada</em>
        </article>
        <article className={`card kpi${criticos ? ' alert' : ''}`}>
          <div className="kpi-top">
            <span>Medicamentos críticos</span>
            <span className="kpi-icon"><Icon name="farmacia" /></span>
          </div>
          <strong>{criticos}</strong>
          <em>Menos de 5 días</em>
        </article>
      </section>

      <section className="dash-main">
        <article className="card">
          <header className="card-head">
            <h2>Estado por servicio</h2>
          </header>
          <div className="bars">
            {pabellones.map((pabellon) => {
              const pct = ocupacion(pabellon)
              return (
                <div className="bar-row" key={pabellon.nombre}>
                  <span>{nombre(pabellon.nombre)}</span>
                  <div className="track"><div className={`fill ${tono(pct)}`} style={{ width: `${pct}%` }} /></div>
                  <strong>{pct}%</strong>
                </div>
              )
            })}
            {pabellones.length === 0 && <p className="muted">Todavía no llegan los pabellones.</p>}
          </div>
        </article>
        <article className="card">
          <header className="card-head">
            <h2>Espera por triage</h2>
          </header>
          {urgencias ? (
            <>
              <EsperaChart puntos={urgencias.por_triage} />
              <div className="chart-labels">
                {urgencias.por_triage.map((fila) => (
                  <span key={fila.nivel}>Triage {fila.nivel}<br />{fila.minutos} min</span>
                ))}
              </div>
            </>
          ) : (
            <p className="muted">Sin datos de urgencias.</p>
          )}
        </article>
        <article className="card">
          <header className="card-head">
            <h2>Alertas recientes</h2>
          </header>
          {alertas.slice(0, 4).map((alerta) => (
            <div className={alerta.urgente ? 'alerta urgente' : 'alerta'} key={`${alerta.tipo}-${alerta.texto}`}>
              <p>{alerta.texto}</p>
            </div>
          ))}
          {alertas.length === 0 && <p className="muted">Sin alertas en este turno.</p>}
          <button className="btn ghost" type="button" onClick={onVerAlertas}>Ver todas</button>
        </article>
      </section>

      <section className="card susana-card">
        <Cruz className="cross sm" />
        <div>
          <strong>SUSANA IA</strong>
          <p>Pregúntame por UCI, medicamentos, espera o el servicio con más ingresos.</p>
          <div className="chips plain">
            {preguntas.slice(0, 2).map((pregunta) => (
              <button className="chip" key={pregunta} type="button" onClick={() => onPreguntar(pregunta)}>
                {pregunta}
              </button>
            ))}
          </div>
        </div>
        <button className="btn" type="button" onClick={onAbrirChat}>Hablar con SUSANA</button>
      </section>

      <footer className="principles">
        <div className="principle-brand">
          <Cruz className="cross sm" />
          <div>
            <strong>SUSANA IA</strong>
            <span>Centro de inteligencia operacional hospitalaria</span>
          </div>
        </div>
        {PRINCIPIOS.map(([titulo, detalle]) => (
          <div className="principle" key={titulo}>
            <span className="dot">{titulo.slice(0, 1)}</span>
            <div>
              <strong>{titulo}</strong>
              <span>{detalle}</span>
            </div>
          </div>
        ))}
        <p className="slogan">Mejores datos, mejores decisiones, una atención más humana.</p>
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

  const encontrada = useMemo(() => {
    const codigo = busqueda.trim().toUpperCase()
    if (!codigo) return null
    return pabellones.flatMap((item) => item.camas).find((cama) => cama.codigo_cama.toUpperCase() === codigo) ?? null
  }, [busqueda, pabellones])

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <h1>Ocupación de camas</h1>
          <p className="muted">Sede La Ladera · {fechaCorta()}</p>
        </div>
      </header>
      <section className="split">
        <article className="card ocupacion-card">
          <div className="donut-wrap">
            <Donut parts={partes} />
            <div className="donut-label">
              <strong>{camas.total ? `${camas.pct}%` : '—'}</strong>
              <span>ocupadas</span>
            </div>
          </div>
          <p className="muted">{camas.ocupadas} de {camas.total} camas</p>
          <ul className="legend">
            {partes.filter((parte) => parte.value > 0).map((parte) => (
              <li key={parte.label}><i style={{ background: parte.color }} />{parte.label} · {parte.value}</li>
            ))}
          </ul>
        </article>
        <article className="card">
          <header className="card-head"><h2>Por servicio</h2></header>
          <div className="bars">
            {pabellones.map((pabellon) => {
              const pct = ocupacion(pabellon)
              return (
                <div className="bar-row" key={pabellon.nombre}>
                  <span>{nombre(pabellon.nombre)}</span>
                  <div className="track"><div className={`fill ${tono(pct)}`} style={{ width: `${pct}%` }} /></div>
                  <strong>{pct}%</strong>
                </div>
              )
            })}
          </div>
        </article>
      </section>

      <article className="card">
        <header className="card-head">
          <h2>Aseo de camas</h2>
        </header>
        <p className="muted">El ojo muestra solo tres números. La lista abre únicamente las camas que aseo puede marcar.</p>
        <input className="search" value={busqueda} onChange={(event) => setBusqueda(event.target.value)} placeholder="Buscar por código, por ejemplo UCI-18" aria-label="Buscar cama por código" />
        {busqueda && (
          <div className="limpieza" style={{ marginTop: 12 }}>
            {encontrada ? (
              <>
                <div>
                  <strong>{encontrada.codigo_cama}</strong>
                  <div className="muted">{nombre(encontrada.nombre_servicio)} · {encontrada.estado_cama.replaceAll('_', ' ')}</div>
                </div>
                {encontrada.estado_cama === 'EN_LIMPIEZA' && (
                  <button className="btn" type="button" onClick={() => { void onLimpiar(encontrada.id_cama).then(() => setAviso(`${encontrada.codigo_cama} ya está disponible para recepción.`)).catch(() => setAviso('No se pudo marcar la cama.')) }}>
                    Ya está limpia
                  </button>
                )}
              </>
            ) : (
              <p>No hay una cama con ese código.</p>
            )}
          </div>
        )}
        <div className="servicios">
          {pabellones.map((pabellon) => {
            const enLimpieza = pabellon.camas.filter((cama) => cama.estado_cama === 'EN_LIMPIEZA')
            return (
              <div key={pabellon.nombre}>
                <div className={abierto === pabellon.nombre ? 'service open' : 'service'}>
                  <button type="button" onClick={() => setAbierto(abierto === pabellon.nombre ? null : pabellon.nombre)}>
                    <strong>{nombre(pabellon.nombre)}</strong>
                    <span className="muted">{pabellon.piso}</span>
                    <div className="track"><div className={`fill ${tono(ocupacion(pabellon))}`} style={{ width: `${ocupacion(pabellon)}%` }} /></div>
                  </button>
                  <button className="eye" type="button" aria-pressed={ojo === pabellon.nombre} aria-label={`Ver conteo de ${nombre(pabellon.nombre)}`} onClick={() => setOjo(ojo === pabellon.nombre ? null : pabellon.nombre)}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                </div>
                {ojo === pabellon.nombre && (
                  <p className="conteo">{pabellon.ocupadas} ocupadas · {pabellon.limpieza} en limpieza · {pabellon.libres} libres</p>
                )}
                {abierto === pabellon.nombre && (
                  <div className="aseo-list">
                    {enLimpieza.length === 0 && <p className="muted">Este servicio no tiene camas en limpieza.</p>}
                    {enLimpieza.map((cama) => (
                      <div className="limpieza" key={cama.id_cama}>
                        <strong>{cama.codigo_cama}</strong>
                        <button
                          className="btn"
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
            )
          })}
        </div>
        {aviso && <p role="status">{aviso}</p>}
      </article>
    </div>
  )
}

export function Urgencias({ urgencias }: { urgencias: Urgencias | null }) {
  if (!urgencias) return <p className="muted">Sin datos de urgencias.</p>
  const pacientes = urgencias.por_triage.reduce((sum, fila) => sum + fila.pacientes, 0)
  const triageUno = urgencias.por_triage.find((fila) => fila.nivel === 1)
  const max = Math.max(...urgencias.por_triage.map((fila) => fila.minutos), 1)
  return (
    <div className="page">
      <header className="page-head">
        <div>
          <h1>Gestión de urgencias</h1>
          <p className="muted">Sede La Ladera · {fechaCorta()}</p>
        </div>
      </header>
      <section className="mini-kpis">
        <article className="card kpi">
          <span>Pacientes en muestra</span>
          <strong>{pacientes}</strong>
        </article>
        <article className="card kpi">
          <span>Tiempo promedio</span>
          <strong>{urgencias.espera_promedio} min</strong>
        </article>
        <article className="card kpi">
          <span>Triage I</span>
          <strong>{triageUno ? `${triageUno.minutos} min` : '—'}</strong>
        </article>
      </section>
      <section className="split">
        <article className="card">
          <header className="card-head"><h2>Tiempo de espera por triage</h2></header>
          <div className="cols espera-cols">
            {urgencias.por_triage.map((fila) => (
              <div className="col-group" key={fila.nivel}>
                <div className="col-pair">
                  <div className="col done" style={{ height: `${Math.max(8, (fila.minutos / max) * 110)}px`, background: TRIAGE[fila.nivel - 1] }} />
                </div>
                <span>Triage {fila.nivel}</span>
                <strong>{fila.minutos} min</strong>
              </div>
            ))}
          </div>
        </article>
        <article className="card ocupacion-card">
          <header className="card-head"><h2>Distribución</h2></header>
          <div className="donut-wrap">
            <Donut parts={urgencias.por_triage.map((fila) => ({ value: fila.pacientes, color: TRIAGE[fila.nivel - 1] }))} />
            <div className="donut-label">
              <strong>{pacientes}</strong>
              <span>pacientes</span>
            </div>
          </div>
          <ul className="legend">
            {urgencias.por_triage.map((fila) => (
              <li key={fila.nivel}><i style={{ background: TRIAGE[fila.nivel - 1] }} />Triage {fila.nivel} · {fila.pacientes}</li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  )
}

export function Quirofanos({ quirofanos }: { quirofanos: Quirofano[] }) {
  const enCirugia = quirofanos.filter((sala) => sala.estado === 'EN_CIRUGIA').length
  const programadas = quirofanos.reduce((sum, sala) => sum + sala.programadas, 0)
  const realizadas = quirofanos.reduce((sum, sala) => sum + sala.realizadas, 0)
  const max = Math.max(...quirofanos.flatMap((sala) => [sala.programadas, sala.realizadas]), 1)
  return (
    <div className="page">
      <header className="page-head">
        <div>
          <h1>Gestión de quirófanos</h1>
          <p className="muted">Sede La Ladera · {fechaCorta()}</p>
        </div>
      </header>
      <section className="mini-kpis">
        <article className="card kpi"><span>En cirugía</span><strong>{quirofanos.length ? `${enCirugia} / ${quirofanos.length}` : '—'}</strong></article>
        <article className="card kpi"><span>Programadas</span><strong>{programadas}</strong></article>
        <article className="card kpi"><span>Realizadas</span><strong>{realizadas}</strong></article>
      </section>
      <article className="card">
        <header className="card-head">
          <h2>Programación y realización</h2>
          <div className="leyenda-inline"><i className="swatch mint" /> Programadas <i className="swatch" /> Realizadas</div>
        </header>
        <div className="cols">
          {quirofanos.map((sala) => (
            <div className="col-group" key={sala.id_quirofano}>
              <div className="col-pair">
                {sala.programadas > 0 && <div className="col" style={{ height: `${Math.max(8, (sala.programadas / max) * 110)}px` }} />}
                {sala.realizadas > 0 && <div className="col done" style={{ height: `${Math.max(8, (sala.realizadas / max) * 110)}px` }} />}
              </div>
              <span>{sala.nombre_sala.replace('Quirófano ', 'Q')}</span>
            </div>
          ))}
        </div>
      </article>
      <article className="card">
        <header className="card-head"><h2>Salas del turno</h2></header>
        <div className="sala-list">
          {quirofanos.map((sala) => (
            <div className="sala" key={sala.id_quirofano}>
              <div>
                <strong>{sala.nombre_sala}</strong>
                <div className="muted">{sala.programadas} programadas · {sala.realizadas} realizadas</div>
              </div>
              <span className={sala.estado === 'EN_CIRUGIA' ? 'tag busy' : 'tag'}>
                {sala.estado === 'EN_CIRUGIA' ? 'En cirugía' : 'Disponible'}
              </span>
            </div>
          ))}
        </div>
      </article>
    </div>
  )
}

export function Farmacia({ medicamentos }: { medicamentos: Medicamento[] }) {
  const criticos = medicamentos.filter((med) => med.dias < 5)
  const estables = medicamentos.filter((med) => med.dias >= 5)
  const stockCritico = criticos.reduce((sum, med) => sum + med.stock_actual, 0)
  const stockEstable = estables.reduce((sum, med) => sum + med.stock_actual, 0)
  return (
    <div className="page">
      <header className="page-head">
        <div>
          <h1>Inventario de medicamentos</h1>
          <p className="muted">Sede La Ladera · {fechaCorta()}</p>
        </div>
      </header>
      <section className="mini-kpis">
        <article className="card kpi"><span>Referencias</span><strong>{medicamentos.length}</strong></article>
        <article className="card kpi"><span>Con menos de 5 días</span><strong>{criticos.length}</strong></article>
        <article className="card kpi"><span>Stock en críticos</span><strong>{stockCritico}</strong></article>
      </section>
      <section className="split">
        <article className="card">
          <header className="card-head"><h2>Cobertura corta</h2></header>
          {medicamentos.map((med) => (
            <div className="med" key={med.nombre_generico}>
              <div>
                <strong>{med.nombre_generico}</strong>
                <div className="muted">Stock {med.stock_actual} · {med.dias} días</div>
              </div>
              {med.dias < 5 ? <span className="tag warn">Crítico</span> : <span className="tag">Estable</span>}
            </div>
          ))}
          {medicamentos.length === 0 && <p className="muted">Sin inventario cargado.</p>}
        </article>
        <article className="card ocupacion-card">
          <header className="card-head"><h2>Stock según cobertura</h2></header>
          <div className="donut-wrap">
            <Donut parts={[{ value: stockCritico, color: '#e25b4a' }, { value: stockEstable, color: '#1a9a62' }]} />
            <div className="donut-label">
              <strong>{stockCritico + stockEstable}</strong>
              <span>unidades</span>
            </div>
          </div>
          <ul className="legend">
            <li><i style={{ background: '#e25b4a' }} />Menos de 5 días · {stockCritico}</li>
            <li><i style={{ background: '#1a9a62' }} />Cobertura estable · {stockEstable}</li>
          </ul>
        </article>
      </section>
    </div>
  )
}

export function Alertas({ alertas }: { alertas: Alerta[] }) {
  return (
    <div className="page">
      <header className="page-head">
        <div>
          <h1>Alertas</h1>
          <p className="muted">Lo que el turno no puede dejar pasar</p>
        </div>
      </header>
      <section className="card">
        {alertas.map((alerta) => (
          <div className={alerta.urgente ? 'alerta urgente' : 'alerta'} key={`${alerta.tipo}-${alerta.texto}`}>
            <p>{alerta.texto}</p>
          </div>
        ))}
        {alertas.length === 0 && <p className="muted">Sin alertas en este turno.</p>}
      </section>
    </div>
  )
}

export function Reportes({
  pabellones,
  urgencias,
  medicamentos,
}: {
  pabellones: Pabellon[]
  urgencias: Urgencias | null
  medicamentos: Medicamento[]
}) {
  const [tab, setTab] = useState<'ocupacion' | 'urgencias' | 'farmacia'>('ocupacion')
  return (
    <div className="page">
      <header className="page-head">
        <div>
          <h1>Reportes y análisis</h1>
          <p className="muted">Sede La Ladera · {fechaCorta()}</p>
        </div>
        <div className="tabs" role="tablist">
          <button className={tab === 'ocupacion' ? 'active' : ''} type="button" onClick={() => setTab('ocupacion')}>Ocupación</button>
          <button className={tab === 'urgencias' ? 'active' : ''} type="button" onClick={() => setTab('urgencias')}>Urgencias</button>
          <button className={tab === 'farmacia' ? 'active' : ''} type="button" onClick={() => setTab('farmacia')}>Farmacia</button>
        </div>
      </header>
      <section className="card">
        {tab === 'ocupacion' && (
          <table>
            <thead>
              <tr><th>Servicio</th><th>Ocupadas</th><th>Limpieza</th><th>Libres</th><th>%</th></tr>
            </thead>
            <tbody>
              {pabellones.map((pabellon) => (
                <tr key={pabellon.nombre}>
                  <td>{nombre(pabellon.nombre)}</td>
                  <td>{pabellon.ocupadas}</td>
                  <td>{pabellon.limpieza}</td>
                  <td>{pabellon.libres}</td>
                  <td>{ocupacion(pabellon)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {tab === 'urgencias' && urgencias && (
          <table>
            <thead>
              <tr><th>Triage</th><th>Minutos</th><th>Pacientes</th></tr>
            </thead>
            <tbody>
              {urgencias.por_triage.map((fila) => (
                <tr key={fila.nivel}>
                  <td>Triage {fila.nivel}</td>
                  <td>{fila.minutos}</td>
                  <td>{fila.pacientes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {tab === 'farmacia' && (
          <table>
            <thead>
              <tr><th>Medicamento</th><th>Stock</th><th>Días</th><th>Estado</th></tr>
            </thead>
            <tbody>
              {medicamentos.map((med) => (
                <tr key={med.nombre_generico}>
                  <td>{med.nombre_generico}</td>
                  <td>{med.stock_actual}</td>
                  <td>{med.dias}</td>
                  <td>{med.dias < 5 ? 'Menos de 5 días' : 'Estable'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}

export function Diccionario() {
  const filas = [
    ['Camas', 'Ocupada, en limpieza o disponible. El clic de aseo solo pasa una cama de limpieza a disponible.'],
    ['Servicios', 'UCI adultos, urgencias, medicina interna, pediatría y cirugía, con el piso de la sede.'],
    ['Urgencias', 'Espera puerta-médico y minutos por nivel de triage, tomados de la muestra del turno.'],
    ['Quirófanos', 'Salas con lo programado, lo realizado y si están en cirugía.'],
    ['Farmacia', 'Stock, consumo diario y días de cobertura. Menos de 5 días enciende la alerta.'],
    ['Frase del turno', 'La nota que el médico ya escribió. SUSANA la pone donde el jefe la ve.'],
  ]
  return (
    <div className="page">
      <header className="page-head">
        <div>
          <h1>Diccionario de datos</h1>
          <p className="muted">De dónde sale cada número del pulso</p>
        </div>
      </header>
      <section className="dict">
        {filas.map(([titulo, texto]) => (
          <article className="card" key={titulo}>
            <h2>{titulo}</h2>
            <p>{texto}</p>
          </article>
        ))}
      </section>
    </div>
  )
}

export function Hospital() {
  return (
    <div className="page">
      <header className="page-head">
        <div>
          <h1>El hospital</h1>
          <p className="muted">Hospital Susana López de Valencia E.S.E. · Popayán, Cauca</p>
        </div>
      </header>
      <section className="foto-card card">
        <img src="/fachada-susana.png" alt="Edificio blanco del hospital, cruz verde y montañas del Cauca." />
        <div>
          <p className="eyebrow">Sede La Ladera</p>
          <h2>Calle 15 No. 17A-196</h2>
          <p>Popayán, Cauca. Código postal 190004. Lunes a viernes, de 7:00 a.m. a 5:00 p.m.</p>
          <p className="muted">Inteligencia que cuida, decisiones que salvan.</p>
        </div>
      </section>
      <section className="split">
        <article className="card">
          <header className="card-head"><h2>Sede San Camilo</h2></header>
          <p>Carrera 8 No. 9-66, Popayán.</p>
          <p className="muted">Lunes a viernes, de 7:00 a.m. a 5:00 p.m.</p>
        </article>
        <article className="card">
          <header className="card-head"><h2>Contacto</h2></header>
          <p>(600) 838 636</p>
          <p className="muted">(+57) 318 821 1483</p>
        </article>
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
    </div>
  )
}
