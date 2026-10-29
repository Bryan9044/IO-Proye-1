import { useState, type ChangeEvent, type FormEvent } from 'react'
import { fileInputClass, primaryButtonClass, secondaryButtonClass, textInputClass } from './formStyles'
import type { SportsSeriesContract } from '../types'

type Props = {
  onSubmit: (contract: SportsSeriesContract) => void | Promise<void>
  loading: boolean
}

const defaultFormat = [true, true, false, false, false, true, true]

function validateContract(data: unknown): SportsSeriesContract {
  if (!data || typeof data !== 'object') throw new Error('El JSON debe contener un objeto.')
  const obj = data as Record<string, unknown>
  if (obj.algoritmo !== undefined && obj.algoritmo !== 'series-deportivas') {
    throw new Error('El archivo no corresponde al algoritmo de series deportivas.')
  }
  if (typeof obj.juegos !== 'number' || !Number.isSafeInteger(obj.juegos) || obj.juegos < 1 || obj.juegos > 99 || obj.juegos % 2 === 0) {
    throw new Error('La cantidad de juegos debe ser impar, entre 1 y 99.')
  }
  if (typeof obj.ph !== 'number' || !Number.isFinite(obj.ph) || obj.ph < 0 || obj.ph > 1 ||
      typeof obj.pr !== 'number' || !Number.isFinite(obj.pr) || obj.pr < 0 || obj.pr > 1) {
    throw new Error('ph y pr deben ser probabilidades entre 0 y 1.')
  }
  if (!Array.isArray(obj.formato) || obj.formato.length !== obj.juegos || !obj.formato.every(value => typeof value === 'boolean')) {
    throw new Error('El formato debe contener un valor true o false por cada partido.')
  }
  return { juegos: obj.juegos, ph: obj.ph, pr: obj.pr, formato: obj.formato as boolean[] }
}

export default function SportsSeriesForm({ onSubmit, loading }: Props) {
  const [juegos, setJuegos] = useState(7)
  const [ph, setPh] = useState('0.60')
  const [pr, setPr] = useState('0.45')
  const [formato, setFormato] = useState<boolean[]>(defaultFormat)
  const [validationError, setValidationError] = useState<string | null>(null)

  const changeGames = (value: number) => {
    setJuegos(value)
    setFormato(previous => Array.from({ length: value }, (_, i) => previous[i] ?? (i % 2 === 0)))
  }

  const currentContract = () => validateContract({ juegos, ph: Number(ph), pr: Number(pr), formato })

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      const contract = currentContract()
      setValidationError(null)
      void onSubmit(contract)
    } catch (error) {
      setValidationError(error instanceof Error ? error.message : 'Datos inválidos.')
    }
  }

  const saveJson = () => {
    try {
      const contract = currentContract()
      setValidationError(null)
      const filename = window.prompt('Nombre para el archivo JSON:', 'series-deportivas')
      if (filename === null) return
      const safeName = filename.trim().replace(/[<>:"/\\|?*]/g, '-')
      if (!safeName) throw new Error('Ingrese un nombre válido para el archivo.')
      const file = new Blob([JSON.stringify({ algoritmo: 'series-deportivas', ...contract }, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(file)
      const a = document.createElement('a')
      a.href = url
      a.download = safeName.toLowerCase().endsWith('.json') ? safeName : `${safeName}.json`
      a.click()
      window.setTimeout(() => URL.revokeObjectURL(url), 0)
    } catch (error) {
      setValidationError(error instanceof Error ? error.message : 'No se pudo guardar.')
    }
  }

  const loadJson = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      const contract = validateContract(JSON.parse(await file.text()))
      setJuegos(contract.juegos)
      setPh(String(contract.ph))
      setPr(String(contract.pr))
      setFormato(contract.formato)
      setValidationError(null)
    } catch (error) {
      setValidationError(error instanceof Error ? error.message : 'No se pudo cargar el JSON.')
    } finally {
      event.target.value = ''
    }
  }

  return (
    <form onSubmit={submit} className="mx-auto my-6 w-full max-w-3xl rounded-xl border border-slate-200 bg-white p-6 text-left shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <h2 className="mb-1 text-xl font-semibold text-slate-900 dark:text-slate-100">Datos de la serie</h2>
      <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">Defina las probabilidades del Equipo A y dónde juega cada partido.</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="series-games" className="mb-2 block font-semibold text-slate-700 dark:text-slate-200">Máximo de juegos</label>
          <select id="series-games" className={textInputClass} value={juegos} onChange={event => changeGames(Number(event.target.value))}>
            {[1, 3, 5, 7, 9, 11, 13, 15].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="series-ph" className="mb-2 block font-semibold text-slate-700 dark:text-slate-200">ph · A gana en casa</label>
          <input id="series-ph" className={textInputClass} type="number" min="0" max="1" step="any" required value={ph} onChange={event => setPh(event.target.value)} />
        </div>
        <div>
          <label htmlFor="series-pr" className="mb-2 block font-semibold text-slate-700 dark:text-slate-200">pr · A gana de visita</label>
          <input id="series-pr" className={textInputClass} type="number" min="0" max="1" step="any" required value={pr} onChange={event => setPr(event.target.value)} />
        </div>
      </div>
      <div className="mt-6">
        <h3 className="mb-1 font-semibold text-slate-700 dark:text-slate-200">Formato de los partidos</h3>
        <p className="mb-3 text-sm text-slate-500 dark:text-slate-400"><strong>Casa</strong> = true; <strong>Visita</strong> = false, siempre desde la perspectiva del Equipo A.</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
          {formato.map((home, index) => (
            <button type="button" key={index} aria-label={`Partido ${index + 1}: ${home ? 'casa' : 'visita'}. Cambiar localía`} aria-pressed={home}
              onClick={() => setFormato(current => current.map((value, i) => i === index ? !value : value))}
              className={`rounded-lg border px-3 py-3 text-sm font-medium transition ${home ? 'border-violet-600 bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-200' : 'border-slate-300 bg-slate-50 text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200'}`}>
              <span className="block text-xs opacity-70">Partido {index + 1}</span>{home ? 'Casa' : 'Visita'}
            </button>
          ))}
        </div>
      </div>
      {validationError && <p role="alert" className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-red-700 dark:bg-red-950/40 dark:text-red-300">{validationError}</p>}
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="submit" disabled={loading} className={`${primaryButtonClass} disabled:cursor-not-allowed disabled:opacity-60`}>{loading ? 'Calculando…' : 'Calcular probabilidades'}</button>
        <button type="button" onClick={saveJson} className={secondaryButtonClass}>Guardar JSON</button>
      </div>
      <div className="mt-6 border-t border-slate-200 pt-5 dark:border-slate-700">
        <label htmlFor="series-json" className="mb-2 block font-semibold text-slate-700 dark:text-slate-200">Cargar contrato JSON</label>
        <input id="series-json" type="file" accept=".json,application/json" onChange={loadJson} className={fileInputClass} />
      </div>
    </form>
  )
}
