
import type { SportsSeriesResponse } from '../types'

type Props = { result: SportsSeriesResponse }

export default function SportsSeriesResults({ result }: Props) {
  const a = result.probabilidadEquipoA * 100
  const b = result.probabilidadEquipoB * 100

  return (
    <div className="mx-auto my-8 w-full max-w-5xl space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {([['Equipo A', a], ['Equipo B', b]] as const).map(([label, percent]) => (
          <section key={label} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Probabilidad de ganar · {label}</p>
            <p className="mt-2 text-4xl font-bold tabular-nums text-slate-900 dark:text-white">{percent.toFixed(2)}%</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{(percent / 100).toFixed(4)}</p>
          </section>
        ))}
      </div>

      <div className="h-4 overflow-hidden rounded-full bg-slate-300" role="img" aria-label={`Equipo A ${a.toFixed(2)} por ciento; Equipo B ${b.toFixed(2)} por ciento`}>
        <div className="h-full bg-violet-600" style={{ width: `${a}%` }} />
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h2 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white">Matriz de probabilidades P(i, j)</h2>
        <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">Los índices indican las victorias que necesita cada equipo. La primera columna permanece en 0 y la primera fila en 1, excepto P(0,0).</p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-center text-sm tabular-nums">
            <thead>
              <tr>
                <th className="border border-slate-300 bg-slate-100 p-3 font-bold text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white">
                  i / j
                </th>
                {(result.matriz[0] ?? []).map((_, j) => (
                  <th
                    className="border border-slate-300 bg-slate-100 p-3 font-bold text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                    key={j}
                  >
                    {j}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {result.matriz.map((row, i) => (
                <tr key={i}>
                  <th className="border border-slate-300 bg-slate-100 p-3 font-bold text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white">
                    {i}
                  </th>
                  {row.map((value, j) => (
                    <td
                      key={j}
                      className={`border border-slate-300 p-3 dark:border-slate-600 ${
                        i === result.matriz.length - 1 && j === row.length - 1
                          ? 'bg-violet-100 font-bold text-violet-900 dark:bg-violet-950 dark:text-violet-200'
                          : 'text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {value.toFixed(4)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">La última celda representa P(Equipo A); P(Equipo B) = 1 − P(Equipo A).</p>
      </section>
    </div>
  )
}
