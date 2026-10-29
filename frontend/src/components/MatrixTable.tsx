
type MatrixValue = number | '#'

type Props = {
  tableA: number[][]
  tableR: MatrixValue[][]
}

function formatValue(value: MatrixValue): string {
  if (typeof value !== 'number') return value
  return Number(value.toFixed(4)).toString()
}

function renderMatrix(title: string, matrix: MatrixValue[][]) {
  const columnCount = matrix[0]?.length ?? 0
  const headerCellClass = 'border-b border-r border-slate-300 bg-violet-100 px-3 py-2.5 text-center text-sm font-bold text-violet-950 dark:border-slate-700 dark:bg-violet-950 dark:text-violet-100'

  return (
    <section
      className="w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-md sm:p-6 dark:border-slate-700 dark:bg-slate-900"
    >
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{title}</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {title.includes('raíces') ? 'Cada valor indica la raíz elegida para ese subárbol.' : 'Cada valor muestra el costo mínimo de ese subárbol.'}
          </p>
        </div>
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {matrix.length} claves
        </span>
      </div>
      <div className="w-full overflow-x-auto rounded-xl border border-slate-300 dark:border-slate-700">
        <table className="w-full min-w-[38rem] border-separate border-spacing-0 text-sm sm:min-w-0">
          <thead>
            <tr>
              <th scope="col" className={`${headerCellClass} sticky left-0 z-20 min-w-12`}>i/j</th>
              {Array.from({ length: columnCount }, (_, column) => (
                <th scope="col" key={column} className={`${headerCellClass} min-w-12`}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, rowIndex) => (
              <tr key={rowIndex} className="group">
                <th scope="row" className={`${headerCellClass} sticky left-0 z-10 bg-slate-100 group-hover:bg-violet-100 dark:bg-slate-800 dark:group-hover:bg-violet-950`}>
                  {rowIndex + 1}
                </th>
                {row.map((value, columnIndex) => {
                  const isEmpty = value === '#'
                  const isDiagonal = rowIndex === columnIndex
                  return (
                  <td key={columnIndex} className={`border-b border-r border-slate-200 px-2 py-2.5 text-center font-mono tabular-nums transition-colors group-hover:bg-violet-50 sm:px-3 dark:border-slate-700 dark:group-hover:bg-violet-950/40 ${isDiagonal ? 'bg-emerald-50 font-semibold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200' : isEmpty ? 'bg-slate-50 text-slate-300 dark:bg-slate-800/40 dark:text-slate-600' : 'text-slate-800 dark:text-slate-200'}`}>
                    {formatValue(value)}
                  </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default function MatrixTable({ tableA, tableR }: Props) {
  return (
    <div
      className="mx-auto my-8 flex w-full max-w-7xl flex-col gap-6 px-4 text-left"
    >
      {renderMatrix('Tabla de costos (A)', tableA)}
      {renderMatrix('Tabla de raíces (R)', tableR)}
    </div>
  )
}
