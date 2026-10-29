import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Navbar, { type ElementoNavbar } from '../components/Navbar'
import Card from '../components/Card'

import OptimalBstPage from './OptimalBstPage'
import SportsSeriesPage from './SportsSeriesPage'
import EquipmentReplacementPage from './EquipmentReplacementPage'
import MatrixMultiplicationPage from './MatrixMultiplicationPage'

/* ==========================================================================
 *   Configuración de navegación
 *   ========================================================================== */

/** Elementos del navbar: [nombre, ruta] */
const elementos: ElementoNavbar[] = [
    ['Inicio', '/'],
['Equipos', '/equipos'],
['Series', '/series'],
['BST', '/bst'],
['Matrices', '/matrices'],
['Mochila', '/mochila'],
]

/** Datos de cada sección, indexados por ruta. `fuente` activa el tooltip de la carta. */
interface DatosSeccion {
    descripcion: string
    fuente?: string
    fuenteUrl?: string
}

const secciones: Record<string, DatosSeccion> = {
    '/equipos': {
        descripcion: 'Calcule el costo mínimo y las rutas óptimas para reemplazar equipos.',
        fuente: 'x',
    },
    '/series': {
        descripcion: 'Calcule las probabilidades de ganar una serie deportiva y visualice la matriz de resultados.',
    },
    '/bst': {
        descripcion: 'Busqueda binaria óptima, la cual le permitirá ver el costo mínimo de búsqueda y la estructura del árbol resultante, todo esto aplicando programación dinámica',
        fuente: 'x',
    },
    '/matrices': {
        descripcion: ' Realice una multiplicacion de matrices, la cual le permitira ver el costo minimo de la multiplicación ademas de la parentización optima, todo esto aplicando programación dinamica',
        fuente: 'x',
    },
    '/mochila': {
        descripcion: 'Aqui va el resto.',
        fuente: 'x',
    },
}

/*   ==========================================================================
 *   Páginas
 *   ========================================================================== */

function Inicio() {
    const navigate = useNavigate()
    const rutasConCarta = elementos.filter(([, ruta]) => ruta !== '/')

    return (
        <>
        <section className="mp-hero">

        <h1 className="mp-hero__title">
        <span className="mp-gradient-text">Algoritmos Dinamicos.</span>
        </h1>


        </section>

        <section className="mp-grid" aria-label="Secciones">
        {rutasConCarta.map(([nombre, ruta], i) => {
            const datos = secciones[ruta]

            return (
                <div
                key={ruta}
                className="mp-grid__item"
                style={{ animationDelay: `${120 + i * 90}ms` }}
                >
                <Card
                title={nombre}
                description={datos?.descripcion ?? ''}
                icon={nombre.charAt(0)}
                badge="Herramienta"
                fuente={datos?.fuente}
                fuenteUrl={datos?.fuenteUrl}
                actionLabel="Ir →"
                onAction={() => navigate(ruta)}
                />
                </div>
            )
        })}
        </section>
        </>
    )
}

interface PaginaSimpleProps {
    titulo: string
    texto: string
    fuente?: string
    fuenteUrl?: string
}
/*Esto es por mientras hay una pagina*/
function PaginaSimple({ titulo, texto, fuente, fuenteUrl }: PaginaSimpleProps) {
    const navigate = useNavigate()

    return (
        <>
        <section className="mp-hero mp-hero--compact">

        <h1 className="mp-hero__title">
        <span className="mp-gradient-text">{titulo}</span>
        </h1>
        </section>

        <section className="mp-grid mp-grid--single">
        <div className="mp-grid__item" style={{ animationDelay: '120ms' }}>
        <Card
        title={titulo}
        description={texto}
        icon={titulo.charAt(0)}
        meta="Página"
        fuente={fuente}
        fuenteUrl={fuenteUrl}
        actionLabel="← Volver al inicio"
        onAction={() => navigate('/')}
        />
        </div>
        </section>
        </>
    )
}

