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