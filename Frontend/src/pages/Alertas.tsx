import { useState } from 'react'
import type { Alerta, Pulso } from '../api'
import { AccionesTurno, Cruz, Icon } from '../components'
import { fichaAviso, textoAlerta } from '../lib/avisos'

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
        <img src="/hospital-umi.jpg" alt="Edificio de UMI Pediatría del Hospital Susana López de Valencia en Popayán." />
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
