
export interface TreeNode {
    key: string,
    left: TreeNode | null,
    right: TreeNode | null
}

export interface BstResponse {
    tableA: number[][];
    tableR: (number | "#")[][];
    arbol: TreeNode;
    costo: number;
    keysOrdenadas: string[];
}

export interface MatrixMultiplicationResponse {
    tableM: number[][];
    tableP: (number | "#")[][];
    parentizacion: string;
    costo: number;
}


export interface SportsSeriesContract {
    juegos: number;
    ph: number;
    pr: number;
    formato: boolean[];
}

export interface SportsSeriesResponse {
    matriz: number[][];
    probabilidadEquipoA: number;
    probabilidadEquipoB: number;
}
