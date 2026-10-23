import json

def mochila(variante,capacidad,objetos):
    if capacidad > 20 or capacidad < 1:
        raise ValueError("Error: La capacidad de la mochila debe estar entre 1 y 20")
    for objeto in objetos:
        if objeto["peso"] <= 0:
            raise ValueError("Error: El peso debe ser mayor a 0")

    if variante == "0-1":
        return mochila01(variante, capacidad, objetos)
    elif variante == "acotada":
        for objeto in objetos:
            if objeto["cantidad"] > 10 or objeto["cantidad"] < 0:
                raise ValueError("Error: La cantidad de objetos debe ser positiva y menor o igual a 10")
        return mochilaAcotada(variante, capacidad, objetos)
    elif variante == "no-acotada":
        return mochilaNAcotada(variante, capacidad, objetos)
    else:
        raise ValueError("Error: Variante desconocida")


"""
Formato de resultado
{
    "variante": variante,
    "resultado": alto,
    "tabla": []
    "solucion": []
}
"""

def mochila01(variante, capacidad, objetos):
    n = len(objetos)
    tabla = [[0] * (capacidad + 1) for _ in range(n+1)] # Rellenar de ceros
    tablaSolucion = [[0] * (capacidad + 1) for _ in range(n+1)] # Para guardar cuando se usa un objeto

    for i in range(1, n+1):
        objeto = objetos[i-1]
        peso = objeto["peso"]
        valor = objeto["valor"]
        limite = 1
        for j in range(capacidad + 1):
            tabla[i][j] = tabla[i-1][j]
            if peso <= j: # Si no entra aqui ya tiene asignado el valor de la columna anterior
                if tabla[i][j] < valor + tabla[i-1][j-peso]:
                    tabla[i][j] = valor + tabla[i-1][j-peso]
                    tablaSolucion[i][j] = 1 #Si se usa, se marca en la tabla de solucion

    solucion = []
    j = capacidad
    for i in range(n, 0, -1):
        objeto = objetos[i-1]
        if tablaSolucion[i][j] == 1:
            solucion.append(objeto["nombre"])
            j -= objeto["peso"]

    solucion.reverse()

    return {
            "variante": variante,
            "resultado": tabla[n][capacidad],
            "tabla": tabla,
            "solucion": solucion,
    }

def mochilaAcotada(variante,capacidad,objetos):
    n = len(objetos)
    tabla = [[0] * (capacidad + 1) for _ in range(n+1)] # Rellenar de ceros
    tablaSolucion = [[0] * (capacidad + 1) for _ in range(n+1)] # Esta vez se guarda la cantidad del objeto en vez de un flag 1

    for i in range(1, n+1):
        objeto = objetos[i - 1]
        peso = objeto["peso"]
        valor = objeto["valor"]
        limite = objeto["cantidad"]
        for j in range(capacidad + 1):
            mejor = tabla[i-1][j]
            mejorC = 0
            c = 1

            while c <= limite and c * peso <=j:
                candidato = c * valor + tabla[i - 1][j - c * peso]
                if candidato > mejor:
                    mejor = candidato
                    mejorC = c
                c += 1
            tabla[i][j] = mejor
            tablaSolucion[i][j] = mejorC

    solucion = []
    j = capacidad
    for i in range(n, 0, -1):
        objeto = objetos[i - 1]
        if tablaSolucion[i][j] > 0:
            solucion.append([objeto["nombre"], tablaSolucion[i][j]])
            j -= tablaSolucion[i][j] * objeto["peso"]

    solucion.reverse()

    return {
            "variante": variante,
            "resultado": tabla[n][capacidad],
            "tabla": tabla,
            "solucion": solucion,
    }

def mochilaNAcotada(variante,capacidad,objetos):
    n = len(objetos)
    tabla = [[0] * (capacidad + 1) for _ in range(n+1)] # Rellenar de ceros
    tablaSolucion = [[0] * (capacidad + 1) for _ in range(n+1)] # Esta vez se guarda la cantidad del objeto en vez de un flag 1

    for i in range(1, n+1):
        objeto = objetos[i - 1]
        peso = objeto["peso"]
        valor = objeto["valor"]
        for j in range(capacidad + 1):
            tabla[i][j] = tabla[i-1][j]
            if peso <=j:
                if valor + tabla[i][j-peso] > tabla[i][j]:
                    tabla[i][j] = valor + tabla[i][j-peso]
                    tablaSolucion[i][j] = 1

    solucion = []
    j = capacidad
    for i in range(n, 0, -1):
        objeto = objetos[i - 1]
        c = 0
        while tablaSolucion[i][j] == 1:
            c += 1
            j -= objeto["peso"]
        if c > 0:
            solucion.append([objeto["nombre"], c])

    solucion.reverse()

    return {
            "variante": variante,
            "resultado": tabla[n][capacidad],
            "tabla": tabla,
            "solucion": solucion,
    }

if __name__ == "__main__":
    objetos = [
            {"nombre": "Anillo", "peso": 1, "valor": 15, "cantidad": 3},
            {"nombre": "Poster", "peso": 4, "valor": 5, "cantidad": 2},
            {"nombre": "Radio", "peso": 3, "valor": 9, "cantidad": 1},
            {"nombre": "Candelero", "peso": 5, "valor": 10, "cantidad": 1},
        ]
    for variante in ("0-1", "acotada", "no-acotada"):
        resultado = mochila(variante, 8, objetos)
        print(json.dumps({k: v for k, v in resultado.items() if k != "tabla"}, ensure_ascii=False,))


