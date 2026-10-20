
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
  const headerCellClass = 'border border-slate-400 bg-slate-100 px-4 py-3 text-center text-base font-semibold text-slate-700 dark:border-slate-500 dark:bg-slate-800 dark:text-slate-200'
  const gridLineStyle = { border: '2px solid #64748b' }
  const tableMinWidth = Math.max(480, (columnCount + 1) * 72)

  return (
    <section
      className="flex w-full min-w-0 flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900"
      style={{ flex: '1 1 480px', maxWidth: '560px', minWidth: 0, boxSizing: 'border-box' }}
    >
      <h2 className="mb-3 text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h2>
      <div className="w-full overflow-x-auto rounded-lg" style={{ width: '100%', overflowX: 'auto' }}>
        <table className="w-full table-fixed text-base" style={{ borderCollapse: 'collapse', border: '2px solid #475569', minWidth: `${tableMinWidth}px` }}>
          <thead>
            <tr>
              <th scope="col" className={headerCellClass} style={gridLineStyle}>i/j</th>
              {Array.from({ length: columnCount }, (_, column) => (
                <th scope="col" key={column} className={headerCellClass} style={gridLineStyle}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, rowIndex) => (
              <tr key={rowIndex} className="odd:bg-white even:bg-slate-50 hover:bg-violet-50 dark:odd:bg-slate-900 dark:even:bg-slate-800/60 dark:hover:bg-violet-950/40">
                <th scope="row" className={headerCellClass} style={gridLineStyle}>{rowIndex + 1}</th>
                {row.map((value, columnIndex) => (
                  <td key={columnIndex} className="border px-4 py-3 text-center font-mono text-base tabular-nums text-slate-700 dark:text-slate-200" style={gridLineStyle}>
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
      className="mx-auto my-8 grid w-full max-w-6xl grid-cols-1 items-stretch justify-items-center gap-8 px-4 text-left lg:grid-cols-2"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'stretch',
        gap: '24px',
        width: '100%',
        maxWidth: '1200px',
        margin: '32px auto',
        padding: '0 16px',
        boxSizing: 'border-box',
      }}
    >
      {renderMatrix('Tabla de costos (A)', tableA)}
      {renderMatrix('Tabla de raíces (R)', tableR)}
    </div>
  )
}

 