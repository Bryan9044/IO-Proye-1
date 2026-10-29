import { useState } from 'react'
import { getMatrixMultiplicationResponse } from '../api'
import MatrixMultiplicationForm from '../components/MatrixMultiplicationForm'
import MatrixChainVisualization from '../components/MatrixChainVisualization'
import MatrixMultiplicationTables from '../components/MatrixMultiplicationTables'
import type { MatrixMultiplicationResponse } from '../types'

export default function MatrixMultiplicationPage() {
  const [result, setResult] = useState<MatrixMultiplicationResponse | null>(null)
  const [dimensions, setDimensions] = useState<number[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (dimensions: number[]) => {
    try {
      const response = await getMatrixMultiplicationResponse(dimensions)
      setResult(response)
      setDimensions(dimensions)
      setError(null)
    } catch (error) {
      setResult(null)
      setError(error instanceof Error ? error.message : 'Ocurrió un error desconocido.')
    }
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8">
      <h1 className="mb-8 text-center text-3xl font-bold tracking-tight text-slate-900 md:text-5xl dark:text-slate-100">Multiplicación de matrices</h1>
      <MatrixMultiplicationForm onSubmit={handleSubmit} />
      {result && <p className="my-4 text-center text-lg font-semibold text-slate-800 dark:text-slate-100">Costo mínimo: {result.costo}</p>}
      {result && dimensions && <MatrixChainVisualization parentization={result.parentizacion} dimensions={dimensions} />}
      {result && <MatrixMultiplicationTables tableM={result.tableM} tableP={result.tableP} />}
      {error && <p role="alert" className="mx-auto mt-4 w-fit rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">{error}</p>}
    </main>
  )
}
