from fastapi import FastAPI, HTTPException
from replacement_team import contrato, llenarContextos, calcularG, formatearResultado
from optimal_bst import arbol_BST
from pydantic import BaseModel
from matrix_multiplication import multiplicacion_matrices


app = FastAPI() 

@app.get("/health")
def health():
    return {"status": "healthy"}


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
    weights: list[float]


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
    n: int
    dimensiones: list[int]

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