const Equipos = () => <EquipmentReplacementPage />

const Series = () => <SportsSeriesPage />

const BST = () => (
    <OptimalBstPage />
)

const Matrices = () => (
    <MatrixMultiplicationPage />
)

const Mochila = () => (
    <PaginaSimple
    titulo="Problema de la Mochila"
    texto="Aquí va el contenido de la página de contacto."
    fuente={secciones['/mochila'].fuente}
    fuenteUrl={secciones['/mochila'].fuenteUrl}
    />
)

const NoEncontrada = () => (
    <PaginaSimple titulo="404" texto="La página que buscas no existe." />
)

/* ==========================================================================
 *   Estructura general
 *   ========================================================================== */

function Contenido() {
    const { pathname } = useLocation()

    return (
        <div className="mp-layout">
        <style>{mainPageStyles}</style>

        {/* Fondo decorativo */}
        <div className="mp-bg" aria-hidden="true">
        <span className="mp-orb mp-orb--a" />
        <span className="mp-orb mp-orb--b" />
        <span className="mp-orb mp-orb--c" />
        </div>

        <Navbar elementos={elementos} />

        {/* key = pathname → la animación de entrada se repite en cada cambio de página */}
        <main className="mp-main" key={pathname}>
        <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/equipos" element={<Equipos />} />
        <Route path="/series" element={<Series />} />
        <Route path="/bst" element={<BST />} />
        <Route path="/matrices" element={<Matrices />} />
        <Route path="/mochila" element={<Mochila />} />
        <Route path="*" element={<NoEncontrada />} />
        </Routes>
        </main>

        <footer className="mp-footer">
        </footer>
        </div>
    )
}

export default function MainPage() {
    return (
        <BrowserRouter>
        <Contenido />
        </BrowserRouter>
    )
}

/* ==========================================================================
 *   Estilos
 *   ========================================================================== */

