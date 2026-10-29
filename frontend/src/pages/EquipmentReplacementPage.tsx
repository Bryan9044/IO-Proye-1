
import { useState } from 'react'
import { getEquipmentReplacementResponse } from '../api'
import EquipmentReplacementForm from '../components/EquipmentReplacementForm'
import EquipmentReplacementResults from '../components/EquipmentReplacementResults'
import type { EquipmentReplacementContract, EquipmentReplacementResponse } from '../types'

export default function EquipmentReplacementPage() {
  const [result, setResult] = useState<EquipmentReplacementResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const submit = async (contract: EquipmentReplacementContract) => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      setResult(await getEquipmentReplacementResponse(contract))
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
        Reemplazo de equipos
      </h1>

      <p className="mx-auto max-w-3xl text-center text-xl font-semibold leading-relaxed text-indigo-600 dark:text-indigo-400 md:text-2xl">
        Determine el costo mínimo y los períodos óptimos para reemplazar un equipo mediante programación dinámica.
      </p>

      <EquipmentReplacementForm onSubmit={submit} loading={loading} />

      {error && (
        <p
          role="alert"
          className="mx-auto my-4 max-w-3xl rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
        >
          {error}
        </p>
      )}

      {result && <EquipmentReplacementResults result={result} />}

    </section>
  )
}
