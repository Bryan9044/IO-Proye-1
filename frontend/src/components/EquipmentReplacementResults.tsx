import type { EquipmentReplacementResponse } from '../types'

type Props = { result: EquipmentReplacementResponse }
const money = (value: number) => new Intl.NumberFormat('es-CR', { maximumFractionDigits: 2 }).format(value)

export default function EquipmentReplacementResults({ result }: Props) {
  return (
    <div className="mx-auto my-8 w-full max-w-5xl space-y-6">
      <section className="rounded-xl border border-violet-200 bg-violet-50 p-6 shadow-sm dark:border-violet-800 dark:bg-violet-950/30">
        <p className="font-semibold text-violet-800 dark:text-violet-200">Costo mínimo del plan de reemplazo</p>
        <p className="mt-2 text-4xl font-bold tabular-nums text-violet-900 dark:text-violet-100">{money(result.costoMinimo)}</p>
      </section>
      {Array.isArray(result.rutasOptimas) && (
        <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <h2 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">Rutas óptimas</h2>
          {result.rutasOptimas.length === 0 ? <p className="text-slate-600 dark:text-slate-300">No se reportaron rutas.</p> : (
            <div className="space-y-3">{result.rutasOptimas.map((route, index) => (
              <div key={index} className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                <strong>Ruta {index + 1}:</strong> {Array.isArray(route) ? route.join(' → ') : typeof route === 'object' ? JSON.stringify(route) : String(route)}
              </div>
            ))}</div>
          )}
        </section>
      )}
      <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">Análisis por período</h2>
        <div className="space-y-6">{result.periodos.map((period, index) => (
          <div key={`${period.funcion}-${index}`} className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-100 px-4 py-3 dark:bg-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white">{period.funcion} · Período {period.periodo}</h3>
              <span className="font-semibold text-violet-800 dark:text-violet-200">Costo mínimo: {money(period.costoMinimo)}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-center text-sm tabular-nums">
                <thead><tr className="bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white">
                  {['Desde','Hasta','Años uso','Reemplazo','Costo futuro','Total','Óptima'].map(head => <th key={head} className="border border-slate-300 p-3 dark:border-slate-600">{head}</th>)}
                </tr></thead>
                <tbody>{period.alternativas.map((a, i) => (
                  <tr key={i} className={a.esOptima ? 'bg-violet-100 text-violet-950 dark:bg-violet-950 dark:text-violet-100' : 'text-slate-800 dark:text-slate-200'}>
                    <td className="border border-slate-300 p-3 dark:border-slate-600">{a.desde}</td>
                    <td className="border border-slate-300 p-3 dark:border-slate-600">{a.hasta}</td>
                    <td className="border border-slate-300 p-3 dark:border-slate-600">{a.anosUso}</td>
                    <td className="border border-slate-300 p-3 dark:border-slate-600">{money(a.costoReemplazo)}</td>
                    <td className="border border-slate-300 p-3 dark:border-slate-600">{money(a.costoFuturo)}</td>
                    <td className="border border-slate-300 p-3 font-semibold dark:border-slate-600">{money(a.total)}</td>
                    <td className="border border-slate-300 p-3 dark:border-slate-600">{a.esOptima ? 'Sí' : 'No'}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
            {period.destinosOptimos && period.destinosOptimos.length > 0 && <p className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200">Destinos óptimos: {period.destinosOptimos.join(', ')}</p>}
          </div>
        ))}</div>
      </section>
    </div>
  )
}
