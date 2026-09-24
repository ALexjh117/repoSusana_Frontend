import { useEffect, useRef, useState } from 'react'
import {
  api,
  type Alerta,
  type Frase,
  type Medicamento,
  type Pabellon,
  type Pulso,
  type Quirofano,
  type Urgencias,
} from './api'
import { ChatPanel, Cruz, Icon, Reloj, RobotFace, type IconName, type Mensaje } from './bits'
import { Alertas, Camas, Diccionario, Farmacia, HomePublic, Hospital, Inicio, Login, Quirofanos, Reportes, Urgencias as VistaUrgencias } from './screens'
import { Alertas, Camas, Diccionario, Farmacia, Hospital, Inicio, Login, Quirofanos, Reportes, Urgencias as VistaUrgencias } from './screens'
import { MODULOS, PREGUNTAS, preguntasParaModulo, visualAna } from './ana'

type Page = 'inicio' | 'camas' | 'urgencias' | 'quirofanos' | 'farmacia' | 'alertas' | 'diccionario' | 'reportes' | 'hospital'

const NAV: { id: Page; label: string; icon: IconName }[] = [
  { id: 'inicio', label: 'Inicio', icon: 'inicio' },
  { id: 'camas', label: 'Camas', icon: 'camas' },
  { id: 'urgencias', label: 'Urgencias', icon: 'urgencias' },
  { id: 'quirofanos', label: 'Quirófanos', icon: 'quirofanos' },
  { id: 'farmacia', label: 'Farmacia', icon: 'farmacia' },
  { id: 'alertas', label: 'Alertas', icon: 'alertas' },
  { id: 'diccionario', label: 'Diccionario', icon: 'diccionario' },
  { id: 'reportes', label: 'Reportes', icon: 'reportes' },
  { id: 'hospital', label: 'El hospital', icon: 'hospital' },
]

function App() {
  const [vista, setVista] = useState<'home' | 'login' | 'app'>('home')
  const dentro = vista === 'app'
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
  const [pulso, setPulso] = useState<Pulso | null>(null)
  const [error, setError] = useState('')
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    { yo: false, texto: 'Hola, soy ANA IA, tu asistente de inteligencia hospitalaria.\n\nPuedo ayudarte a consultar información, analizar la operación, detectar cambios, predecir escenarios y explorar posibles situaciones del hospital.\n\n¿En qué puedo ayudarte hoy?' },
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
      return
    }
    try {
      setPulso(await api.acciones())
    } catch {
      setPulso(null)
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
      const visual = visualAna(limpia, page, pabellones, urgencias, quirofanos, medicamentos, alertas)
      setMensajes((actual) => [...actual, { yo: false, texto: respuesta.respuesta, ...(visual ? { visual } : {}) }])
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

  if (vista === 'home') return <HomePublic onLogin={() => setVista('login')} />
  if (vista === 'login') return <Login onEnter={() => setVista('app')} onBack={() => setVista('home')} />

  return (
    <div className="shell">
      <aside className="side">
        <div className="brand side-brand">
          <Cruz />
          <div>
            <strong>ANA IA</strong>
            <span>Asistente hospitalario</span>
          </div>
        </div>
        <nav>
          {NAV.map((item) => (
            <button
              className={page === item.id ? 'active' : ''}
              key={item.id}
              type="button"
              onClick={() => setPage(item.id)}
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
              pulso={pulso}
              onAbrirAccion={(destinatario) => setPage(paginaDe(destinatario))}
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
          {page === 'alertas' && (
            <Alertas
              alertas={alertas}
              pulso={pulso}
              onAbrirAccion={(destinatario) => setPage(paginaDe(destinatario))}
            />
          )}
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
        preguntas={preguntasParaModulo(page)}
        contexto={MODULOS[page]}
        inputRef={inputRef}
        onCerrar={() => setChatOpen(false)}
        onEscape={() => {
          setChatInstant(true)
          setChatOpen(false)
        }}
        onEnviar={(texto) => void enviar(texto)}
      />
      {!chatOpen && (
        <button
          ref={robotRef}
          className="ana-robot"
          type="button"
          aria-expanded={chatOpen}
          aria-controls="ana-chat"
          aria-label="Abrir ANA IA"
          onClick={() => {
            setChatInstant(false)
            setChatOpen(true)
          }}
        >
          <RobotFace />
        </button>
      )}
    </div>
  )
}

function paginaDe(destinatario: string): Page {
  if (destinatario === 'Farmacia') return 'farmacia'
  if (destinatario === 'Gestión de camas') return 'camas'
  if (destinatario === 'Quirófanos') return 'quirofanos'
  if (destinatario === 'Jefe de urgencias') return 'urgencias'
  return 'alertas'
}

export default App
