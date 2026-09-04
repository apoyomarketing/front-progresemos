import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  ArrowUp,
  Menu,
  X,
  MapPin,
  Eye,
  Compass,
  ListChecks,
  HeartHandshake,
  Layers,
  Target,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ContourMotif from "./components/ContourMotif";
import { useDocumentHead } from "./hooks/useDocumentHead";
import plan from "./data/planGobierno.json";
import heroBackground from "./assets/campana-mitin-noche-1.jpg";

// ---------------------------------------------------------------------------
// Índice de contenidos: se arma a partir de la estructura real del JSON (las
// dimensiones son dinámicas), no está escrito a mano para que si el plan
// cambia de ejes, el índice se actualice solo.
// ---------------------------------------------------------------------------

function slugificar(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface EstiloDimension {
  bg: string;
  border: string;
  bar: string;
  text: string;
  pill: string;
}

const ESTILO_POR_DIMENSION: Record<string, EstiloDimension> = {
  Social: {
    bg: "bg-brand-green/5",
    border: "border-brand-green/25",
    bar: "bg-brand-green",
    text: "text-brand-green-dark",
    pill: "bg-brand-green text-white",
  },
  "Económica": {
    bg: "bg-brand-yellow/10",
    border: "border-brand-yellow/40",
    bar: "bg-brand-yellow",
    text: "text-brand-gray-900",
    pill: "bg-brand-yellow text-brand-gray-900",
  },
  Ambiental: {
    bg: "bg-brand-lime/10",
    border: "border-brand-lime/35",
    bar: "bg-brand-lime",
    text: "text-brand-green-dark",
    pill: "bg-brand-lime text-brand-gray-900",
  },
  Institucional: {
    bg: "bg-brand-green-dark/5",
    border: "border-brand-green-dark/25",
    bar: "bg-brand-green-dark",
    text: "text-brand-green-dark",
    pill: "bg-brand-green-dark text-white",
  },
};

const ESTILO_DEFECTO: EstiloDimension = ESTILO_POR_DIMENSION.Social;

const COLORES_CICLO = ["bg-brand-green", "bg-brand-lime", "bg-brand-yellow", "bg-brand-green-dark"];

const secciones = [
  { id: "presentacion", label: "Presentación" },
  { id: "contexto", label: "Contexto" },
  { id: "vision", label: "Visión" },
  { id: "principios", label: "Principios" },
  { id: "objetivos", label: "Objetivos" },
  { id: "valores", label: "Valores" },
  ...plan.dimensiones.map((d) => ({ id: `dimension-${slugificar(d.nombre)}`, label: `Eje ${d.nombre}` })),
  { id: "metas", label: "Metas 2027-2030" },
  { id: "rendicion", label: "Rendición de cuentas" },
];

// ---------------------------------------------------------------------------
// Hooks de la página: qué sección está a la vista y cuándo mostrar "volver arriba".
// ---------------------------------------------------------------------------

function useSeccionActiva(ids: string[]) {
  const [activa, setActiva] = useState(ids[0] ?? "");

  useEffect(() => {
    const elementos = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibles = entries.filter((e) => e.isIntersecting);
        if (visibles.length === 0) return;
        const masArriba = visibles.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b,
        );
        setActiva(masArriba.target.id);
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 },
    );

    elementos.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return activa;
}

function useVolverArriba(umbral = 700) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > umbral);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [umbral]);
  return visible;
}

// ---------------------------------------------------------------------------
// Piezas visuales reutilizadas dentro de la página.
// ---------------------------------------------------------------------------

function TituloSeccion({
  numero,
  eyebrow,
  titulo,
  icono: Icono,
}: {
  numero: string;
  eyebrow: string;
  titulo: string;
  icono: LucideIcon;
}) {
  return (
    <div className="flex items-start gap-4">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-green text-white shadow-sm sm:h-14 sm:w-14">
        <Icono size={22} />
      </span>
      <div>
        <p className="eyebrow text-brand-green">
          {numero} · {eyebrow}
        </p>
        <h2 className="mt-2 font-display text-3xl font-bold leading-[1.1] tracking-tight text-brand-gray-900 sm:text-4xl">
          {titulo}
        </h2>
      </div>
    </div>
  );
}

