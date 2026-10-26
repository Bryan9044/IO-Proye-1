import json

def arbol_BST(n,keys: list[str], weight: list[float]):
    if (n < 1 or n > 10):
        raise ValueError("Error: El número de llaves debe estar entre 1 a 10")
    if (len(keys) != n):
        raise ValueError("Error: El tamaño de keys solo puede ser n")

    if (len(weight) != n):
        raise ValueError("Error: El tamaño de weight solo puede ser n")

    for elemento in keys:
        if not isinstance(elemento, str):
            raise ValueError("Error: Las llaves deben ser cadenas de texto")
        if(elemento == "" or elemento.strip() == ""):
            raise ValueError("Error: Las llaves no pueden ser cadenas vacías")
    
    counter = 0
    for elemento in weight:
        if not isinstance(elemento, (int, float)) or elemento <= 0:
            raise ValueError("Error: Los pesos deben ser números positivos")
        counter += elemento


    if len(set(keys)) != len(keys):
        raise ValueError("Error: Las llaves deben ser únicas")

    weight = [w / counter for w in weight]

    "Parte de arriba va con n+1 empezando por 0 hasta n"
    "Parte de abajo va con n empezando por 1 hasta n+1"
    tableA = [[0 for _ in range(n + 1)] for _ in range(n+1)] 

    print("tableA:")
    mostrarMatriz(tableA)
    tableR = [["#" for _ in range(n+1)] for _ in range(n+1)]
    
    "Acomodamos las llaves en orden alfabético"    
    pares_ordenados = sorted(zip(keys, weight), key=lambda par: par[0].lower())
    keys = [llave for llave, peso in pares_ordenados]
    weight = [peso for llave, peso in pares_ordenados]


    relleno(weight, tableA, tableR)
    mostrarMatriz(tableA)

    elementosAprobar = diagonalSuperior(tableA)

    formulaArboles(elementosAprobar, tableA, weight, tableR)
    arbol = construccionArbol(keys, tableR)
    print("arbol", arbol)
    print(json.dumps(arbol, indent=2, ensure_ascii=False))
    return tableA, tableR, arbol, tableA[0][n], keys



def mostrarMatriz(tableA):
    for row in tableA:
        print(row)


def relleno(pesos, tableA, tablaP):
    k = 0
    for i in range(0, len(tableA), 1):
        tableA[i][i+1] = pesos[k]
        tablaP[i][i+1] = k + 1
        if(k == len(pesos) - 1):
            break
        k += 1
    return tableA


def diagonalSuperior(tabla):
    largo = len(tabla[0])
    elementos = []
    for d in range(2, largo):
        for i in range(largo - d):
            j = i + d
            posicionAbuscar = (i,j)
            elementos.append(posicionAbuscar)
    return elementos



def construccionArbol(keys, tableR,i=0, j=None):
    if j is None:
        j = len(keys)

    if i >= j:
        return None

    indiceR = tableR[i][j] - 1

    return {
        "key": keys[indiceR],
        "left": construccionArbol(keys, tableR, i, indiceR),
        "right": construccionArbol(keys, tableR, indiceR + 1, j),
    }


def formulaArboles(listaProbar, tableA, aList, tableR):
    for i, j in listaProbar:
        r = float('inf')
        kGuardado = i
        val = sum(aList[i:j])
        for k in range(i, j):
            elementoSumado = tableA[i][k] + tableA[k+1][j] +  val
            if elementoSumado < r:
                r = elementoSumado
                kGuardado = k

        tableA[i][j] = r
        tableR[i][j] = kGuardado + 1 
    mostrarMatriz(tableA)
    mostrarMatriz(tableR)
"FORMULA: min(A[I][K] + A[K+1][J] + val = (i:j)"

if __name__ == "__main__":
    keys = ["a", "b", "c"]
    weights = [10, 1, 1]
    arbol_BST(3,keys,weights)