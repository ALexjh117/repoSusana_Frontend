import { useEffect, useRef, useState } from 'react'
import {
  api,
  type Alerta,
  type Frase,
  type Medicamento,
  type Pabellon,
  type Quirofano,
  type Urgencias,
} from './api'
import { ChatPanel, Cruz, Icon, Reloj, RobotFace, type IconName, type Mensaje } from './bits'
import { Alertas, Camas, Diccionario, Farmacia, Hospital, Inicio, Login, Quirofanos, Reportes, Urgencias as VistaUrgencias } from './screens'

type Page = 'inicio' | 'camas' | 'urgencias' | 'quirofanos' | 'farmacia' | 'alertas' | 'diccionario' | 'reportes' | 'hospital'

const NAV: { id: Page | 'chat'; label: string; icon: IconName }[] = [
  { id: 'inicio', label: 'Inicio', icon: 'inicio' },
  { id: 'chat', label: 'SUSANA IA', icon: 'chat' },
  { id: 'camas', label: 'Camas', icon: 'camas' },
  { id: 'urgencias', label: 'Urgencias', icon: 'urgencias' },
  { id: 'quirofanos', label: 'Quirófanos', icon: 'quirofanos' },
  { id: 'farmacia', label: 'Farmacia', icon: 'farmacia' },
  { id: 'alertas', label: 'Alertas', icon: 'alertas' },
  { id: 'diccionario', label: 'Diccionario', icon: 'diccionario' },
  { id: 'reportes', label: 'Reportes', icon: 'reportes' },
  { id: 'hospital', label: 'El hospital', icon: 'hospital' },
]

const PREGUNTAS = [
  '¿Cuántas camas de UCI están ocupadas hoy?',
  '¿Qué medicamentos tienen menos de 5 días?',
  '¿Cuál fue la espera promedio en urgencias?',
  '¿Qué servicio tuvo más ingresos este mes?',
]

