import { Icon } from '../icons'

export type AITone = 'green' | 'amber' | 'red' | 'blue' | 'neutral'

export type AIStat = {
  label: string
  value: string
  note?: string
  tone?: AITone
}

export type AIProgress = {
  label: string
  value: string
  detail?: string
  percentage?: number
  tone?: AITone
}

export type AIResponse =
  | { tipo: 'stats'; title: string; subtitle?: string; stats: AIStat[]; footer?: string; actions?: string[] }
  | { tipo: 'progress'; title: string; subtitle?: string; rows: AIProgress[]; footer?: string; actions?: string[] }
  | { tipo: 'trend'; title: string; subtitle?: string; value: string; unit?: string; points: number[]; note?: string; actions?: string[] }
  | { tipo: 'table'; title: string; subtitle?: string; columns: string[]; rows: string[][]; footer?: string; actions?: string[] }
  | { tipo: 'alert'; title: string; text: string; tone?: AITone; footer?: string; actions?: string[] }
  | { tipo: 'insight'; title: string; text: string; evidence?: AIStat[]; footer?: string; actions?: string[] }
  | { tipo: 'forecast'; title: string; text: string; note?: string; actions?: string[] }
  | { tipo: 'simulation'; title: string; scenario: string; metrics: AIStat[]; note: string; options?: string[]; actions?: string[] }
  | { tipo: 'recommendation'; title: string; items: string[]; footer?: string; actions?: string[] }

export type Mensaje = { yo: boolean; texto: string; visual?: AIResponse[] }

function AIActions({ actions, onAction }: { actions?: string[]; onAction?: (texto: string) => void }) {
  if (!actions?.length) return null
  return (
    <div className="ai-actions">
      {actions.map((action) => (
        <button key={action} type="button" onClick={() => onAction?.(action)}>
          {action}<span aria-hidden="true">→</span>
        </button>
      ))}
    </div>
  )
}

export function AIKPIGrid({ items }: { items: AIStat[] }) {
  return (
    <div className="ai-kpi-grid">
      {items.map((item) => (
        <div className={`ai-kpi ${item.tone ? `ai-tone-${item.tone}` : ''}`} key={item.label}>
          <span>{item.label}</span>
          <strong>{item.value}</strong>
          {item.note && <small>{item.note}</small>}
        </div>
      ))}
    </div>
  )
}

export function AIStatCard({
  title,
  subtitle,
  stats,
  footer,
  actions,
  onAction,
}: {
  title: string
  subtitle?: string
  stats: AIStat[]
  footer?: string
  actions?: string[]
  onAction?: (texto: string) => void
}) {
  return (
    <article className="ai-visual-card ai-stat-card">
      <header className="ai-card-head">
        <div><span className="ai-card-kicker">Datos observados</span><h3>{title}</h3>{subtitle && <p>{subtitle}</p>}</div>
        <span className="ai-card-icon"><Icon name="reportes" /></span>
      </header>
      <AIKPIGrid items={stats} />
      {footer && <p className="ai-card-note">{footer}</p>}
      <AIActions actions={actions} onAction={onAction} />
    </article>
  )
}

export function AIProgressCard({
  title,
  subtitle,
  rows,
  footer,
  actions,
  onAction,
}: {
  title: string
  subtitle?: string
  rows: AIProgress[]
  footer?: string
  actions?: string[]
  onAction?: (texto: string) => void
}) {
  return (
    <article className="ai-visual-card ai-progress-card">
      <header className="ai-card-head">
        <div><span className="ai-card-kicker">Lectura operativa</span><h3>{title}</h3>{subtitle && <p>{subtitle}</p>}</div>
        <span className="ai-card-icon"><Icon name="reportes" /></span>
      </header>
      <div className="ai-progress-list">
        {rows.map((row) => (
          <div className={`ai-progress-row ${row.tone ? `ai-tone-${row.tone}` : ''}`} key={row.label}>
            <div className="ai-progress-top"><span>{row.label}</span><strong>{row.value}</strong></div>
            {row.percentage !== undefined && <div className="ai-progress-track"><span style={{ width: `${Math.max(0, Math.min(100, row.percentage))}%` }} /></div>}
            {row.detail && <small>{row.detail}</small>}
          </div>
        ))}
      </div>
      {footer && <p className="ai-card-note">{footer}</p>}
      <AIActions actions={actions} onAction={onAction} />
    </article>
  )
}