const mainPageStyles = `
/* ---------- Layout ---------- */
.mp-layout {
    --color-ink: #17231f;
    --color-ink-secondary: #68766f;
    --color-ink-tertiary: #87938c;
    --mp-green: #176b52;
    --ease-out: cubic-bezier(.2, .7, .2, 1);

    position: relative;
    isolation: isolate;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    background: #f7f8f4;
    color: var(--color-ink);
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    -webkit-font-smoothing: antialiased;
}

.mp-layout > nav {
    position: relative;
    z-index: 20;
}

.mp-main {
    position: relative;
    z-index: 1;
    flex: 1;
    width: 100%;
    max-width: 1160px;
    box-sizing: border-box;
    margin: 0 auto;
    padding: clamp(3rem, 7vw, 5.5rem) 2rem 4.5rem;
    animation: mp-fade-up 600ms var(--ease-out) both;
}

/* ---------- Fondo ---------- */
.mp-bg {
    position: fixed;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    overflow: hidden;
}

.mp-bg::after {
    content: "";
    position: absolute;
    inset: 0;
    background-image:
    linear-gradient(rgba(27, 73, 55, .035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(27, 73, 55, .035) 1px, transparent 1px);
    background-size: 44px 44px;
    -webkit-mask-image: linear-gradient(to bottom, black, transparent 78%);
    mask-image: linear-gradient(to bottom, black, transparent 78%);
}

.mp-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(85px);
    opacity: .48;
    animation: mp-float 18s ease-in-out infinite;
}

.mp-orb--a {
    width: 440px;
    height: 440px;
    top: -170px;
    left: -130px;
    background: #b8dfc8;
}

.mp-orb--b {
    width: 380px;
    height: 380px;
    top: 25%;
    right: -170px;
    background: #f0dfbd;
    animation-delay: -6s;
}

.mp-orb--c {
    width: 430px;
    height: 430px;
    bottom: -220px;
    left: 22%;
    background: #c9e7dd;
    animation-delay: -12s;
}

/* ---------- Hero ---------- */
.mp-hero {
    text-align: center;
    max-width: 790px;
    margin: 0 auto 4.5rem;
}

.mp-hero--compact {
    margin-bottom: 2.7rem;
}

.mp-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: .55rem;
    min-height: 30px;
    padding: 0 .95rem;
    color: #356653;
    background: rgba(255, 255, 255, .72);
    border: 1px solid rgba(23, 107, 82, .15);
    border-radius: 999px;
    font-size: .72rem;
    font-weight: 750;
    letter-spacing: .1em;
    text-transform: uppercase;
    box-shadow: 0 5px 20px rgba(26, 62, 47, .04);
    -webkit-backdrop-filter: blur(12px);
    backdrop-filter: blur(12px);
}

.mp-eyebrow::before {
    content: "";
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #45a77d;
    box-shadow: 0 0 0 4px rgba(69, 167, 125, .13);
}

.mp-hero__title {
    margin: 1.4rem 0 0;
    font-size: clamp(2.7rem, 6vw, 4.7rem);
    line-height: 1.04;
    font-weight: 780;
    letter-spacing: -.065em;
}

.mp-gradient-text {
    color: var(--mp-green);
    background: linear-gradient(105deg, #176b52 8%, #36956d 58%, #7aa96a 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}

.mp-hero__subtitle {
    margin: 1.35rem auto 0;
    max-width: 570px;
    font-size: 1.05rem;
    line-height: 1.8;
    color: var(--color-ink-secondary);
}

/* ---------- Rejilla de cartas ---------- */
.mp-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 270px), 1fr));
    gap: 1.25rem;
    justify-items: stretch;
}

.mp-grid--single {
    grid-template-columns: minmax(0, 370px);
    justify-content: center;
}

.mp-grid__item {
    width: 100%;
    min-width: 0;
    display: flex;
    animation: mp-fade-up 620ms var(--ease-out) both;
}

.mp-grid__item > .aether-card {
    width: 100%;
    border: 1px solid rgba(28, 75, 51, .11);
    border-radius: 20px;
    background: rgba(255, 255, 255, .78);
    box-shadow: 0 8px 25px rgba(31, 64, 43, .04);
    transition:
    transform 240ms var(--ease-out),
    box-shadow 240ms var(--ease-out),
    border-color 240ms ease;
}

.mp-grid__item:hover > .aether-card {
    transform: translateY(-5px);
    border-color: rgba(39, 126, 81, .25);
    box-shadow: 0 18px 38px rgba(31, 64, 43, .1);
}

/* ---------- Footer ---------- */
.mp-footer {
    position: relative;
    z-index: 1;
    padding: 1.7rem 1.5rem;
    border-top: 1px solid rgba(28, 58, 47, .09);
    text-align: center;
    font-size: .78rem;
    color: var(--color-ink-tertiary);
}

/* ---------- Animaciones ---------- */
@keyframes mp-float {
    0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
    50%      { transform: translate3d(22px, -28px, 0) scale(1.06); }
}

@keyframes mp-fade-up {
    from { opacity: 0; transform: translateY(15px); }
    to   { opacity: 1; transform: translateY(0); }
}

/* ---------- Responsive ---------- */
@media (max-width: 700px) {
    .mp-main { padding: 3rem 1.15rem 3.5rem; }
    .mp-hero { margin-bottom: 3.5rem; }
    .mp-hero__title { font-size: clamp(2.35rem, 10vw, 3.6rem); }
    .mp-hero__subtitle { font-size: .97rem; }
    .mp-grid { gap: 1rem; }
}

/* ---------- Accesibilidad ---------- */
@media (prefers-reduced-motion: reduce) {
    .mp-orb,
    .mp-main,
    .mp-grid__item { animation: none; }

    .mp-grid__item > .aether-card { transition: none; }
}
`
