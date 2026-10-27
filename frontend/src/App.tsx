import { useState } from 'react'
import OptimalBstPage from './pages/OptimalBstPage'
import MatrixMultiplicationPage from './pages/MatrixMultiplicationPage'

export default function App() {
  const [page, setPage] = useState<'bst' | 'matrices'>('bst')

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <nav aria-label="Algoritmos" className="flex flex-wrap justify-center gap-3 px-4 pt-5">
        <button
          type="button"
          aria-current={page === 'bst' ? 'page' : undefined}
          onClick={() => setPage('bst')}
          className={`rounded-lg border px-4 py-2.5 font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 ${page === 'bst' ? 'border-violet-700 bg-violet-700 text-white' : 'border-violet-700 bg-white text-violet-700 hover:bg-violet-50 dark:bg-slate-900 dark:text-violet-300 dark:hover:bg-slate-800'}`}
        >
          Árbol BST
        </button>
        <button
          type="button"
          aria-current={page === 'matrices' ? 'page' : undefined}
          onClick={() => setPage('matrices')}
          className={`rounded-lg border px-4 py-2.5 font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 ${page === 'matrices' ? 'border-violet-700 bg-violet-700 text-white' : 'border-violet-700 bg-white text-violet-700 hover:bg-violet-50 dark:bg-slate-900 dark:text-violet-300 dark:hover:bg-slate-800'}`}
        >
          Multiplicación de matrices
        </button>
      </nav>
      {page === 'bst' ? <OptimalBstPage /> : <MatrixMultiplicationPage />}
    </div>
  )
}
