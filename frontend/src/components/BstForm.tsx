import { useState, type FormEvent } from 'react'

type Props = {
  onSubmit: (keys: string[], weights: number[]) => void
}

const inputStyle = {
  boxSizing: 'border-box' as const,
  width: '100%',
  padding: '14px 16px',
  border: '1px solid #94a3b8',
  borderRadius: '10px',
  fontSize: '17px',
  outlineColor: '#7c3aed',
}

export default function BstForm({ onSubmit }: Props) {
  const [keysText, setKeysText] = useState('')
  const [weightsText, setWeightsText] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const keys = keysText.split(',').map((key) => key.trim())
    const weights = weightsText.split(',').map((weight) => Number(weight.trim()))
    onSubmit(keys, weights)
  }

  const handleSaveJson = () => {
    const keys = keysText.split(',').map((key) => key.trim())
    const weights = weightsText.split(',').map((weight) => Number(weight.trim()))

    if (
      !keysText.trim() ||
      keys.length < 1 ||
      keys.length > 10 ||
      keys.length !== weights.length ||
      keys.some((key) => !key) ||
      weights.some((weight) => !Number.isFinite(weight) || weight <= 0)
    ) {
      alert('Revisa que haya entre 1 y 10 llaves y que cada una tenga un peso positivo válido.')
      return
    }

    const chosenName = window.prompt('¿Qué nombre quieres para el archivo?', 'arbol-busqueda')
    if (chosenName === null) return

    const safeName = chosenName.trim().replace(/[<>:"/\\|?*\u0000-\u001F]/g, '-')
    if (!safeName) {
      alert('Escribe un nombre válido para el archivo.')
      return
    }
    const filename = safeName.toLowerCase().endsWith('.json') ? safeName : `${safeName}.json`

    const data = {
      algoritmo: 'abb-optimo',
      llaves: keys.map((llave, index) => ({ llave, peso: weights[index] })),
    }
    const file = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(file)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 0)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto my-6 w-full max-w-xl rounded-xl border border-slate-200 bg-white p-6 text-left shadow-sm dark:border-slate-700 dark:bg-slate-900"
      style={{
        width: '100%',
        maxWidth: '560px',
        margin: '24px auto',
        padding: '24px',
        boxSizing: 'border-box',
        border: '1px solid #cbd5e1',
        borderRadius: '12px',
        textAlign: 'left',
      }}
    >
      <div style={{ marginBottom: '18px' }}>
        <label htmlFor="bst-keys" className="mb-2 block font-semibold text-slate-700 dark:text-slate-200" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
          Llaves
        </label>
        <input
          id="bst-keys"
          type="text"
          placeholder="Ejemplo: ana, ben, carlos"
          value={keysText}
          onChange={(event) => setKeysText(event.target.value)}
          style={inputStyle}
        />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="bst-weights" className="mb-2 block font-semibold text-slate-700 dark:text-slate-200" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
          Pesos
        </label>
        <input
          id="bst-weights"
          type="text"
          inputMode="decimal"
          placeholder="Ejemplo: 0.4, 0.35, 0.25"
          value={weightsText}
          onChange={(event) => setWeightsText(event.target.value)}
          style={inputStyle}
        />
      </div>
      <button
        type="submit"
        className="rounded-lg bg-violet-700 px-5 py-3 font-semibold text-white transition hover:bg-violet-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
        style={{
          padding: '12px 22px',
          border: 0,
          borderRadius: '9px',
          backgroundColor: '#6d28d9',
          color: '#fff',
          fontSize: '16px',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Calcular árbol
      </button>
      <button
        type="button"
        onClick={handleSaveJson}
        style={{
          marginLeft: '10px',
          padding: '12px 22px',
          border: '1px solid #6d28d9',
          borderRadius: '9px',
          backgroundColor: '#fff',
          color: '#6d28d9',
          fontSize: '16px',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Guardar JSON
      </button>
      <div style={{ marginTop: '18px' }}>
        <label htmlFor="bst-json-file" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
          Cargar archivo JSON
        </label>
        <input
          id="bst-json-file"
          type="file"
          accept=".json,application/json"
          onChange={async (event) => {
            const file = event.target.files?.[0]
            if (!file) return

            try {
              const parsed: unknown = JSON.parse(await file.text())
              if (!parsed || typeof parsed !== 'object') {
                throw new Error('El archivo no contiene un objeto JSON válido.')
              }
              if (!('algoritmo' in parsed) || parsed.algoritmo !== 'abb-optimo') {
                throw new Error('Este archivo no es un ejemplo de árbol binario de búsqueda óptimo.')
              }
              if (!('llaves' in parsed) || !Array.isArray(parsed.llaves)) {
                throw new Error('El JSON debe contener un arreglo "llaves".')
              }

              const llaves = parsed.llaves as { llave?: unknown; peso?: unknown }[]
              const valido =
                llaves.length >= 1 &&
                llaves.length <= 10 &&
                llaves.every(
                  (item) =>
                    item &&
                    typeof item.llave === 'string' &&
                    item.llave.trim() !== '' &&
                    typeof item.peso === 'number' &&
                    Number.isFinite(item.peso) &&
                    item.peso > 0,
                )
              if (!valido) {
                throw new Error('Cada llave debe tener un nombre y un peso positivo válido (máximo 10 llaves).')
              }

              setKeysText(llaves.map((item) => item.llave as string).join(', '))
              setWeightsText(llaves.map((item) => String(item.peso)).join(', '))
            } catch (error) {
              alert(error instanceof Error ? error.message : 'No se pudo leer el archivo JSON.')
            } finally {
              event.target.value = ''
            }
          }}
        />
      </div>
    </form>
  )
}