function TarjetaNumerada({ numero, nombre, descripcion, color }: { numero: number; nombre: string; descripcion: string; color: string }) {
  return (
    <div className="rounded-2xl border border-brand-gray-900/10 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center gap-3">
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${color}`}>
          {String(numero).padStart(2, "0")}
        </span>
        <p className="font-display text-base font-bold text-brand-gray-900">{nombre}</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-brand-gray-900/70">{descripcion}</p>
    </div>
  );
}

function EstrategiaItem({
  estrategia,
  estilo,
}: {
  estrategia: (typeof plan.dimensiones)[number]["estrategias"][number];
  estilo: EstiloDimension;
}) {
  const [abierto, setAbierto] = useState(false);

  return (
    <div className={`rounded-2xl border ${estilo.border} ${estilo.bg} p-6 shadow-sm sm:p-7`}>
      <p className={`text-xs font-bold uppercase tracking-wide ${estilo.text}/60`}>Problema</p>
      <p className="mt-1 text-base font-bold leading-snug text-brand-gray-900 sm:text-lg">{estrategia.problema}</p>

      <p className={`mt-4 text-xs font-bold uppercase tracking-wide ${estilo.text}/60`}>Estrategia</p>
      <p className="mt-1 text-sm leading-relaxed text-brand-gray-900/75 sm:text-base">{estrategia.estrategia}</p>

      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        className={`mt-4 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold ${estilo.pill} shadow-sm transition-transform hover:scale-[1.03]`}
      >
        {abierto ? "Ocultar actividades e indicadores" : "Ver actividades e indicadores"}
        <ChevronDown size={14} className={`transition-transform ${abierto ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence initial={false}>
        {abierto && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-white/70 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-brand-gray-900/40">Actividades</p>
                <ul className="mt-2 flex flex-col gap-1.5 text-sm text-brand-gray-900/75">
                  {estrategia.actividades.map((a) => (
                    <li key={a} className="flex gap-2.5">
                      <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${estilo.bar}`} aria-hidden="true" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl bg-white/70 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-brand-gray-900/40">Indicadores</p>
                <ul className="mt-2 flex flex-col gap-1.5 text-sm text-brand-gray-900/75">
                  {estrategia.indicadores.map((ind) => (
                    <li key={ind} className="flex gap-2.5">
                      <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${estilo.bar}`} aria-hidden="true" />
                      {ind}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------

export default function PlanGobierno() {
  useDocumentHead({
    title: `Plan de Gobierno ${plan.periodo} — PROGRESEMOS Puno`,
    description: plan.lema,
  });

  const idsSecciones = secciones.map((s) => s.id);
  const activa = useSeccionActiva(idsSecciones);
  const mostrarVolverArriba = useVolverArriba();
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);

  const metasPorDimension = plan.dimensiones.map((d) => ({
    nombre: d.nombre,
    metas: plan.metas.filter((m) => m.dimension === d.nombre),
  }));

  return (
    <div className="min-h-screen bg-brand-gray-50 font-body">
      <Navbar solid />

      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden pb-16 pt-32 sm:pb-20 sm:pt-40">
        <img
          src={heroBackground}
          alt="Mitin de campaña de PROGRESEMOS con banderas y globos verdes y amarillos"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-green-dark/95 via-brand-green-dark/70 to-brand-green-dark/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <ContourMotif className="pointer-events-none absolute inset-x-0 top-0 h-20 w-full text-white/10" />
        <div className="container-editorial relative">
          <p className="eyebrow text-brand-lime">
            Plan de Gobierno Municipal · Provincia de Puno · {plan.periodo}
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
            {plan.lema}
          </h1>
          <p className="mt-5 text-lg font-semibold text-white/90">
            {plan.candidato} — {plan.cargo}
          </p>
          <p className="mt-1 text-sm text-white/60">{plan.lugarFecha}</p>
        </div>
      </section>

      {/* ---------- ÍNDICE MÓVIL (horizontal, sin sticky) ---------- */}
      <div className="border-b border-brand-gray-900/10 bg-white lg:hidden">
        <div className="container-editorial flex items-center justify-between py-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-brand-gray-900/50">
            Contenidos del plan
          </span>
          <button
            type="button"
            onClick={() => setMenuMovilAbierto((v) => !v)}
            aria-expanded={menuMovilAbierto}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-green/10 text-brand-green-dark"
            aria-label={menuMovilAbierto ? "Cerrar índice" : "Abrir índice"}
          >
            {menuMovilAbierto ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
        <AnimatePresence initial={false}>
          {menuMovilAbierto && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <nav className="container-editorial flex flex-col gap-1 pb-4">
                {secciones.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    onClick={() => setMenuMovilAbierto(false)}
                    className={`rounded-lg px-3 py-2 text-sm ${
                      activa === s.id
                        ? "bg-brand-green/10 font-semibold text-brand-green-dark"
                        : "text-brand-gray-900/60"
                    }`}
                  >
                    {s.label}
                  </a>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <main className="container-editorial py-16 sm:py-20">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[220px_1fr] lg:gap-16">
          {/* ---------- ÍNDICE DESKTOP (sidebar sticky) ---------- */}
          <nav className="hidden lg:block">
            <div className="sticky top-28 flex flex-col gap-1 rounded-2xl bg-white p-4 shadow-sm">
              {secciones.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className={`rounded-xl px-3 py-2 text-sm transition-colors ${
                    activa === s.id
                      ? "bg-brand-green text-white font-semibold shadow-sm"
                      : "text-brand-gray-900/55 hover:bg-brand-green/10 hover:text-brand-gray-900"
                  }`}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </nav>

          {/* ---------- CONTENIDO ---------- */}
          <div className="flex flex-col gap-16 sm:gap-20">
            {/* Presentación */}
            <section id="presentacion" className="scroll-mt-24">
              <TituloSeccion numero="00" eyebrow="Presentación" titulo="Un plan construido con la gente" icono={HeartHandshake} />
              <div className="mt-6 rounded-2xl border border-brand-gray-900/10 bg-white p-7 shadow-sm sm:p-8">
                <p className="max-w-3xl text-lg leading-relaxed text-brand-gray-900/75">{plan.presentacion}</p>
              </div>
            </section>

            {/* Contexto */}
            <section id="contexto" className="scroll-mt-24">
              <TituloSeccion numero="01" eyebrow="Contexto" titulo="La provincia de Puno hoy" icono={MapPin} />
              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-5">
                {[
                  { valor: plan.datosGenerales.poblacionProyectada2026.toLocaleString("es-PE"), etiqueta: "habitantes proyectados (2026)" },
                  { valor: `${plan.datosGenerales.extensionKm2.toLocaleString("es-PE")} km²`, etiqueta: "de extensión" },
                  { valor: `${plan.datosGenerales.altitudMsnm.toLocaleString("es-PE")} msnm`, etiqueta: "de altitud" },
                  { valor: `${plan.datosGenerales.distritos}`, etiqueta: "distritos" },
                  { valor: plan.datosGenerales.centrosPoblados.toLocaleString("es-PE"), etiqueta: "centros poblados" },
                ].map((d, i) => (
                  <div
                    key={d.etiqueta}
                    className="overflow-hidden rounded-2xl border border-brand-gray-900/10 bg-white shadow-sm"
                  >
                    <div className={`h-1.5 w-full ${COLORES_CICLO[i % COLORES_CICLO.length]}`} />
                    <div className="p-4">
                      <p className="font-display text-2xl font-extrabold text-brand-green-dark sm:text-3xl">
                        {d.valor}
                      </p>
                      <p className="mt-1 text-xs leading-snug text-brand-gray-900/60 sm:text-sm">{d.etiqueta}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl border border-brand-yellow/40 bg-brand-yellow/10 p-6">
                <p className="text-xs font-bold uppercase tracking-wide text-brand-gray-900/50">
                  Diagnóstico: ejecución de inversiones públicas
                </p>
                <p className="mt-2 max-w-3xl text-base leading-relaxed text-brand-gray-900/80">
                  {plan.datosGenerales.ejecucionInversionesPromedio20222025}
                </p>
              </div>
            </section>

            {/* Visión */}
            <section id="vision" className="scroll-mt-24">
              <TituloSeccion numero="02" eyebrow="Visión" titulo="Hacia dónde va Puno" icono={Eye} />

              <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
                <div className="rounded-2xl bg-brand-green-dark p-7 text-white shadow-md sm:p-8">
                  <p className="eyebrow text-brand-lime">Visión del Plan de Gobierno al 2030</p>
                  <p className="mt-4 font-display text-xl font-semibold leading-snug sm:text-2xl">
                    {plan.visionPlanPuno2030}
                  </p>
                </div>
                <div className="rounded-2xl border border-brand-gray-900/10 bg-white p-7 shadow-sm sm:p-8">
                  <p className="eyebrow text-brand-green">Visión del Perú al 2050 — CEPLAN</p>
                  <p className="mt-4 text-base italic leading-relaxed text-brand-gray-900/75 sm:text-lg">
                    {plan.visionPeru2050}
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <p className="text-xs font-bold uppercase tracking-wide text-brand-gray-900/50">
                  Aspiramos a una Puno...
                </p>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {plan.aspiracionesPuno.map((a, i) => (
                    <div
                      key={a}
                      className="flex gap-3 rounded-xl border border-brand-green/20 bg-brand-green/5 p-4"
                    >
                      <span
                        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${COLORES_CICLO[i % COLORES_CICLO.length]}`}
                      >
                        {i + 1}
                      </span>
                      <p className="text-sm leading-relaxed text-brand-gray-900/80">{a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Principios */}
            <section id="principios" className="scroll-mt-24">
              <TituloSeccion numero="03" eyebrow="Principios" titulo="Sobre qué se sostiene PROGRESEMOS" icono={Compass} />
              <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {plan.principios.map((p, i) => (
                  <TarjetaNumerada
                    key={p.nombre}
                    numero={i + 1}
                    nombre={p.nombre}
                    descripcion={p.descripcion}
                    color={COLORES_CICLO[i % COLORES_CICLO.length]}
                  />
                ))}
              </div>
            </section>

            {/* Objetivos */}
            <section id="objetivos" className="scroll-mt-24">
              <TituloSeccion numero="04" eyebrow="Objetivos" titulo="Lo que nos proponemos lograr" icono={Target} />
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {plan.objetivos.map((o, i) => (
                  <div
                    key={o}
                    className="flex gap-4 rounded-2xl border border-brand-gray-900/10 bg-white p-5 shadow-sm"
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${COLORES_CICLO[i % COLORES_CICLO.length]}`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-sm leading-relaxed text-brand-gray-900/80 sm:text-base">{o}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Valores */}
            <section id="valores" className="scroll-mt-24">
              <TituloSeccion numero="05" eyebrow="Valores" titulo="Cómo actuamos" icono={ShieldCheck} />
              <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {plan.valores.map((v, i) => (
                  <TarjetaNumerada
                    key={v.nombre}
                    numero={i + 1}
                    nombre={v.nombre}
                    descripcion={v.descripcion}
                    color={COLORES_CICLO[i % COLORES_CICLO.length]}
                  />
                ))}
              </div>
            </section>

            {/* Dimensiones / estrategias de desarrollo */}
            {plan.dimensiones.map((dimension, i) => {
              const estilo = ESTILO_POR_DIMENSION[dimension.nombre] ?? ESTILO_DEFECTO;
              return (
                <section
                  key={dimension.nombre}
                  id={`dimension-${slugificar(dimension.nombre)}`}
                  className="scroll-mt-24"
                >
                  <TituloSeccion
                    numero={String(6 + i).padStart(2, "0")}
                    eyebrow={`Eje ${dimension.nombre}`}
                    titulo={`Estrategias de desarrollo — dimensión ${dimension.nombre.toLowerCase()}`}
                    icono={Layers}
                  />
                  <div className="mt-8 flex flex-col gap-6">
                    {dimension.estrategias.map((estrategia) => (
                      <EstrategiaItem key={estrategia.problema} estrategia={estrategia} estilo={estilo} />
                    ))}
                  </div>
                </section>
              );
            })}

            {/* Metas 2027-2030 */}
            <section id="metas" className="scroll-mt-24">
              <TituloSeccion numero="10" eyebrow="Compromisos" titulo="Metas 2027-2030" icono={ListChecks} />
              <div className="mt-8 flex flex-col gap-10">
                {metasPorDimension.map(({ nombre, metas }) => {
                  const estilo = ESTILO_POR_DIMENSION[nombre] ?? ESTILO_DEFECTO;
                  return (
                    <div key={nombre}>
                      <span className={`inline-block rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide ${estilo.pill}`}>
                        Dimensión {nombre}
                      </span>
                      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                        {metas.map((m) => (
                          <div
                            key={m.problema}
                            className={`rounded-2xl border ${estilo.border} ${estilo.bg} p-5`}
                          >
                            <p className="text-xs text-brand-gray-900/55">{m.objetivoEstrategico}</p>
                            <p className="mt-2 text-base font-bold leading-snug text-brand-gray-900 sm:text-lg">
                              {m.meta}
                            </p>
                            <p className="mt-2 text-xs text-brand-gray-900/50">Indicador: {m.indicador}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Rendición de cuentas */}
            <section id="rendicion" className="scroll-mt-24">
              <TituloSeccion
                numero="11"
                eyebrow="Transparencia"
                titulo="Rendición de cuentas y cumplimiento del plan"
                icono={ShieldCheck}
              />
              <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {plan.rendicionDeCuentas.map((r, i) => (
                  <TarjetaNumerada
                    key={r.nombre}
                    numero={i + 1}
                    nombre={r.nombre}
                    descripcion={r.descripcion}
                    color={COLORES_CICLO[i % COLORES_CICLO.length]}
                  />
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />

      <AnimatePresence>
        {mostrarVolverArriba && (
          <motion.button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.2 }}
            aria-label="Volver arriba"
            className="fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-brand-green text-white shadow-lg transition-colors hover:bg-brand-green-dark"
          >
            <ArrowUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
