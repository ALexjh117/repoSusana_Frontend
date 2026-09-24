import { fechaCorta } from '../lib/format'
import { Icon, type IconName } from './icons'

export function SectionHeader({ icon, title, subtitle }: { icon: IconName; title: string; subtitle: string }) {
  return (
    <header className="camas-header">
      <div className="camas-header-copy">
        <div className="camas-header-context"><Icon name="hospital" /> Sede La Ladera · {fechaCorta()}</div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <span className="camas-header-mark" aria-hidden="true"><Icon name={icon} /></span>
    </header>
  )
}
