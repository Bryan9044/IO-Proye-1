import type { BstResponse, MatrixMultiplicationResponse } from './types';


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
