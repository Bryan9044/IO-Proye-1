


def multiplicacion_matrices(n,dimensiones: list[int]):
    if (n < 1 or n > 10):
        raise ValueError("Error: El número de matrices debe estar entre 1 a 10")

    if (len(dimensiones) != n+1):
        raise ValueError("Error: El tamaño de dimensiones solo puede ser n + 1")

    for elemento in dimensiones:
        if not isinstance(elemento, int) or elemento <= 0:
            raise ValueError("Error: Los numeros de las matrices deben ser enteros y positivos")
    

    rc = len(dimensiones) - 1
    tableM = [[0 for _ in range(rc)] for _ in range(rc)] 
    tableP = [["#" for _ in range(rc)] for _ in range(rc)]


    pares = creacionPares(dimensiones)
    res = rellenoPrincipales(pares)

    "Relleno de elementos principales para la tabla M"
    for p in range(len(res)):
        tableP[p][p+1] = p
        tableM[p][p+1] = res[p]  

    print("tableM:")
    for row in tableM:
        print(row)    
    elementosAprobar = diagonalSuperior(tableM)
    formulaMultiplicacionMatrices(elementosAprobar, tableM, dimensiones, tableP)
    print("tableM:")
    for row in tableM:
        print(row)

    print("tableP:")
    for row in tableP:
        print(row)

    res = parentizacion(tableP, 0, n - 1)
    costoMinimo = tableM[0][n-1]


    return tableM, tableP, res, costoMinimo


def creacionPares(elementos):
    pares = []
    for i in range(0,len(elementos) - 1, 1):
        l = (elementos[i], elementos[i+1])
        pares.append(l)    
    return pares

def rellenoPrincipales(pars):
    counter = len(pars) - 1
    resultados = []

    for x in range(0, len(pars), 1):
        if counter == 0:
            break
        else:
            number = pars[x][0] * pars[x][1] * pars[x+1][1]
            resultados.append(number)
            counter -=1
    return resultados

def diagonalSuperior(tabla):
    largo = len(tabla[0])
    elementos = []
    for d in range(2, largo):
        for i in range(largo - d):
            j = i + d
            posicionAbuscar = (i,j)
            elementos.append(posicionAbuscar)
    print("elementos", elementos)
    return elementos
            


def parentizacion(tableP, i, j):
    if i == j:
        return f"A{i}"
    else:
        k = tableP[i][j]
        izq = parentizacion(tableP, i, k)
        der = parentizacion(tableP, k + 1, j)
        return f"({izq} x {der})"


def formulaMultiplicacionMatrices(listaProbar, tableM, aList, tableP):
    for i, j in listaProbar:
        r = float('inf')
        kGuardado = i

        for k in range(i, j):
            elementoSumado = tableM[i][k] + tableM[k+1][j] + ( aList[i] * aList[j+1] * aList[k+1]) 
            if elementoSumado < r:
                r = elementoSumado
                kGuardado = k

        tableM[i][j] = r
        tableP[i][j] = kGuardado

    return 0

"FORMULA: min(M[I][K] +M[K+1][J] + (Di * DJ+1 * dk+1)"
"los K van desde I hasta j - 1"



if __name__ == "__main__": 
    dimensiones = [10, 30, 5, 60, 10, 20, 40, 15, 25, 35, 8]
    multiplicacion_matrices(10,dimensiones)


