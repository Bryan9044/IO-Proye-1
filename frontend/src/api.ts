import type { BstResponse } from './types';


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