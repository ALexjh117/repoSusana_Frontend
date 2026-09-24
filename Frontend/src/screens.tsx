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

      <AccionesTurno pulso={pulso} onAbrir={onAbrirAccion} />

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
      { nombre: 'nota_triage', detalle: 'El texto del médico. SUSANA lo pone donde el jefe de turno lo ve.' },
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
          <span>SUSANA IA · Centro de inteligencia operacional hospitalaria</span>
        </div>
        <Cruz className="cross sm" />
      </section>
    </div>
  )
}