function App() {
  const [dentro, setDentro] = useState(false)
  const [page, setPage] = useState<Page>('inicio')
  const [chatOpen, setChatOpen] = useState(false)
  const [chatInstant, setChatInstant] = useState(false)
  const [pensando, setPensando] = useState(false)
  const [frase, setFrase] = useState<Frase | null>(null)
  const [alertas, setAlertas] = useState<Alerta[]>([])
  const [pabellones, setPabellones] = useState<Pabellon[]>([])
  const [quirofanos, setQuirofanos] = useState<Quirofano[]>([])
  const [urgencias, setUrgencias] = useState<Urgencias | null>(null)
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([])
  const [error, setError] = useState('')
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    { yo: false, texto: 'Hola, soy SUSANA IA. Pregúntame por UCI, medicamentos, espera o el servicio con más ingresos.' },
  ])
  const robotRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const yaAbrio = useRef(false)

  useEffect(() => {
    if (chatOpen) {
      yaAbrio.current = true
      inputRef.current?.focus()
      return
    }
    if (yaAbrio.current) robotRef.current?.focus()
  }, [chatOpen])

  async function cargar() {
    try {
      const [fraseData, alertasData, pabellonesData, quirofanosData, urgenciasData, medicamentosData] = await Promise.all([
        api.frase(),
        api.alertas(),
        api.pabellones(),
        api.quirofanos(),
        api.urgencias(),
        api.medicamentos(),
      ])
      setFrase(fraseData)
      setAlertas(alertasData)
      setPabellones(pabellonesData)
      setQuirofanos(quirofanosData)
      setUrgencias(urgenciasData)
      setMedicamentos(medicamentosData)
      setError('')
    } catch {
      setError('El frontend no alcanzó el API. Arranca el backend en el puerto 8000.')
    }
  }

  useEffect(() => {
    if (dentro) void cargar()
  }, [dentro])

  async function enviar(pregunta: string) {
    const limpia = pregunta.trim()
    if (!limpia || pensando) return
    setMensajes((actual) => [...actual, { yo: true, texto: limpia }])
    setPensando(true)
    try {
      const respuesta = await api.preguntar(limpia)
      setMensajes((actual) => [...actual, { yo: false, texto: respuesta.respuesta }])
      if (respuesta.foco === 'FARMACIA') setPage('farmacia')
      if (respuesta.foco === 'URGENCIAS') setPage('urgencias')
      if (respuesta.foco === 'LIMPIEZA' || respuesta.foco === 'UCI_ADULTOS') setPage('camas')
    } catch {
      setMensajes((actual) => [...actual, { yo: false, texto: 'No pude hablar con el servidor. Revisa que el backend esté en el puerto 8000.' }])
    } finally {
      setPensando(false)
    }
  }

  function abrirChat() {
    setChatInstant(false)
    setChatOpen(true)
  }

  function preguntarDesde(texto: string) {
    abrirChat()
    void enviar(texto)
  }

  if (!dentro) return <Login onEnter={() => setDentro(true)} />

  return (
    <div className="shell">
      <aside className="side">
        <div className="brand side-brand">
          <Cruz />
          <div>
            <strong>SUSANA IA</strong>
            <span>H. Susana López · Popayán</span>
          </div>
        </div>
        <nav>
          {NAV.map((item) => (
            <button
              className={item.id === 'chat' ? (chatOpen ? 'active' : '') : page === item.id ? 'active' : ''}
              key={item.id}
              type="button"
              onClick={() => {
                if (item.id === 'chat') {
                  abrirChat()
                  return
                }
                setPage(item.id)
              }}
            >
              <Icon name={item.icon} />
              {item.label}
              {item.id === 'alertas' && alertas.length > 0 && <em className="count">{alertas.length}</em>}
            </button>
          ))}
        </nav>
        <div className="side-foot">
          <img src="/fachada-susana.png" alt="" />
          <div>
            <strong>Sede La Ladera</strong>
            <span>Calle 15 No. 17A-196</span>
          </div>
        </div>
      </aside>
      <div className="workspace">
        <header className="top">
          <div className="top-title">
            <strong>Hospital Susana López de Valencia</strong>
            <span><Icon name="pin" /> Popayán, Cauca · E.S.E.</span>
          </div>
          <div className="top-user">
            <Reloj />
            <div className="user">
              <div className="avatar">CT</div>
              <div>
                <strong>Dr. Carlos Torres</strong>
                <div className="muted">Jefe de turno</div>
              </div>
            </div>
          </div>
        </header>
        <main className="content">
          {error && <p className="alerta urgente" role="status">{error}</p>}
          {page === 'inicio' && (
            <Inicio
              frase={frase}
              pabellones={pabellones}
              urgencias={urgencias}
              quirofanos={quirofanos}
              alertas={alertas}
              medicamentos={medicamentos}
              preguntas={PREGUNTAS}
              onAbrirChat={abrirChat}
              onPreguntar={preguntarDesde}
              onVerAlertas={() => setPage('alertas')}
            />
          )}
          {page === 'camas' && (
            <Camas
              pabellones={pabellones}
              onLimpiar={async (id) => {
                await api.marcarLimpia(id)
                await cargar()
              }}
            />
          )}
          {page === 'urgencias' && <VistaUrgencias urgencias={urgencias} />}
          {page === 'quirofanos' && <Quirofanos quirofanos={quirofanos} />}
          {page === 'farmacia' && <Farmacia medicamentos={medicamentos} />}
          {page === 'alertas' && <Alertas alertas={alertas} />}
          {page === 'reportes' && (
            <Reportes
              pabellones={pabellones}
              urgencias={urgencias}
              medicamentos={medicamentos}
              quirofanos={quirofanos}
            />
          )}
          {page === 'diccionario' && <Diccionario />}
          {page === 'hospital' && <Hospital />}
        </main>
      </div>
      <ChatPanel
        abierto={chatOpen}
        instant={chatInstant}
        mensajes={mensajes}
        pensando={pensando}
        preguntas={PREGUNTAS}
        inputRef={inputRef}
        onCerrar={() => setChatOpen(false)}
        onEscape={() => {
          setChatInstant(true)
          setChatOpen(false)
        }}
        onEnviar={(texto) => void enviar(texto)}
      />
      <button
        ref={robotRef}
        className="robot"
        type="button"
        aria-expanded={chatOpen}
        aria-controls="susana-chat"
        aria-label={chatOpen ? 'Cerrar SUSANA IA' : 'Abrir SUSANA IA'}
        onClick={() => {
          setChatInstant(false)
          setChatOpen((abierto) => !abierto)
        }}
      >
        <RobotFace />
      </button>
    </div>
  )
}

export default App
