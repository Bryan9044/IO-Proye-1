
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import math

app = FastAPI()


@app.get("/health")
def health():
    return {"status": "healthy"}


# Entrada (lo que recibe mi contrato)
class contrato(BaseModel):
    juegos: int
    ph: float
    pr: float
    formato: list[bool]


# Funcion para calcular la cantidad de victorias necesarias
def calcularCantidadPartidos(paramJuegos):
    return math.ceil(paramJuegos / 2)


# Funcion para definir probabilidades
def formatoSerie(paramContrato):
    qh = 1 - paramContrato.ph
    qr = 1 - paramContrato.pr

    return qh, qr


# Funcion para crear y llenar la matriz
def crearMatriz(cantidadPartidos, paramFormato, ph, pr, qh, qr):
    matriz = []

    # Se agrega una posicion para incluir las victorias necesarias
    tamano = cantidadPartidos + 1

    # Llena toda la matriz de 0s
    for i in range(tamano):
        fila = []
        for j in range(tamano):
            fila.append(0.0000)
        matriz.append(fila)

    # Llena la fila 0 de 1s, excepto la columna 0
    for j in range(1, tamano):
        matriz[0][j] = 1.0000

    # La columna 0 queda completamente llena de 0s

    # Calcula las probabilidades desde (1,1)
    for i in range(1, tamano):
        for j in range(1, tamano):

            r1 = cantidadPartidos - i
            r2 = cantidadPartidos - j
            rt = r1 + r2

            posicion = paramFormato[rt]

            if posicion == True:
                matriz[i][j] = (
                    ph * matriz[i-1][j] +
                    qh * matriz[i][j-1]
                )
            else:
                matriz[i][j] = (
                    pr * matriz[i-1][j] +
                    qr * matriz[i][j-1]
                )

    return matriz


# Funcion para calcular la probabilidad de ganar la serie
def calcularProbabilidadGanador(paramMatriz):

    # Obtiene la ultima posicion de la matriz
    ultimaPosicion = len(paramMatriz) - 1

    # Probabilidad de que gane el Equipo A
    probabilidadEquipoA = paramMatriz[ultimaPosicion][ultimaPosicion]

    # Probabilidad de que gane el Equipo B
    probabilidadEquipoB = 1 - probabilidadEquipoA

    return probabilidadEquipoA, probabilidadEquipoB


########################################################################


# Funcion para formatear la respuesta JSON
def formatearResultado(paramMatriz, probabilidadEquipoA, probabilidadEquipoB):

    salida = {
        "matriz": [],
        "probabilidadEquipoA": round(probabilidadEquipoA, 4),
        "probabilidadEquipoB": round(probabilidadEquipoB, 4)
    }

    # Redondea los valores de la matriz a 4 decimales
    for fila in paramMatriz:
        nuevaFila = []

        for valor in fila:
            nuevaFila.append(round(valor, 4))

        salida["matriz"].append(nuevaFila)

    return salida


# Funcion POST para recibir el contrato y devolver los resultados
@app.post("/seriesDeportivas")
def postAlgoritmo(paramContrato: contrato):

    # Validar cantidad de juegos
    if paramContrato.juegos <= 0 or paramContrato.juegos % 2 == 0:
        raise HTTPException(
            status_code=400,
            detail="La cantidad de juegos debe ser positiva e impar"
        )

    # Validar la cantidad de posiciones del formato
    if len(paramContrato.formato) != paramContrato.juegos:
        raise HTTPException(
            status_code=400,
            detail="La cantidad de posiciones del formato debe coincidir con los juegos"
        )

    # Validar las probabilidades
    if not (0 <= paramContrato.ph <= 1 and 0 <= paramContrato.pr <= 1):
        raise HTTPException(
            status_code=400,
            detail="Las probabilidades deben estar entre 0 y 1"
        )

    # Calcula la cantidad de victorias necesarias
    cantidadPartidos = calcularCantidadPartidos(paramContrato.juegos)

    # Calcula las probabilidades complementarias
    qh, qr = formatoSerie(paramContrato)

    # Crea la matriz con los datos del contrato
    matriz = crearMatriz(
        cantidadPartidos,
        paramContrato.formato,
        paramContrato.ph,
        paramContrato.pr,
        qh,
        qr
    )

    # Calcula las probabilidades de ambos equipos
    probabilidadEquipoA, probabilidadEquipoB = calcularProbabilidadGanador(matriz)

    # Devuelve los resultados en formato JSON
    return formatearResultado(
        matriz,
        probabilidadEquipoA,
        probabilidadEquipoB
    )
