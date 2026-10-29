# IO-Proye-1

Aplicación web académica con algoritmos de Investigación de Operaciones realizados por estudiantes del Tecnológico de Costa Rica a partir de algoritmos dinamicos vistos en clase.

## Integrantes

- **Estefani Valverde Marín** — carné: 
- **Owen Torres Porras** — carné: 
- **Bryan Londoño Marchena** — carné: 2022233102

## Requisitos

- [Git](https://git-scm.com/)
- [Node.js 22 o superior](https://nodejs.org/)
- [Python 3.12 o superior](https://www.python.org/)
- Un navegador moderno, como Chrome, Firefox o Edge
- Un editor de código, por ejemplo Visual Studio Code
- Acceso al repositorio: [github.com/Bryan9044/IO-Proye-1](https://github.com/Bryan9044/IO-Proye-1)

## Instalación

### 1. Clonar el repositorio

Desde una terminal, ejecute:

```bash
git clone https://github.com/Bryan9044/IO-Proye-1.git
cd IO-Proye-1
```

Abra la carpeta `IO-Proye-1` en tu editor de código de preferencia.

### 2. Configurar el backend

Desde la carpeta raíz del proyecto, crea el entorno virtual de Python e instala las dependencias:

```bash
python3 -m venv backend/.venv
backend/.venv/bin/python -m pip install --upgrade pip
backend/.venv/bin/python -m pip install -r backend/requirements.txt
```

### 3. Configurar el frontend

```bash
cd frontend
npm install
```

Opcionalmente, puedes comprobar que el frontend compile:

```bash
npm run build
```

## Ejecutar la aplicación

Desde la carpeta `frontend`, ejecuta:

```bash
npm run dev
```

Este comando inicia el frontend y el backend. Siempre debe tener la terminal abiera mientras utiliza la app.

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Estado del backend:** [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)
- **Documentación interactiva de la API:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)


## Ejecutar las pruebas del frontend

Desde la carpeta `frontend`, ejecute:

```bash
npm test
```

Las pruebas verifican que:

- El formulario del BST rechace un peso no numérico y no envíe los datos.
- El formulario del BST rechace una cantidad de pesos distinta a la cantidad de llaves.
- El formulario de multiplicación de matrices rechace una dimensión no válida.
- El formulario de matrices solicite `n + 1` dimensiones para `n` matrices.



## Uso de inteligencia artificial

**Bryan Londoño Marchena:** utilice ChatGPT como apoyo para implementar la parte visual del frontend de los algoritmos 3 y 4, preparar las pruebas ejecutadas mediante GitHub Actions, revisar las validaciones de esos algoritmos y generar ejemplos de entrada válidos e inválidos.
