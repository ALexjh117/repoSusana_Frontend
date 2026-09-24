import type { Medicamento } from '../api'
import { Donut, Icon } from '../components'
import { fechaCorta } from '../lib/format'
import { cantidad, diasTexto } from '../lib/numeros'

const FAMILIAS: Record<string, { nombre: string; color: string }> = {
  'Fentanilo 0.5mg/10ml': { nombre: 'Opioides', color: '#e25b4a' },
  'Norepinefrina 4mg/4ml': { nombre: 'Vasoactivos', color: '#e07a3a' },
  'Amoxicilina 500mg': { nombre: 'Antibióticos', color: '#3d8fd1' },
  'Acetaminofen 1g': { nombre: 'Analgésicos', color: '#1a9a62' },
}

function familiaDe(nombreMed: string) {
  return FAMILIAS[nombreMed] ?? { nombre: 'Otras', color: '#8aa099' }
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
