from fastapi import FastAPI
app = FastAPI()

@app.get("/health")
def health():
    return {"status": "healthy"}

# se necesitaran la siguiente cantidad de objetos {contrato, contexto, alternativa, resultadoG}

class contrato:
    def __init__(self, costoInicial, plazo, vidaUtil, periodos):
        self.costoInicial = costoInicial
        self.plazo = plazo
        self.vidaUtil = vidaUtil
        self.periodos = periodos


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