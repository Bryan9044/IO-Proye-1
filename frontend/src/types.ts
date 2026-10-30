
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

export interface EquipmentPeriod { reventa: number; mantenimiento: number }
export interface EquipmentReplacementContract {
    algoritmo: 'reemplazo-equipos'; costoInicial: number; plazo: number; vidaUtil: number; periodos: EquipmentPeriod[]
}
export interface EquipmentAlternative {
    desde: number; hasta: number; anosUso: number; costoReemplazo: number; costoFuturo: number; total: number; esOptima: boolean
}
export interface EquipmentResultPeriod {
    periodo: number; funcion: string; alternativas: EquipmentAlternative[]; costoMinimo: number; destinosOptimos?: number[]
}
export interface EquipmentReplacementResponse {
    costoMinimo: number; rutasOptimas?: unknown[]; periodos: EquipmentResultPeriod[]
}
