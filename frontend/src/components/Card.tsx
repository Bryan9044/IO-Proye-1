import { useId, useState, type ReactNode } from 'react'

export interface CardProps {
  title: string
  description: string
  icon?: ReactNode
  badge?: string
  meta?: string
  actionLabel?: string
  onAction?: () => void
  /** Origen de la información. Si se pasa, aparece el icono de información con tooltip. */
  fuente?: string
  /** Enlace opcional a la fuente (se muestra dentro del tooltip). */
  fuenteUrl?: string
}

export default function Card({
  title,
  description,
  icon,
  badge,
  meta,
  actionLabel = 'Learn more',
  onAction,
  fuente,
  fuenteUrl,
}: CardProps) {
  const [abierto, setAbierto] = useState(false)
  const tooltipId = useId()

  return (
    <article className="aether-card">
      <style>{cardStyles}</style>
      <header className="aether-card__header">
        <span className="aether-card__icon">{icon}</span>

        <div className="aether-card__header-end">
          {badge && <span className="aether-card__badge">{badge}</span>}

          {fuente && (
            <span
              className="aether-card__info"
              onMouseEnter={() => setAbierto(true)}
              onMouseLeave={() => setAbierto(false)}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) setAbierto(false)
              }}
              onKeyDown={(e) => e.key === 'Escape' && setAbierto(false)}
            >
              <button
                type="button"
                className="aether-card__info-btn"
                aria-label="Origen de la información"
                aria-describedby={abierto ? tooltipId : undefined}
                aria-expanded={abierto}
                onFocus={() => setAbierto(true)}
                onClick={() => setAbierto((v) => !v)}
              >
                <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                  <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.4" />
                  <circle cx="8" cy="4.9" r="0.95" fill="currentColor" />
                  <path d="M8 7.4v4.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>

              <span
                id={tooltipId}
                role="tooltip"
                className={'aether-card__tooltip' + (abierto ? ' aether-card__tooltip--open' : '')}
              >
                <span className="aether-card__tooltip-bubble">
                  <span className="aether-card__tooltip-label">Fuente</span>
                  {fuenteUrl ? (
                    <a href={fuenteUrl} target="_blank" rel="noopener noreferrer">
                      {fuente}
                    </a>
                  ) : (
                    fuente
                  )}
                </span>
              </span>
            </span>
          )}
        </div>
      </header>

      <h3 className="aether-card__title">{title}</h3>
      <p className="aether-card__body">{description}</p>
      <footer className="aether-card__footer">
        {meta && <span className="aether-card__meta">{meta}</span>}
        <button className="aether-card__action" type="button" onClick={onAction}>
          {actionLabel}
        </button>
      </footer>
    </article>
  )
}

