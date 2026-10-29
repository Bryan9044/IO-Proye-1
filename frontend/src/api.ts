import type { BstResponse, MatrixMultiplicationResponse, SportsSeriesContract, SportsSeriesResponse } from './types';


export async function getBSTResponse(keys: string[], weights: number[]): Promise<BstResponse> {
    

    const res = await fetch('http://127.0.0.1:8000/arbolDeBusqueda', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keys, weights })
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail);
    }
    return res.json() as Promise<BstResponse>;
}

export async function getMatrixMultiplicationResponse(
    dimensions: number[],
): Promise<MatrixMultiplicationResponse> {
    const res = await fetch('http://127.0.0.1:8000/multiplicacionMatrices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ n: dimensions.length - 1, dimensiones: dimensions }),
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(typeof err.detail === 'string' ? err.detail : 'No se pudo calcular la multiplicación de matrices.');
    }

    return res.json() as Promise<MatrixMultiplicationResponse>;
}


export async function getSportsSeriesResponse(contract: SportsSeriesContract): Promise<SportsSeriesResponse> {
    let res: Response
    try {
        res = await fetch('http://127.0.0.1:8000/seriesDeportivas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contract),
        })
    } catch {
        throw new Error('No se pudo conectar con FastAPI. Verifique que el backend esté iniciado y que CORS esté habilitado.')
    }

    if (!res.ok) {
        let detail: unknown
        try { detail = (await res.json()).detail } catch { /* respuesta no JSON */ }
        const message = typeof detail === 'string' ? detail :
            Array.isArray(detail) ? detail.map((item: { msg?: string }) => item.msg ?? 'Dato inválido').join('; ') :
            `Error HTTP ${res.status} al calcular la serie.`
        throw new Error(message)
    }
    const data: SportsSeriesResponse = await res.json()
    if (!Array.isArray(data.matriz) || typeof data.probabilidadEquipoA !== 'number' || typeof data.probabilidadEquipoB !== 'number') {
        throw new Error('El backend devolvió una respuesta con formato inesperado.')
    }
    return data
}
