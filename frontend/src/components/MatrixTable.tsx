
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
  const headerCellClass = 'border-2 border-slate-500 bg-slate-100 px-4 py-3 text-center text-base font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200'

  return (
    <section
      className="flex min-w-0 max-w-[35rem] flex-[1_1_30rem] flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900"
    >
      <h2 className="mb-3 text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h2>
      <div className="w-full overflow-x-auto rounded-lg">
        <table className="w-full min-w-[48rem] table-fixed border-collapse border-2 border-slate-600 text-base">
          <thead>
            <tr>
              <th scope="col" className={headerCellClass}>i/j</th>
              {Array.from({ length: columnCount }, (_, column) => (
                <th scope="col" key={column} className={headerCellClass}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, rowIndex) => (
              <tr key={rowIndex} className="odd:bg-white even:bg-slate-50 hover:bg-violet-50 dark:odd:bg-slate-900 dark:even:bg-slate-800/60 dark:hover:bg-violet-950/40">
                <th scope="row" className={headerCellClass}>{rowIndex + 1}</th>
                {row.map((value, columnIndex) => (
                  <td key={columnIndex} className="border-2 border-slate-500 px-4 py-3 text-center font-mono text-base tabular-nums text-slate-700 dark:text-slate-200">
                    {formatValue(value)}
                  </td>
                ))}
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
      className="mx-auto my-8 flex w-full max-w-6xl flex-wrap items-stretch justify-center gap-6 px-4 text-left"
    >
      {renderMatrix('Tabla de costos (A)', tableA)}
      {renderMatrix('Tabla de raíces (R)', tableR)}
    </div>
  )
}
