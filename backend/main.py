
from fastapi import FastAPI, HTTPException
from replacement_team import contrato, llenarContextos, calcularG, formatearResultado
from optimal_bst import arbol_BST
from pydantic import BaseModel, StrictFloat, StrictInt
from matrix_multiplication import multiplicacion_matrices
from knapsack import mochila
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Literal, Union

# Importaciones del algoritmo de Series deportivas
from seriesDeportivas import (
    contrato as ContratoSeries,
    calcularCantidadPartidos,
    formatoSerie,
    crearMatriz,
    calcularProbabilidadGanador,
    formatearResultado as formatearSeries
)

app = FastAPI()

# El CORS permite peticiones desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "healthy"}


# ==========================================================
# ALGORITMO DE MOCHILA
# ==========================================================

class Objeto(BaseModel):
    nombre: str
    peso: int
    valor: int
    cantidad: int


class SolicitudMochila(BaseModel):
    algoritmo: Literal["mochila"]
    variante: Literal["0-1", "acotada", "no-acotada"]
    capacidad: int
    objetos: List[Objeto]


@app.get("/mochila")
def obtenerMochila(solicitud: SolicitudMochila):
    objetos = [o.model_dump() for o in solicitud.objetos]

    try:
        return mochila(
            solicitud.variante,
            solicitud.capacidad,
            objetos
        )
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))


# ==========================================================
# ALGORITMO DE REEMPLAZO DE EQUIPOS
# ==========================================================

@app.post("/reemplazoEquipos")
def postAlgoritmo(paramContrato: contrato):

    if paramContrato.plazo <= 0 or paramContrato.vidaUtil <= 0:
        raise HTTPException(
            status_code=400,
            detail="El plazo y la vida útil deben ser mayores que cero"
        )

    if len(paramContrato.periodos) != paramContrato.vidaUtil:
        raise HTTPException(
            status_code=400,
            detail="La cantidad de periodos debe coincidir con la vida útil"
        )

    paramCtx = llenarContextos(paramContrato)

    resultado = calcularG(paramContrato, paramCtx)

    return formatearResultado(resultado)


# ==========================================================
# ALGORITMO DE ARBOL DE BUSQUEDA OPTIMO
# ==========================================================

class ArbolRequest(BaseModel):
    keys: list[str]
    weights: list[Union[StrictInt, StrictFloat]]


@app.post("/arbolDeBusqueda")
def obtenerArbol(req: ArbolRequest):

    try:
        tableA, tableR, arbol, costo, keysOrdenadas = arbol_BST(
            len(req.keys),
            req.keys,
            req.weights
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return {
        "tableA": tableA,
        "tableR": tableR,
        "arbol": arbol,
        "costo": costo,
        "keysOrdenadas": keysOrdenadas
    }


# ==========================================================
# ALGORITMO DE MULTIPLICACION DE MATRICES
# ==========================================================

class MatrizRequest(BaseModel):
    n: StrictInt
    dimensiones: list[StrictInt]


@app.post("/multiplicacionMatrices")
def obtenerMatriz(req: MatrizRequest):

    try:
        tableM, tableP, parentizacion, costo = multiplicacion_matrices(
            req.n,
            req.dimensiones
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return {
        "tableM": tableM,
        "tableP": tableP,
        "parentizacion": parentizacion,
        "costo": costo
    }


# ==========================================================
# ALGORITMO DE SERIES DEPORTIVAS
# ==========================================================

@app.post("/seriesDeportivas")
def obtenerSeriesDeportivas(paramContrato: ContratoSeries):

    # Validar cantidad de juegos
    if paramContrato.juegos <= 0 or paramContrato.juegos % 2 == 0:
        raise HTTPException(
            status_code=400,
            detail="La cantidad de juegos debe ser positiva e impar"
        )

    # Validar el formato de la serie
    if len(paramContrato.formato) != paramContrato.juegos:
        raise HTTPException(
            status_code=400,
            detail="La cantidad de posiciones del formato debe coincidir con los juegos"
        )

    # Validar probabilidades
    if not (0 <= paramContrato.ph <= 1 and 0 <= paramContrato.pr <= 1):
        raise HTTPException(
            status_code=400,
            detail="Las probabilidades deben estar entre 0 y 1"
        )

    # Calcular cantidad de victorias necesarias
    cantidadPartidos = calcularCantidadPartidos(paramContrato.juegos)

    # Calcular probabilidades complementarias
    qh, qr = formatoSerie(paramContrato)

    # Crear matriz de probabilidades
    matriz = crearMatriz(
        cantidadPartidos,
        paramContrato.formato,
        paramContrato.ph,
        paramContrato.pr,
        qh,
        qr
    )

    # Calcular probabilidades de ambos equipos
    probabilidadEquipoA, probabilidadEquipoB = calcularProbabilidadGanador(
        matriz
    )

    # Devolver matriz y probabilidades en JSON
    return formatearSeries(
        matriz,
        probabilidadEquipoA,
        probabilidadEquipoB
    )
