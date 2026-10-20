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
    <main className="App">
      <h1>Árbol binario de búsqueda óptimo</h1>
      <BstForm onSubmit={handleSubmit} />
      {result && <p>Costo mínimo: {result.costo}</p>}
      {result && <TreeView root={result.arbol} />}
      {result && <MatrixTable tableA={result.tableA} tableR={result.tableR} />}
      {error && <p role="alert" style={{ color: 'red' }}>{error}</p>}
    </main>
  )
}