export function AITrendCard({
  title,
  subtitle,
  value,
  unit,
  points,
  note,
  actions,
  onAction,
}: {
  title: string
  subtitle?: string
  value: string
  unit?: string
  points: number[]
  note?: string
  actions?: string[]
  onAction?: (texto: string) => void
}) {
  const width = 320
  const height = 82
  const min = Math.min(...points)
  const max = Math.max(...points)
  const range = max - min || 1
  const coords = points.map((point, index) => {
    const x = points.length > 1 ? (index / (points.length - 1)) * width : width / 2
    const y = height - 12 - ((point - min) / range) * (height - 26)
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })
  return (
    <article className="ai-visual-card ai-trend-card">
      <header className="ai-card-head">
        <div><span className="ai-card-kicker">Serie observada</span><h3>{title}</h3>{subtitle && <p>{subtitle}</p>}</div>
        <span className="ai-card-icon"><Icon name="reportes" /></span>
      </header>
      <div className="ai-trend-value"><strong>{value}</strong>{unit && <span>{unit}</span>}</div>
      <svg className="ai-sparkline" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={title}>
        <path d={`M0 ${height}H${width}`} />
        <polyline points={coords.join(' ')} />
        {coords.map((point, index) => {
          const [x, y] = point.split(',')
          return <circle key={index} cx={x} cy={y} r="3.5" />
        })}
      </svg>
      {note && <p className="ai-card-note">{note}</p>}
      <AIActions actions={actions} onAction={onAction} />
    </article>
  )
}

export function AITable({
  title,
  subtitle,
  columns,
  rows,
  footer,
  actions,
  onAction,
}: {
  title: string
  subtitle?: string
  columns: string[]
  rows: string[][]
  footer?: string
  actions?: string[]
  onAction?: (texto: string) => void
}) {
  return (
    <article className="ai-visual-card ai-table-card">
      <header className="ai-card-head">
        <div><span className="ai-card-kicker">Detalle disponible</span><h3>{title}</h3>{subtitle && <p>{subtitle}</p>}</div>
        <span className="ai-card-icon"><Icon name="reportes" /></span>
      </header>
      <div className="ai-table-scroll">
        <table className="ai-table">
          <thead><tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr></thead>
          <tbody>{rows.map((row, rowIndex) => <tr key={`${rowIndex}-${row.join('-')}`}>{row.map((cell, cellIndex) => <td key={`${cellIndex}-${cell}`}>{cell}</td>)}</tr>)}</tbody>
        </table>
      </div>
      {footer && <p className="ai-card-note">{footer}</p>}
      <AIActions actions={actions} onAction={onAction} />
    </article>
  )
}

export function AIAlertCard({
  title,
  text,
  tone = 'amber',
  footer,
  actions,
  onAction,
}: {
  title: string
  text: string
  tone?: AITone
  footer?: string
  actions?: string[]
  onAction?: (texto: string) => void
}) {
  return (
    <article className={`ai-visual-card ai-alert-card ai-tone-${tone}`}>
      <header className="ai-card-head"><div><span className="ai-card-kicker">Estado recibido</span><h3>{title}</h3></div><span className="ai-card-icon"><Icon name="alertas" /></span></header>
      <p className="ai-alert-text">{text}</p>
      {footer && <p className="ai-card-note">{footer}</p>}
      <AIActions actions={actions} onAction={onAction} />
    </article>
  )
}

