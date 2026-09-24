import { useState } from 'react'
import { ocupacion, type Medicamento, type Pabellon, type Quirofano, type Urgencias } from '../api'
import { fechaCorta, nombre, resumenCamas, tono } from '../lib/format'
import { cantidad, diasTexto } from '../lib/numeros'
import { fraseCodigo } from '../lib/texto'
import { TRIAGE } from '../lib/triage'

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
