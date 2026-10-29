
import { useState } from 'react'
import { getSportsSeriesResponse } from '../api'
import SportsSeriesForm from '../components/SportsSeriesForm'
import SportsSeriesResults from '../components/SportsSeriesResults'
import type { SportsSeriesContract, SportsSeriesResponse } from '../types'

export default function SportsSeriesPage() {
  const [result, setResult] = useState<SportsSeriesResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const submit = async (contract: SportsSeriesContract) => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      setResult(await getSportsSeriesResponse(contract))
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Ocurrió un error desconocido.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8">

      <h1 className="mb-3 text-center text-4xl font-extrabold tracking-tight text-indigo-700 dark:text-indigo-400 md:text-5xl">
        Series deportivas
      </h1>

      <p className="mx-auto max-w-3xl text-center text-xl font-semibold leading-relaxed text-indigo-600 dark:text-indigo-400 md:text-2xl">
        Calcule la probabilidad de que el Equipo A o el Equipo B gane una serie al mejor de N partidos.
      </p>

      <SportsSeriesForm onSubmit={submit} loading={loading} />

      {error && (
        <p
          role="alert"
          className="mx-auto my-4 max-w-3xl rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
        >
          {error}
        </p>
      )}

      {result && <SportsSeriesResults result={result} />}

    </section>
  )
}
