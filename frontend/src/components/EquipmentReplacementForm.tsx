
import { useState, type ChangeEvent, type FormEvent } from 'react'
import type { EquipmentReplacementContract, EquipmentPeriod } from '../types'
import { textInputClass, primaryButtonClass, secondaryButtonClass, fileInputClass } from './formStyles'

type Props = {
  onSubmit: (contract: EquipmentReplacementContract) => void | Promise<void>
  loading: boolean
}

const initialPeriods: EquipmentPeriod[] = [
  { reventa: 11000, mantenimiento: 800 },
  { reventa: 8500, mantenimiento: 1300 },
  { reventa: 6000, mantenimiento: 2100 },
  { reventa: 3500, mantenimiento: 3000 },
]

// Funcion para validar el contrato
function validateContract(value: unknown): EquipmentReplacementContract {
  if (!value || typeof value !== 'object') {
    throw new Error('El JSON debe contener un objeto.')
  }

  const data = value as Record<string, unknown>
  const isInt = (v: unknown) =>
    typeof v === 'number' && Number.isSafeInteger(v)

  if (data.algoritmo !== 'reemplazo-equipos') {
    throw new Error('El contrato no corresponde a reemplazo de equipos.')
  }

  if (!isInt(data.costoInicial) || (data.costoInicial as number) < 0) {
    throw new Error('El costo inicial debe ser un entero no negativo.')
  }

  // Plazo permitido: 1 a 30
  if (!isInt(data.plazo) ||
      (data.plazo as number) < 1 ||
      (data.plazo as number) > 30) {
    throw new Error('El plazo debe ser un entero entre 1 y 30.')
  }

  // Vida util permitida: 1 a 10
  if (!isInt(data.vidaUtil) ||
      (data.vidaUtil as number) < 1 ||
      (data.vidaUtil as number) > 10) {
    throw new Error('La vida útil debe ser un entero entre 1 y 10.')
  }

  if (!Array.isArray(data.periodos) ||
      data.periodos.length !== data.vidaUtil) {
    throw new Error('Debe ingresar un período por cada año de vida útil.')
  }

  for (const [i, item] of data.periodos.entries()) {
    if (!item ||
        typeof item !== 'object' ||
        !isInt(item.reventa) ||
        item.reventa < 0 ||
        !isInt(item.mantenimiento) ||
        item.mantenimiento < 0) {
      throw new Error(
        `El período ${i + 1} debe tener reventa y mantenimiento enteros no negativos.`
      )
    }
  }

  return {
    algoritmo: 'reemplazo-equipos',
    costoInicial: data.costoInicial as number,
    plazo: data.plazo as number,
    vidaUtil: data.vidaUtil as number,
    periodos: data.periodos as EquipmentPeriod[]
  }
}

