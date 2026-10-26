
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

