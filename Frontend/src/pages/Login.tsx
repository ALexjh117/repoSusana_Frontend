import { useState } from 'react'

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
