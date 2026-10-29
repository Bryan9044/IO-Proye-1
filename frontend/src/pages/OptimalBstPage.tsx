import { useState } from 'react'
import { getBSTResponse } from '../api'
import BstForm from '../components/BstForm'
import MatrixTable from '../components/MatrixTable'
import TreeView from '../components/TreeView'
import type { BstResponse } from '../types'

export default function OptimalBstPage() {
  const [result, setResult] = useState<BstResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (keys: string[], weights: number[]) => {
    try {
      const response = await getBSTResponse(keys, weights)
      setResult(response)
      setError(null)
    } catch (error) {
      setResult(null)
      setError(error instanceof Error ? error.message : 'Ocurrió un error desconocido.')
    }
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8">
      <h1 className="mb-8 text-center text-3xl font-bold tracking-tight text-slate-900 md:text-5xl dark:text-slate-100">Árbol binario de búsqueda óptimo</h1>
      <BstForm onSubmit={handleSubmit} />
      {result && <p className="my-4 text-center text-lg font-semibold text-slate-800 dark:text-slate-100">Costo mínimo: {result.costo}</p>}
      {result && <TreeView root={result.arbol} />}
      {result && <MatrixTable tableA={result.tableA} tableR={result.tableR} />}
      {error && <p role="alert" className="mx-auto mt-4 w-fit rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">{error}</p>}
    </main>
  )
}
