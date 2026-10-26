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