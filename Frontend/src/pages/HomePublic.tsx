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
