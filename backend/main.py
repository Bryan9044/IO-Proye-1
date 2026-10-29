from fastapi import FastAPI, HTTPException
from replacement_team import contrato, llenarContextos, calcularG, formatearResultado
from optimal_bst import arbol_BST
from pydantic import BaseModel, StrictFloat, StrictInt
from matrix_multiplication import multiplicacion_matrices
from knapsack import mochila
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Literal, Union

app = FastAPI() 

#El cors es para que no haya problemas al hacer peticiones desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "healthy"}

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
def mochila(solicitud: SolicitudMochila):
    objetos = [o.model_dump() for o in solicitud.objetos] #Objetos se vuelve en una lista por expresion y convierte la clase objeto en diccionarios con model_dump de pydantic.
    try:
        return mochila(solicitud.variante,solicitud.capacidad,objetos)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))


#mi funcion de post para devolver todo el reemplazo de equipos
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


class ArbolRequest(BaseModel):
    keys: list[str]
    weights: list[Union[StrictInt, StrictFloat]]


@app.post("/arbolDeBusqueda")
def obtenerArbol(req: ArbolRequest):
    try:
        tableA, tableR, arbol, costo, keysOrdenadas = arbol_BST(len(req.keys), req.keys, req.weights)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return {
        "tableA": tableA,
        "tableR": tableR,
        "arbol": arbol,
        "costo": costo,
        "keysOrdenadas": keysOrdenadas
    }


class MatrizRequest(BaseModel):
    n: StrictInt
    dimensiones: list[StrictInt]

@app.post("/multiplicacionMatrices")
def obtenerMatriz(req: MatrizRequest):
    try:
        tableM, tableP, parentizacion, costo = multiplicacion_matrices(req.n, req.dimensiones)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return {
        "tableM": tableM,
        "tableP": tableP,
        "parentizacion": parentizacion,
        "costo": costo,
    }