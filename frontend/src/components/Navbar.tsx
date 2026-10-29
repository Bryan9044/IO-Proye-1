import { NavLink } from 'react-router-dom'

/** Cada elemento es una tupla [nombreElemento, RutaRouter] */
export type ElementoNavbar = [nombre: string, ruta: string]

interface NavbarProps {
  elementos: ElementoNavbar[]
}

export default function Navbar({ elementos }: NavbarProps) {
  return (
    <nav className="aether-navbar" aria-label="Navegación principal">
      <style>{navbarStyles}</style>
      <ul className="aether-navbar__list">
        {elementos.map(([nombre, ruta]) => (
          <li key={ruta}>
            <NavLink
              to={ruta}
              end={ruta === '/'}
              className={({ isActive }) =>
                'aether-navbar__link' + (isActive ? ' aether-navbar__link--active' : '')
              }
            >
              {nombre}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

const navbarStyles = `
.aether-navbar {
  --color-ink: #1d1d1f;
  --color-ink-inverse: #f5f5f7;
  --color-ink-secondary: #54545a;
  --color-hairline: rgba(15, 23, 42, 0.08);
  --dur-med: 220ms;
  --ease-out: cubic-bezier(0.22, 0.61, 0.36, 1);

  position: sticky; top: 1rem; z-index: 10;
  width: fit-content; max-width: calc(100% - 2rem);
  margin: 1rem auto 0; padding: 0.375rem;
  background: rgba(255, 255, 255, 0.7);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--color-hairline);
  border-radius: 9999px;
  box-shadow:
    inset 1.5px 1.5px 0 0 rgba(255, 255, 255, 0.9),
    0 2px 4px rgba(15, 23, 42, 0.06),
    0 14px 30px -12px rgba(15, 23, 42, 0.22);
}
.aether-navbar__list {
  display: flex; gap: 0.25rem; margin: 0; padding: 0; list-style: none;
  overflow-x: auto;
}
.aether-navbar__link {
  display: inline-flex; align-items: center; height: 36px; padding: 0 1rem;
  font-size: 0.875rem; font-weight: 500; text-decoration: none; white-space: nowrap;
  color: var(--color-ink-secondary); border-radius: 9999px;
  transition: color var(--dur-med) var(--ease-out), background var(--dur-med) var(--ease-out);
}
.aether-navbar__link:hover { color: var(--color-ink); background: rgba(255, 255, 255, 0.6); }
.aether-navbar__link--active {
  color: var(--color-ink-inverse); background: var(--color-ink);
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.28);
}
.aether-navbar__link--active:hover { color: var(--color-ink-inverse); background: var(--color-ink); }
`