const cardStyles = `
.aether-card {
  --color-ink: #1d1d1f;
  --color-ink-inverse: #f5f5f7;
  --color-ink-secondary: #54545a;
  --color-ink-tertiary: #86868b;
  --color-surface-raised: rgba(255, 255, 255, 0.85);
  --color-surface-glass: rgba(255, 255, 255, 0.55);
  --color-hairline: rgba(15, 23, 42, 0.08);
  --color-bevel-light: rgba(255, 255, 255, 0.9);
  --color-bevel-soft: rgba(255, 255, 255, 0.55);
  --glass-bevel-inset: inset 1.5px 1.5px 0 0 var(--color-bevel-light),
    inset -1px -1px 0 0 var(--color-bevel-soft),
    inset 0 0 0 1px rgba(15, 23, 42, 0.04);
  --glass-shadow-raised: 0 2px 4px rgba(15, 23, 42, 0.06),
    0 22px 44px -14px rgba(15, 23, 42, 0.22);
  --glass-blur: blur(20px) saturate(180%);
  --dur-med: 220ms;
  --ease-out: cubic-bezier(0.22, 0.61, 0.36, 1);

  position: relative;
  width: min(100%, 320px);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  overflow: hidden;
  background: var(--color-surface-raised);
  -webkit-backdrop-filter: var(--glass-blur);
  backdrop-filter: var(--glass-blur);
  border: 1px solid var(--color-hairline);
  border-radius: 24px;
  box-shadow: var(--glass-bevel-inset), var(--glass-shadow-raised);
}
.aether-card::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.45) 0%,
    rgba(255, 255, 255, 0) 24%,
    rgba(255, 255, 255, 0) 76%,
    rgba(255, 255, 255, 0.22) 100%);
  mix-blend-mode: screen;
}
.aether-card__header,
.aether-card__title,
.aether-card__body,
.aether-card__footer { position: relative; z-index: 1; }

/* El header va por encima para que el tooltip no quede tapado por el contenido */
.aether-card__header { z-index: 2; }

.aether-card__header {
  display: flex; align-items: center; justify-content: space-between; gap: 1rem;
}
.aether-card__header-end { display: flex; align-items: center; gap: 0.5rem; }

.aether-card__icon {
  width: 44px; height: 44px; border-radius: 9999px;
  display: inline-flex; align-items: center; justify-content: center;
  background: var(--color-ink); color: var(--color-ink-inverse);
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.18);
}
.aether-card__badge {
  display: inline-flex; align-items: center; height: 24px; padding: 0 0.625rem;
  font-size: 0.6875rem; letter-spacing: 0.06em; text-transform: uppercase; font-weight: 600;
  color: var(--color-ink-secondary); background: var(--color-surface-glass);
  border: 1px solid var(--color-hairline); border-radius: 9999px;
  box-shadow: var(--glass-bevel-inset);
}

/* Icono de información + tooltip */
.aether-card__info { position: relative; display: inline-flex; }
.aether-card__info-btn {
  display: inline-flex; align-items: center; justify-content: center;
  width: 24px; height: 24px; padding: 0; cursor: pointer;
  color: var(--color-ink-tertiary); background: var(--color-surface-glass);
  border: 1px solid var(--color-hairline); border-radius: 9999px;
  box-shadow: var(--glass-bevel-inset);
  transition: color var(--dur-med) var(--ease-out), background var(--dur-med) var(--ease-out);
}
.aether-card__info-btn:hover,
.aether-card__info-btn[aria-expanded="true"] { color: var(--color-ink); background: rgba(255, 255, 255, 0.85); }
.aether-card__info-btn:focus-visible { outline: 2px solid var(--color-ink); outline-offset: 2px; }

.aether-card__tooltip {
  position: absolute; top: 100%; right: 0; z-index: 3;
  width: max-content; max-width: 220px;
  padding-top: 8px; /* puente invisible para no perder el hover */
  opacity: 0; visibility: hidden; transform: translateY(-4px);
  transition: opacity var(--dur-med) var(--ease-out),
    transform var(--dur-med) var(--ease-out),
    visibility 0s linear var(--dur-med);
}
.aether-card__tooltip--open {
  opacity: 1; visibility: visible; transform: translateY(0);
  transition-delay: 0s;
}
.aether-card__tooltip-bubble {
  display: flex; flex-direction: column; gap: 0.125rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.8125rem; line-height: 1.4; text-align: left;
  color: var(--color-ink-inverse); background: var(--color-ink);
  border-radius: 12px;
  box-shadow: 0 8px 24px -6px rgba(15, 23, 42, 0.4);
}
.aether-card__tooltip-label {
  font-size: 0.625rem; font-weight: 600; letter-spacing: 0.08em;
  text-transform: uppercase; opacity: 0.6;
}
.aether-card__tooltip-bubble a { color: inherit; text-underline-offset: 2px; }

.aether-card__title {
  margin: 0; font-size: 1.0625rem; font-weight: 600; letter-spacing: -0.012em;
  color: var(--color-ink);
}
.aether-card__body {
  margin: 0; font-size: 0.9375rem; line-height: 1.6; color: var(--color-ink-secondary);
}
.aether-card__footer {
  display: flex; align-items: center; justify-content: space-between;
  gap: 0.75rem; margin-top: 0.25rem;
}
.aether-card__meta {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.6875rem; letter-spacing: 0.06em; text-transform: uppercase;
  color: var(--color-ink-tertiary);
}
.aether-card__action {
  font-family: inherit; font-size: 0.8125rem; font-weight: 500;
  color: var(--color-ink-secondary); background: transparent; border: none;
  border-radius: 9999px; padding: 0.375rem 0.75rem; cursor: pointer; margin-left: auto;
  transition: color var(--dur-med) var(--ease-out), background var(--dur-med) var(--ease-out);
}
.aether-card__action:hover { color: var(--color-ink); background: rgba(255, 255, 255, 0.35); }

@media (prefers-reduced-motion: reduce) {
  .aether-card__tooltip { transition: none; transform: none; }
}
`
