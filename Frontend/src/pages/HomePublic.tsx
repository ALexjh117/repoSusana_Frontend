import { useState } from 'react'

export function HomePublic({ onLogin }: { onLogin: () => void }) {
  const [activeFeature, setActiveFeature] = useState<'human' | 'connected' | 'intelligence'>('human')
  const featureTabs = [
    { id: 'human' as const, label: 'Atención humana', icon: '♡' },
    { id: 'connected' as const, label: 'Información conectada', icon: '⌁' },
    { id: 'intelligence' as const, label: 'Inteligencia hospitalaria', icon: '✦' },
  ]
  const featureContent = {
    human: {
      title: 'Atención humana',
      text: 'Personas, familias y profesionales en el centro de cada decisión.',
      imageLabel: 'Cuidado en cada turno',
      points: ['Personas', 'Familias', 'Equipos'],
    },
    connected: {
      title: 'Información conectada',
      text: 'Datos claros para comprender mejor la operación del hospital.',
      imageLabel: 'Una visión compartida',
      points: ['Datos claros', 'Visión integral', 'Operación'],
    },
    intelligence: {
      title: 'Inteligencia hospitalaria',
      text: 'Tecnología y talento al servicio de una comunidad más eficiente.',
      imageLabel: 'Decisiones con contexto',
      points: ['ANA IA', 'Análisis', 'Responsabilidad'],
    },
  } as const
  const activeContent = featureContent[activeFeature]

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
          <a href="#ana">ANA IA</a>
          <a href="#contacto">Contacto</a>
        </nav>
        <button className="public-login" type="button" onClick={onLogin}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0" /></svg>
          Ingresar
        </button>
      </header>

      <section className="public-hero" id="inicio">
        <img src="/hospital-umi.jpg" alt="Edificio de UMI Pediatría del Hospital Susana López de Valencia, sede La Ladera, Popayán." />
        <div className="public-hero-veil" />
        <div className="public-hero-inner">
          <div className="public-hero-copy">
            <p className="public-eyebrow">E.S.E. · POPAYÁN, CAUCA</p>
            <h1>Salud que conecta,<br /><em>inteligencia que cuida.</em></h1>
            <p className="lead">Un hospital que pone a las personas en el centro y utiliza datos e inteligencia para tomar mejores decisiones en cada turno.</p>
            <div className="public-actions">
              <button className="public-button public-button-primary" type="button" onClick={onLogin}>Entrar a ANA IA <span aria-hidden="true">→</span></button>
              <a className="public-button public-button-secondary" href="#nosotros">Conocer el hospital <span aria-hidden="true">↓</span></a>
            </div>
          </div>
          <div className="public-hero-note">
            <span>Hospital Susana López de Valencia</span>
            <strong>Sede La Ladera · Popayán</strong>
            <small>Inteligencia operacional al servicio de la comunidad</small>
          </div>
        </div>
        <div className="public-hero-bottom">
          <span><b className="public-value-icon">♡</b> Atención humana</span>
          <span><b className="public-value-icon">⌁</b> Información conectada</span>
          <span><b className="public-value-icon">✦</b> Inteligencia hospitalaria</span>
        </div>
      </section>

      <section className="public-section public-about public-feature-experience" id="nosotros">
        <div className="public-about-intro">
          <p className="public-eyebrow dark">Una forma más humana de cuidar</p>
          <h2>Atención humana.<br />Información conectada.<br />Inteligencia hospitalaria.</h2>
          <p>Somos una institución pública al servicio de Popayán y el Cauca. ANA IA integra la información operacional para ayudar a los equipos a entender lo que está pasando y actuar oportunamente.</p>
        </div>
        <div className="public-feature-tabs" role="tablist" aria-label="Valores del hospital">
          {featureTabs.map((tab) => (
            <button
              className={`public-feature-tab${activeFeature === tab.id ? ' is-active' : ''}`}
              id={`public-feature-tab-${tab.id}`}
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeFeature === tab.id}
              aria-controls="public-feature-panel"
              onClick={() => setActiveFeature(tab.id)}
            >
              <span className="public-feature-tab-icon">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
        <div className={`public-feature-content is-${activeFeature}`} id="public-feature-panel" key={activeFeature} role="tabpanel" aria-labelledby={`public-feature-tab-${activeFeature}`} tabIndex={0}>
          <div className="public-feature-image">
            <img src="/hospital-umi.jpg" alt="Edificio de UMI Pediatría del Hospital Susana López de Valencia en Popayán." />
            <span>{activeContent.imageLabel}</span>
          </div>
          <div className="public-feature-panel">
            <p className="public-feature-kicker">Una forma de cuidar</p>
            <h3>{activeContent.title}</h3>
            <p className="public-feature-description">{activeContent.text}</p>
            <div className="public-feature-points">
              {activeContent.points.map((point) => <span key={point}>{point}</span>)}
            </div>
            <a className="public-outline" href="#servicios">Conoce nuestros servicios <span aria-hidden="true">→</span></a>
          </div>
        </div>
      </section>

      <section className="public-section public-services services-section" id="servicios">
        <div className="services-header public-services-head">
          <div>
            <p className="public-eyebrow dark">Servicios</p>
            <h2>Todo lo que necesitas,<br />en un solo lugar.</h2>
          </div>
          <p>Una operación conectada para acompañar cada etapa de la atención, desde el ingreso hasta el seguimiento.</p>
        </div>
        <div className="services-grid public-service-grid">
          <article className="service-card service-card--featured">
            <div className="service-card-backdrop" aria-hidden="true"><img src="/hospital-umi.jpg" alt="" /></div>
            <div className="service-card-top">
              <span className="service-card-icon" aria-hidden="true"><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M5 22V10a3 3 0 0 1 3-3h11a4 4 0 0 1 4 4v11" /><path d="M5 16h18M9 22v-5h8v5" /><circle cx="10" cy="22" r="2" /><path d="M9 11h4" /></svg></span>
              <span className="service-card-arrow" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h13M13 6l6 6-6 6" /></svg></span>
            </div>
            <div className="service-card-copy"><h3>Urgencias</h3><p>Atención inmediata y seguimiento del turno.</p></div>
          </article>
          <article className="service-card">
            <div className="service-card-top">
              <span className="service-card-icon" aria-hidden="true"><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M5 23V9a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v14" /><path d="M5 17h16M11 23v-5h5v5M9 10h5" /></svg></span>
              <span className="service-card-arrow" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h13M13 6l6 6-6 6" /></svg></span>
            </div>
            <div className="service-card-copy"><h3>Hospitalización</h3><p>Camas y servicios de hospitalización.</p></div>
          </article>
          <article className="service-card">
            <div className="service-card-top">
              <span className="service-card-icon" aria-hidden="true"><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="16" cy="16" r="9" /><path d="M16 11v10M11 16h10M9 7l2 2M23 7l-2 2" /></svg></span>
              <span className="service-card-arrow" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h13M13 6l6 6-6 6" /></svg></span>
            </div>
            <div className="service-card-copy"><h3>Quirófanos</h3><p>Procedimientos seguros y especializados.</p></div>
          </article>
          <article className="service-card">
            <div className="service-card-top">
              <span className="service-card-icon" aria-hidden="true"><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M5 24V10a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v14M5 18h20M11 24v-5h6v5" /><path d="M9 7v4M9 5h.01" /></svg></span>
              <span className="service-card-arrow" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h13M13 6l6 6-6 6" /></svg></span>
            </div>
            <div className="service-card-copy"><h3>Camas</h3><p>Ocupación y disponibilidad por servicio.</p></div>
          </article>
          <article className="service-card">
            <div className="service-card-top">
              <span className="service-card-icon" aria-hidden="true"><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="4" width="16" height="24" rx="8" transform="rotate(35 16 16)" /><path d="m12 12 8 8" /></svg></span>
              <span className="service-card-arrow" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h13M13 6l6 6-6 6" /></svg></span>
            </div>
            <div className="service-card-copy"><h3>Farmacia</h3><p>Medicamentos y dispositivos médicos.</p></div>
          </article>
          <article className="service-card">
            <div className="service-card-top">
              <span className="service-card-icon" aria-hidden="true"><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5h14a2 2 0 0 1 2 2v18a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" /><path d="M12 11h8M12 16h8M12 21h5M7 5V3h7" /></svg></span>
              <span className="service-card-arrow" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h13M13 6l6 6-6 6" /></svg></span>
            </div>
            <div className="service-card-copy"><h3>Consulta externa / Reportes</h3><p>Información clara para tomar decisiones.</p></div>
          </article>
        </div>
      </section>

      <section className="public-ana" id="ana">
        <div className="public-ana-copy">
          <div className="public-ana-brand">
            <span className="public-ana-mark" aria-hidden="true"><span>+</span></span>
            <div><p className="public-eyebrow">Asistente de inteligencia hospitalaria</p><h2>ANA IA</h2><span>Tu asistente de inteligencia hospitalaria</span></div>
          </div>
          <p>Consulta el estado del hospital, analiza señales operativas y acompaña la exploración de escenarios. ANA IA apoya decisiones administrativas y operativas; no reemplaza el criterio profesional ni las decisiones clínicas.</p>
          <div className="public-ana-capabilities"><span>Detecta</span><span>Analiza</span><span>Predice</span><span>Simula</span></div>
          <button className="public-button public-button-dark" type="button" onClick={onLogin}>Entrar a ANA IA <span aria-hidden="true">→</span></button>
        </div>
        <div className="public-ana-visual">
          <img src="/hospital-umi.jpg" alt="Edificio de UMI Pediatría del Hospital Susana López de Valencia en Popayán." />
          <div className="public-ana-visual-caption"><strong>Una capa de inteligencia</strong><span>para operar con más claridad</span></div>
        </div>
      </section>

      <section className="public-institutional">
        <div>
          <p className="public-eyebrow dark">Compromiso institucional</p>
          <h2>Tecnología y talento<br />al servicio de la comunidad</h2>
        </div>
        <p>La experiencia de cada persona guía las decisiones del hospital. Por eso combinamos atención humana, información confiable y tecnología responsable.</p>
      </section>

      <footer className="public-footer" id="contacto">
        <div className="public-footer-main">
          <div className="public-footer-brand">
            <img src="/logo-hospital-susana-transparent.png" alt="Hospital Susana López de Valencia E.S.E." />
          </div>
          <div className="public-footer-address">
            <span className="public-footer-pin">⌖</span>
            <span>Calle 15 No. 17A-196 · E.S.E.<br />Popayán, Cauca</span>
          </div>
          <div className="public-socials" aria-label="Información institucional"><span>E.S.E.</span><span>Popayán · Cauca</span></div>
          <div className="public-footer-slogan">Juntos por una salud<br /><em>más humana y eficiente</em></div>
        </div>
        <div className="public-footer-bottom">© 2025 Hospital Susana López de Valencia E.S.E. Todos los derechos reservados.</div>
      </footer>
    </main>
  )
}
