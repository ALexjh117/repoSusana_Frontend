import { useEffect, useRef, useState, type RefObject } from 'react'
import { AIResponseCard, type Mensaje } from '../ai/visuals'
import { RobotFace } from '../RobotFace'

export function ChatPanel({
  abierto,
  instant,
  mensajes,
  pensando,
  preguntas,
  contexto,
  inputRef,
  onCerrar,
  onEscape,
  onEnviar,
}: {
  abierto: boolean
  instant: boolean
  mensajes: Mensaje[]
  pensando: boolean
  preguntas: string[]
  contexto: string
  inputRef: RefObject<HTMLInputElement | null>
  onCerrar: () => void
  onEscape: () => void
  onEnviar: (texto: string) => void
}) {
  const [texto, setTexto] = useState('')
  const lista = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const nodo = lista.current
    if (nodo) nodo.scrollTop = nodo.scrollHeight
  }, [mensajes, pensando, abierto])

  return (
    <section
      id="ana-chat"
      className="ana-chat-panel"
      data-open={abierto}
      data-instant={instant}
      role="dialog"
      aria-label="ANA IA"
      inert={!abierto}
      onKeyDown={(event) => {
        if (event.key === 'Escape') onEscape()
      }}
    >
      <header className="ana-chat-head">
        <div className="ana-chat-identity">
          <span className="ana-chat-avatar"><RobotFace /></span>
          <div className="ana-chat-name"><strong>ANA IA</strong><span>Tu asistente de inteligencia hospitalaria</span><span className="ana-chat-status"><i />En línea</span></div>
        </div>
        <div className="ana-chat-actions">
          <button className="ana-chat-icon-btn" type="button" onClick={onEscape} aria-label="Minimizar ANA IA">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" /></svg>
          </button>
          <button className="ana-chat-icon-btn" type="button" onClick={onCerrar} aria-label="Cerrar ANA IA">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </div>
      </header>
      <div className="ana-chat-context"><span>Contexto activo</span><strong>{contexto}</strong></div>
      <div className="ana-thread" ref={lista} aria-live="polite">
        {mensajes.map((mensaje, index) => (
          <div className={mensaje.yo ? 'ana-message is-user' : 'ana-message is-assistant'} key={`${index}-${mensaje.texto.slice(0, 12)}`}>
            {!mensaje.yo && <span className="ana-message-avatar"><RobotFace /></span>}
            <div className="ana-message-content">
              <p className={mensaje.yo ? 'ana-bubble is-user' : 'ana-bubble'}>{mensaje.texto}</p>
              {mensaje.visual?.map((visual, visualIndex) => <AIResponseCard key={visualIndex} response={visual} onAction={onEnviar} />)}
            </div>
          </div>
        ))}
        {pensando && <div className="ana-typing" role="status"><span className="ana-typing-dots"><i /><i /><i /></span><span>ANA IA está consultando el hospital…</span></div>}
        {preguntas.length > 0 && (
          <div className="ana-suggestions">
            <div className="ana-suggestions-title"><span>Preguntas sugeridas</span><small>Explora el pulso del hospital</small></div>
            <div className="ana-suggestion-list">
              {preguntas.map((pregunta) => <button key={pregunta} type="button" onClick={() => onEnviar(pregunta)} disabled={pensando}>{pregunta}</button>)}
            </div>
          </div>
        )}
      </div>
      <form
        className="ana-composer"
        onSubmit={(event) => {
          event.preventDefault()
          const limpia = texto.trim()
          if (!limpia) return
          setTexto('')
          onEnviar(limpia)
        }}
      >
        <input ref={inputRef} value={texto} onChange={(event) => setTexto(event.target.value)} placeholder="Escribe tu pregunta..." aria-label="Pregunta para ANA IA" autoComplete="off" />
        <button className="ana-send" type="submit" aria-label="Enviar" disabled={pensando}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></button>
      </form>
      <p className="ana-disclaimer">ANA IA puede cometir errores. Verifica la información importante.</p>
    </section>
  )
}
