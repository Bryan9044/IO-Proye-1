¿Cómo ejecutar el programa?
python -m uvicorn main:app --reload
Forma del contrato JSON

json
{
    "juegos": 7,
    "ph": 0.60,
    "pr": 0.45,
    "formato": [
        true,
        true,
        false,
        false,
        false,
        true,
        true
    ]
}
Forma de llamada POST
http://localhost:8000/seriesDeportivas -d {aqui va el contrato}

El programa debe responder con el cuerpo JSON que contiene la matriz de probabilidades, la probabilidad de que gane el Equipo A y la probabilidad de que gane el Equipo B, o sino un mensaje de error.
cómo ejecutar el programa?

python -m uvicorn main:app --reload

forma del contrato json
{
  "algoritmo": "reemplazo-equipos",
  "costoInicial": 15 000,
  "plazo": 7,
  "vidaUtil": 4,
  "periodos": [
    { "reventa": 11 000, "mantenimiento": 800 },
    { "reventa": 8500, "mantenimiento": 1300 },
    { "reventa": 6000, "mantenimiento": 2100 },
    { "reventa": 3500, "mantenimiento": 3000 }
  ]
}

forma de llamada
POST http://localhost:8000/reemplazoEquipos -d {aqui va el contrato}

el debe responder el cuerpo o sino un mensaje de error
