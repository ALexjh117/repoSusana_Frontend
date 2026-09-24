import { Cruz, Icon } from '../components'
import { PRINCIPIOS } from '../lib/principios'

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
