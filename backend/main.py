from typing import List,Literal
from pydantic import BaseModel
from fastapi import , HTTPException
from knapsack import mochila
app = FastAPI()

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

