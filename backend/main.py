from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI() 

@app.get("/health")
def health():
    return {"status": "healthy"}

# se necesitaran la siguiente cantidad de objetos {contrato, periodo, contexto, alternativa, resultadoG}

class Periodo(BaseModel):
    reventa: int
    mantenimiento: int


class contrato(BaseModel):
    costoInicial: int
    plazo: int
    vidaUtil: int
    periodos: list[Periodo]

class contexto:
    def __init__(self, costoInicial, mantenimientos, reventa):
        self.costoInicial = costoInicial 
        self.mantenimientos = mantenimientos
        self.reventa = reventa
        self.resultado = self.calcular()

    def calcular(self):
      return self.costoInicial + sum(self.mantenimientos) - self.reventa

    
class alternativa:
    def __init__(self, desde, hasta, anosUso, costoReemplazo, costoFuturo):
        self.desde = desde
        self.hasta = hasta
        self.anosUso = anosUso
        self.costoReemplazo = costoReemplazo
        self.costoFuturo = costoFuturo
        self.total = costoReemplazo + costoFuturo


class resultadoG:
    def __init__(self, periodo, alternativa, minimo, destinosOptimos):
        self.periodo = periodo
        self.alternativa = alternativa
        self.minimo = minimo
        self.destinosOptimos = destinosOptimos

# funcion que crea los contextos
def llenarContextos(paramContrato):
    resultado = {}
    mantenimientos = []

    for i, periodo in enumerate(paramContrato.periodos, start=1):
        mantenimientos.append(periodo.mantenimiento)

        ctx = contexto(
            paramContrato.costoInicial,
            mantenimientos.copy(),
            periodo.reventa
        )

        resultado[i] = ctx

    return resultado

#for para encontrar el minimo
# funcion para encontrar el mínimo de los totales
def encontrarMinimo(paramAlternativas):
    minimo = float("inf")

    for alter in paramAlternativas:
        if alter.total <= minimo:
            minimo = alter.total

    return minimo

# funcion para calcular el reemplazo de equipos
def calcularG(paramContrato, paramContextos): 
    #diccionario vacio
    resultadosG = {}

    plazoMaximo = paramContrato.plazo 
    vidaUtil = paramContrato.vidaUtil

    #caso base
    resultadosG[f"G({plazoMaximo})"]= resultadoG(
        periodo = plazoMaximo,
        alternativa = [],
        minimo = 0,
        destinosOptimos = []

    )
    #for1
    # Recorrer hacia atras
    # para t desde plazoMaximo -1 hasta 0
    for t in range(plazoMaximo - 1, -1, -1):
        alternativas = []

        maximoAnos = min(
            vidaUtil,
            plazoMaximo - t
        )
        #for2
        #hasta que años de uso sea el max de anos
        for anosUso in range(1, maximoAnos +1, 1):
            destino = t +  anosUso

            costoReemplazo = paramContextos[anosUso].resultado

            costoFuturo = resultadosG[f"G({destino})"].minimo

            total = costoReemplazo + costoFuturo

            paramAlternativa = alternativa(
                desde = t,
                hasta = destino,
                anosUso = anosUso,
                costoReemplazo = costoReemplazo,
                costoFuturo = costoFuturo
                # total no porque ya se calcula solo
            )
            alternativas.append(paramAlternativa)
            #fin for2


        # llamar a funcion para encontrar el minimo
        minimoEncontrado = encontrarMinimo(alternativas)

        destinosOptimos = []

        #for3 guarda la alternativa menor en destinosOptimos
        for alter in alternativas:
            if alter.total == minimoEncontrado:
                destinosOptimos.append(
                    alter.hasta
                )
        #fin del for3


        #guardo en el diccionario
        resultadosG[f"G({t})"] = resultadoG(
            periodo = t,
            alternativa = alternativas,
            minimo = minimoEncontrado,
            destinosOptimos = destinosOptimos
        )
    #fin del for1

    return resultadosG


# Encuentra todas las rutas óptimas desde G(0) hasta el plazo final
def encontrarRutasOptimas(resultadosG):
    rutas = []
    plazoMaximo = max(resultado.periodo for resultado in resultadosG.values())

    def recorrer(periodoActual, rutaActual):
        # Si llegamos al último periodo, guardamos la ruta
        if periodoActual == plazoMaximo:
            rutas.append(rutaActual.copy())
            return

        # Obtener los destinos óptimos del periodo actual
        destinos = resultadosG[f"G({periodoActual})"].destinosOptimos

        for destino in destinos:
            rutaActual.append(destino)
            recorrer(destino, rutaActual)
            rutaActual.pop()

    recorrer(0, [0])

    return rutas

# funcion para formatear la respuesta json
#recibe todos los g y me devuelve mi archivo json
def formatearResultado(resultadosG):
    salida = {
        "costoMinimo": resultadosG["G(0)"].minimo,
        "rutasOptimas": encontrarRutasOptimas(resultadosG),
        "periodos": []
    }

    for clave, resultado in resultadosG.items():

        alternativas = []

        for alter in resultado.alternativa:
            alternativas.append({
                "desde": alter.desde,
                "hasta": alter.hasta,
                "anosUso": alter.anosUso,
                "costoReemplazo": alter.costoReemplazo,
                "costoFuturo": alter.costoFuturo,
                "total": alter.total,
                "esOptima": alter.total == resultado.minimo
            })

        salida["periodos"].append({
            "periodo": resultado.periodo,
            "funcion": clave,
            "alternativas": alternativas,
            "costoMinimo": resultado.minimo,
            "destinosOptimos": resultado.destinosOptimos
        })

    return salida

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