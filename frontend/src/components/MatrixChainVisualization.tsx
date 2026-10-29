type Props = {
  parentization: string
  dimensions: number[]
}

function getTokens(parentization: string): string[] {
  return parentization.match(/\(|\)|A\d+|x/g) ?? []
}

export default function MatrixChainVisualization({ parentization, dimensions }: Props) {
  const tokens = getTokens(parentization)

  return (
    <section
      aria-label="Parentización óptima de la cadena de matrices"
      className="mx-auto my-6 w-full max-w-5xl rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-5 shadow-md sm:p-7 dark:border-violet-900 dark:from-slate-900 dark:to-slate-900"
    >
      <div className="mb-5 text-center">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Orden óptimo de multiplicación</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Las matrices mantienen su orden; los paréntesis muestran qué grupos se multiplican primero.
        </p>
      </div>
      <div className="overflow-x-auto rounded-xl border border-violet-100 bg-white p-4 dark:border-slate-700 dark:bg-slate-950/50">
        <div className="flex min-w-max flex-wrap items-center justify-center gap-x-1 gap-y-3 sm:gap-x-2" aria-label={parentization}>
          {tokens.map((token, tokenIndex) => {
            if (token === '(' || token === ')') {
              return (
                <span key={`${token}-${tokenIndex}`} aria-hidden="true" className="font-mono text-3xl font-light text-violet-500 dark:text-violet-300">
                  {token}
                </span>
              )
            }

            if (token === 'x') {
              return (
                <span key={`operator-${tokenIndex}`} aria-hidden="true" className="px-1 text-lg font-semibold text-slate-400 dark:text-slate-500">
                  ×
                </span>
              )
            }

            const matrixIndex = Number(token.slice(1))
            const rows = dimensions[matrixIndex]
            const columns = dimensions[matrixIndex + 1]
            return (
              <span
                key={`matrix-${tokenIndex}`}
                className="inline-flex min-w-20 flex-col items-center rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-violet-950 shadow-sm dark:border-violet-800 dark:bg-violet-950/60 dark:text-violet-100"
              >
                <span className="text-base font-bold">A<sub>{matrixIndex + 1}</sub></span>
                {rows !== undefined && columns !== undefined && (
                  <span className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">{rows} × {columns}</span>
                )}
              </span>
            )
          })}
        </div>
      </div>
    </section>
  )
}