export default function EquipmentReplacementForm({ onSubmit, loading }: Props) {
  const [cost, setCost] = useState('15000')
  const [horizon, setHorizon] = useState('7')
  const [life, setLife] = useState('4')
  const [periods, setPeriods] = useState<EquipmentPeriod[]>(initialPeriods)
  const [error, setError] = useState<string | null>(null)

  // Crea y valida el contrato
  const makeContract = () => validateContract({
    algoritmo: 'reemplazo-equipos',
    costoInicial: cost.trim() === '' ? NaN : Number(cost),
    plazo: horizon.trim() === '' ? NaN : Number(horizon),
    vidaUtil: life.trim() === '' ? NaN : Number(life),
    periodos: periods
  })

  // Actualiza la vida util y la cantidad de periodos
  const updateLife = (raw: string) => {
    setLife(raw)
    const size = Number(raw)

    if (Number.isSafeInteger(size) && size >= 1 && size <= 10) {
      setPeriods(current =>
        Array.from(
          { length: size },
          (_, i) => current[i] ?? { reventa: 0, mantenimiento: 0 }
        )
      )
    }
  }

  // Actualiza el valor de reventa o mantenimiento
  const updatePeriod = (
    index: number,
    field: keyof EquipmentPeriod,
    raw: string
  ) => {
    setPeriods(current =>
      current.map((row, i) =>
        i === index
          ? { ...row, [field]: raw.trim() === '' ? NaN : Number(raw) }
          : row
      )
    )
  }

  // Envia el contrato
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      const contract = makeContract()
      setError(null)
      void onSubmit(contract)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Datos inválidos.')
    }
  }

  // Guarda los datos en un archivo JSON
  const saveJson = () => {
    try {
      const contract = makeContract()
      const name = window.prompt(
        'Nombre para el archivo JSON:',
        'reemplazo-equipos'
      )

      if (name === null) return

      const safe = name.trim().replace(/[<>:"/\\|?*]/g, '-')

      if (!safe) {
        throw new Error('Ingrese un nombre de archivo válido.')
      }

      const url = URL.createObjectURL(
        new Blob(
          [JSON.stringify(contract, null, 2)],
          { type: 'application/json' }
        )
      )

      const link = document.createElement('a')
      link.href = url
      link.download = safe.endsWith('.json') ? safe : `${safe}.json`
      link.click()

      window.setTimeout(() => URL.revokeObjectURL(url), 0)
      setError(null)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'No se pudo guardar el JSON.'
      )
    }
  }

  // Carga y valida un archivo JSON
  const loadJson = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const contract = validateContract(JSON.parse(await file.text()))

      setCost(String(contract.costoInicial))
      setHorizon(String(contract.plazo))
      setLife(String(contract.vidaUtil))
      setPeriods(contract.periodos)
      setError(null)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'No se pudo cargar el JSON.'
      )
    } finally {
      event.target.value = ''
    }
  }

  return (
    <form
      onSubmit={submit}
      className="mx-auto my-6 w-full max-w-4xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
    >
      <h2 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white">
        Datos del equipo
      </h2>

      <p className="mb-6 text-sm text-slate-600 dark:text-slate-300">
        Ingrese el costo de adquisición, el plazo de planeación y la vida útil máxima del equipo.
      </p>

      {/* Datos principales */}
      <div className="grid gap-4 sm:grid-cols-3">

        <label className="font-semibold text-slate-800 dark:text-slate-100">
          Costo inicial
          <input
            className={`${textInputClass} mt-2`}
            type="number"
            min="0"
            step="1"
            required
            value={cost}
            onChange={e => setCost(e.target.value)}
          />
        </label>

        <label className="font-semibold text-slate-800 dark:text-slate-100">
          Plazo (años)
          <input
            className={`${textInputClass} mt-2`}
            type="number"
            min="1"
            max="30"
            step="1"
            required
            value={horizon}
            onChange={e => setHorizon(e.target.value)}
          />
        </label>

        <label className="font-semibold text-slate-800 dark:text-slate-100">
          Vida útil (años)
          <input
            className={`${textInputClass} mt-2`}
            type="number"
            min="1"
            max="10"
            step="1"
            required
            value={life}
            onChange={e => updateLife(e.target.value)}
          />
        </label>

      </div>

      {/* Periodos de mantenimiento y reventa */}
      <h3 className="mt-7 mb-2 text-lg font-semibold text-slate-900 dark:text-white">
        Reventa y mantenimiento por año de uso
      </h3>

      <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
        El año 1 corresponde al primer año que se utiliza un equipo nuevo.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {periods.map((period, index) => (
          <div
            key={index}
            className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800"
          >
            <p className="mb-3 font-bold text-slate-900 dark:text-white">
              Año {index + 1}
            </p>

            <div className="grid gap-3 sm:grid-cols-2">

              <label className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Valor de reventa
                <input
                  className={`${textInputClass} mt-1`}
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={Number.isNaN(period.reventa) ? '' : period.reventa}
                  onChange={e =>
                    updatePeriod(index, 'reventa', e.target.value)
                  }
                />
              </label>

              <label className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Mantenimiento
                <input
                  className={`${textInputClass} mt-1`}
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={Number.isNaN(period.mantenimiento) ? '' : period.mantenimiento}
                  onChange={e =>
                    updatePeriod(index, 'mantenimiento', e.target.value)
                  }
                />
              </label>

            </div>
          </div>
        ))}
      </div>

      {/* Mensaje de error */}
      {error && (
        <p
          role="alert"
          className="mt-4 rounded-lg bg-red-50 p-3 text-red-700 dark:bg-red-950 dark:text-red-200"
        >
          {error}
        </p>
      )}

      {/* Botones */}
      <div className="mt-6 flex flex-wrap gap-3">

        <button
          className={primaryButtonClass}
          disabled={loading}
          type="submit"
        >
          {loading ? 'Calculando…' : 'Calcular reemplazo óptimo'}
        </button>

        <button
          className={secondaryButtonClass}
          type="button"
          onClick={saveJson}
        >
          Guardar JSON
        </button>

      </div>

      {/* Cargar JSON */}
      <div className="mt-6 border-t border-slate-200 pt-5 dark:border-slate-700">
        <label
          htmlFor="equipment-json"
          className="mb-2 block font-semibold text-slate-800 dark:text-white"
        >
          Cargar contrato JSON
        </label>

        <input
          id="equipment-json"
          className={fileInputClass}
          type="file"
          accept=".json,application/json"
          onChange={loadJson}
        />
      </div>

    </form>
  )
}