export function AIInsightCard({
  title,
  text,
  evidence,
  footer,
  actions,
  onAction,
}: {
  title: string
  text: string
  evidence?: AIStat[]
  footer?: string
  actions?: string[]
  onAction?: (texto: string) => void
}) {
  return (
    <article className="ai-visual-card ai-insight-card">
      <header className="ai-card-head"><div><span className="ai-card-kicker">Interpretación de ANA IA</span><h3>{title}</h3></div><span className="ai-card-icon"><Icon name="reportes" /></span></header>
      <p className="ai-insight-text">{text}</p>
      {evidence && evidence.length > 0 && <AIKPIGrid items={evidence} />}
      {footer && <p className="ai-card-note">{footer}</p>}
      <AIActions actions={actions} onAction={onAction} />
    </article>
  )
}

export function AIForecastCard({
  title,
  text,
  note,
  actions,
  onAction,
}: {
  title: string
  text: string
  note?: string
  actions?: string[]
  onAction?: (texto: string) => void
}) {
  return (
    <article className="ai-visual-card ai-forecast-card">
      <header className="ai-card-head"><div><span className="ai-card-kicker">Proyección no disponible</span><h3>{title}</h3></div><span className="ai-card-icon"><Icon name="reportes" /></span></header>
      <p className="ai-insight-text">{text}</p>
      {note && <p className="ai-card-note">{note}</p>}
      <AIActions actions={actions} onAction={onAction} />
    </article>
  )
}

export function AISimulationCard({
  title,
  scenario,
  metrics,
  note,
  options,
  actions,
  onAction,
}: {
  title: string
  scenario: string
  metrics: AIStat[]
  note: string
  options?: string[]
  actions?: string[]
  onAction?: (texto: string) => void
}) {
  return (
    <article className="ai-visual-card ai-simulation-card">
      <header className="ai-card-head"><div><span className="ai-card-kicker">Escenario hipotético</span><h3>{title}</h3></div><span className="ai-card-icon"><Icon name="reportes" /></span></header>
      <div className="ai-simulation-scenario"><span>Escenario</span><strong>{scenario}</strong></div>
      <AIKPIGrid items={metrics} />
      <p className="ai-card-note">{note}</p>
      {options && options.length > 0 && <div className="ai-simulation-options">{options.map((option) => <button type="button" key={option} onClick={() => onAction?.(`Simular demanda ${option}`)}>{option}</button>)}</div>}
      <AIActions actions={actions} onAction={onAction} />
    </article>
  )
}

export function AIRecommendationCard({
  title,
  items,
  footer,
  actions,
  onAction,
}: {
  title: string
  items: string[]
  footer?: string
  actions?: string[]
  onAction?: (texto: string) => void
}) {
  return (
    <article className="ai-visual-card ai-recommendation-card">
      <header className="ai-card-head"><div><span className="ai-card-kicker">Apoyo operativo</span><h3>{title}</h3></div><span className="ai-card-icon"><Icon name="reportes" /></span></header>
      <ol className="ai-recommendation-list">{items.map((item) => <li key={item}>{item}</li>)}</ol>
      {footer && <p className="ai-card-note">{footer}</p>}
      <AIActions actions={actions} onAction={onAction} />
    </article>
  )
}

export function AIResponseCard({ response, onAction }: { response: AIResponse; onAction?: (texto: string) => void }) {
  switch (response.tipo) {
    case 'stats': return <AIStatCard {...response} onAction={onAction} />
    case 'progress': return <AIProgressCard {...response} onAction={onAction} />
    case 'trend': return <AITrendCard {...response} onAction={onAction} />
    case 'table': return <AITable {...response} onAction={onAction} />
    case 'alert': return <AIAlertCard {...response} onAction={onAction} />
    case 'insight': return <AIInsightCard {...response} onAction={onAction} />
    case 'forecast': return <AIForecastCard {...response} onAction={onAction} />
    case 'simulation': return <AISimulationCard {...response} onAction={onAction} />
    case 'recommendation': return <AIRecommendationCard {...response} onAction={onAction} />
  }
}
