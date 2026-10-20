import { useState } from 'react'
import './App.css'
import { getBSTResponse } from './api'
import type { BstResponse } from './types'
import BstForm from './components/BstForm'
import MatrixTable from './components/MatrixTable'
import TreeView from './components/TreeView'

function App() {
  const [result, setResult] = useState<BstResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (keys: string[], weights: number[]) => {
    try {
      const response = await getBSTResponse(keys, weights)
      setResult(response)
      setError(null)
    } catch (error) {
      setResult(null)
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('An unknown error occurred')
      }
    }
  }

  return (
    <div className="App">
      <BstForm onSubmit={handleSubmit} />
      {result && <p>Costo mínimo: {result.costo}</p>}
      {result && <TreeView root={result.arbol} />}
      {result && <MatrixTable tableA={result.tableA} tableR={result.tableR} />}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}

export default App