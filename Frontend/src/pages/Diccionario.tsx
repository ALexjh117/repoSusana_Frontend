import { useState } from 'react'
import { Cruz } from '../components'

const TABLAS: {
  id: string
  nombre: string
  vista: string
  para: string
  campos: { nombre: string; detalle: string }[]
}[] = [
  {
    id: 'servicios',
    nombre: 'Servicios',
    vista: 'Camas y ocupación',
    para: 'Los pabellones de La Ladera. De aquí salen el nombre, el piso y el cupo con el que se calcula el porcentaje.',
    campos: [
      { nombre: 'nombre_servicio', detalle: 'Código del pabellón. En pantalla se lee UCI adultos, Urgencias, Medicina interna, Pediatría o Cirugía.' },
      { nombre: 'piso_pabellon', detalle: 'Piso de la sede. Aparece junto al servicio en Camas y en el reporte de ocupación.' },
      { nombre: 'capacidad_total_camas', detalle: 'Cupo del servicio. La ocupación compara las camas ocupadas contra este total.' },
    ],
  },
  {
    id: 'camas',
    nombre: 'Camas',
    vista: 'Camas, aseo y alertas',
    para: 'Cada cama con su código y su estado. El clic de aseo solo cambia una cama que está en limpieza.',
    campos: [
      { nombre: 'codigo_cama', detalle: 'El código que se busca, por ejemplo UCI-18 o URG-02.' },
      { nombre: 'estado_cama', detalle: 'OCUPADA, DISPONIBLE, EN_LIMPIEZA o MANTENIMIENTO. Aseo solo pasa de EN_LIMPIEZA a DISPONIBLE.' },
      { nombre: 'id_servicio', detalle: 'El pabellón al que pertenece. Así se arma el grupo de cada piso.' },
    ],
  },
  {
    id: 'medicamentos',
    nombre: 'Medicamentos',
    vista: 'Farmacia y alertas',
    para: 'Inventario del turno. Los días de cobertura son el stock dividido por el consumo diario. Menos de 5 días enciende la alerta.',
    campos: [
      { nombre: 'nombre_generico', detalle: 'Cómo se lista el fármaco en Farmacia y en la alerta.' },
      { nombre: 'stock_actual', detalle: 'Unidades que hay ahora.' },
      { nombre: 'consumo_diario_promedio', detalle: 'Lo que se gasta en un día. Sirve para los días de cobertura y para el consumo por familia.' },
      { nombre: 'es_critico', detalle: '1 si el fármaco no puede faltar. Esa marca vuelve la alerta urgente.' },
    ],
  },
  {
    id: 'episodios_admision',
    nombre: 'Admisiones',
    vista: 'Urgencias',
    para: 'La muestra del turno: cuándo entró la persona y cuándo la vio el médico. La espera puerta-médico es esa diferencia.',
    campos: [
      { nombre: 'id_servicio_ingreso', detalle: 'Servicio por el que entró. En la muestra, urgencias.' },
      { nombre: 'fecha_hora_ingreso', detalle: 'Hora de llegada a la puerta.' },
      { nombre: 'fecha_hora_atencion_medica', detalle: 'Hora de la atención. Con el ingreso arma los minutos de espera.' },
    ],
  },
  {
    id: 'triages',
    nombre: 'Triage',
    vista: 'Frase del turno',
    para: 'El nivel y la nota que ya escribió el médico. La frase grande del inicio sale de esa nota, no de un texto inventado.',
    campos: [
      { nombre: 'nivel_triage', detalle: 'Del 1 al 5. Colorea la espera y la distribución de Urgencias.' },
      { nombre: 'nota_triage', detalle: 'El texto del médico. ANA IA lo pone donde el jefe de turno lo ve.' },
      { nombre: 'id_admision', detalle: 'Une la nota con el episodio de ingreso.' },
    ],
  },
  {
    id: 'quirofanos',
    nombre: 'Quirófanos',
    vista: 'Quirófanos',
    para: 'Cada sala con lo programado, lo realizado y si está en cirugía.',
    campos: [
      { nombre: 'nombre_sala', detalle: 'Nombre que se ve en la lista, por ejemplo Quirófano 2 - Laparoscopia.' },
      { nombre: 'tipo_quirofano', detalle: 'Cirugía mayor o urgencias.' },
      { nombre: 'estado', detalle: 'EN_CIRUGIA o DISPONIBLE.' },
      { nombre: 'programadas', detalle: 'Cirugías de la agenda.' },
      { nombre: 'realizadas', detalle: 'Cirugías que ya salieron de sala.' },
    ],
  },
]

export function Diccionario() {
  const [id, setId] = useState(TABLAS[0].id)
  const activa = TABLAS.find((tabla) => tabla.id === id) ?? TABLAS[0]

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <h1>Diccionario de datos</h1>
          <p className="muted">Las tablas del backend y el campo del que sale cada número</p>
        </div>
      </header>
      <article className="card dict-lead">
        <Cruz className="cross sm mint" />
        <div>
          <h2>Para qué está esta vista</h2>
          <p>No calcula el turno. Nombra las tablas que ya guarda el backend, para saber de dónde sale una cama, una alerta, un medicamento o la frase del inicio.</p>
        </div>
      </article>
      <section className="catalogo">
        <article className="card catalogo-nav">
          <header className="card-head"><h2>Tablas</h2></header>
          {TABLAS.map((tabla) => (
            <button
              key={tabla.id}
              type="button"
              className={activa.id === tabla.id ? 'active' : ''}
              aria-pressed={activa.id === tabla.id}
              onClick={() => setId(tabla.id)}
            >
              <strong>{tabla.nombre}</strong>
              <span>{tabla.vista}</span>
            </button>
          ))}
        </article>
        <article className="card">
          <header className="card-head catalogo-head">
            <div>
              <p className="eyebrow">{activa.vista}</p>
              <h2>{activa.nombre}</h2>
            </div>
            <span className="tag">{activa.campos.length} campos</span>
          </header>
          <p className="muted">{activa.para}</p>
          <div className="campos">
            {activa.campos.map((campo) => (
              <div className="campo" key={campo.nombre}>
                <code>{campo.nombre}</code>
                <p>{campo.detalle}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  )
}
