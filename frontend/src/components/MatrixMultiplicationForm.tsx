import { useState, type ChangeEvent, type FormEvent } from 'react'
import { fileInputClass, primaryButtonClass, secondaryButtonClass, textInputClass } from './formStyles'

type Props = {
  onSubmit: (dimensions: number[]) => void
}

function parseDimensions(text: string): number[] {
  return text.split(',').map((dimension) => Number(dimension.trim()))
}

function isValidDimensions(dimensions: number[]): boolean {
  return (
    dimensions.length >= 2 &&
    dimensions.length <= 11 &&
    dimensions.every((dimension) => Number.isSafeInteger(dimension) && dimension > 0)
  )
}

function createJsonDownload(dimensions: number[]) {
  const chosenName = window.prompt('¿Qué nombre quieres para el archivo?', 'multiplicacion-matrices')
  if (chosenName === null) return

  const safeName = chosenName
    .trim()
    .replace(/[<>:"/\\|?*]/g, '-')
    .split('')
    .map((character) => (character.charCodeAt(0) < 32 ? '-' : character))
    .join('')
  if (!safeName) {
    alert('Escribe un nombre válido para el archivo.')
    return
  }

  const filename = safeName.toLowerCase().endsWith('.json') ? safeName : `${safeName}.json`
  const data = { algoritmo: 'multiplicacion-matrices', dimensiones: dimensions }
  const file = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(file)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 0)
}

export default function MatrixMultiplicationForm({ onSubmit }: Props) {
  const [dimensionsText, setDimensionsText] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const dimensions = parseDimensions(dimensionsText)
    if (!dimensionsText.trim() || !isValidDimensions(dimensions)) {
      alert('Ingresa entre 2 y 11 dimensiones enteras y positivas (para 1 a 10 matrices).')
      return
    }
    onSubmit(dimensions)
  }

  const handleSaveJson = () => {
    const dimensions = parseDimensions(dimensionsText)
    if (!dimensionsText.trim() || !isValidDimensions(dimensions)) {
      alert('Ingresa entre 2 y 11 dimensiones enteras y positivas antes de guardar.')
      return
    }
    createJsonDownload(dimensions)
  }

  const handleLoadJson = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const parsed: unknown = JSON.parse(await file.text())
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('El archivo no contiene un objeto JSON válido.')
      }
      if (!('algoritmo' in parsed) || parsed.algoritmo !== 'multiplicacion-matrices') {
        throw new Error('Este archivo no es un ejemplo de multiplicación de matrices.')
      }
      if (!('dimensiones' in parsed) || !Array.isArray(parsed.dimensiones)) {
        throw new Error('El JSON debe contener un arreglo "dimensiones".')
      }

      const dimensions = parsed.dimensiones
      if (
        dimensions.length < 2 ||
        dimensions.length > 11 ||
        !dimensions.every(
          (dimension) => typeof dimension === 'number' && Number.isSafeInteger(dimension) && dimension > 0,
        )
      ) {
        throw new Error('El arreglo debe tener entre 2 y 11 dimensiones enteras y positivas.')
      }

      setDimensionsText(dimensions.join(', '))
    } catch (error) {
      alert(error instanceof Error ? error.message : 'No se pudo leer el archivo JSON.')
    } finally {
      event.target.value = ''
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto my-6 w-full max-w-xl rounded-xl border border-slate-200 bg-white p-6 text-left shadow-sm dark:border-slate-700 dark:bg-slate-900"
    >
      <div className="mb-5">
        <label htmlFor="matrix-dimensions" className="mb-2 block font-semibold text-slate-700 dark:text-slate-200">
          Dimensiones de las matrices
        </label>
        <input
          id="matrix-dimensions"
          type="text"
          inputMode="numeric"
          placeholder="Ejemplo: 30, 35, 15, 5, 10"
          value={dimensionsText}
          onChange={(event) => setDimensionsText(event.target.value)}
          className={textInputClass}
        />
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Para dimensiones d1, d2, …, dₙ₊₁ se calculan n matrices: A₁(d₁×d₂), A₂(d₂×d₃), ….
        </p>
      </div>
      <button
        type="submit"
        className={primaryButtonClass}
      >
        Calcular parentización
      </button>
      <button
        type="button"
        onClick={handleSaveJson}
        className={`${secondaryButtonClass} ml-2.5`}
      >
        Guardar JSON
      </button>
      <div className="mt-5">
        <label htmlFor="matrix-json-file" className="mb-2 block font-semibold text-slate-700 dark:text-slate-200">
          Cargar archivo JSON
        </label>
        <input id="matrix-json-file" type="file" accept=".json,application/json" onChange={handleLoadJson} className={fileInputClass} />
      </div>
    </form>
  )
}
