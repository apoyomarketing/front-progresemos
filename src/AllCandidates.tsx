import { useState } from "react";
import { ChevronDown, UserRound } from "lucide-react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ContourMotif from "./components/ContourMotif";
import { candidatosCompletos, type CandidatoCompleto } from "./data/candidatosCompletos";
import { useDocumentHead } from "./hooks/useDocumentHead";
import { formatFecha } from "./lib/date";

function formatMoneda(valor: number) {
  return `S/ ${valor.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const totalCandidatos = candidatosCompletos.length;
const mujeres = candidatosCompletos.filter((c) => c.sexo === "Mujer").length;
const edadPromedio = Math.round(
  candidatosCompletos.reduce((suma, c) => suma + c.edad, 0) / totalCandidatos,
);
const conExperienciaEnGobierno = candidatosCompletos.filter(
  (c) =>
    c.trayectoriaPartidaria.cargosEleccionPopular.length > 0 ||
    c.experienciaLaboral.some((e) => /municipalidad|gobierno regional/i.test(e)),
).length;

const estadisticas = [
  { valor: `${totalCandidatos}`, etiqueta: "candidatos a la Municipalidad Provincial" },
  { valor: `${mujeres}`, etiqueta: "mujeres en la fórmula" },
  { valor: `${edadPromedio}`, etiqueta: "años de edad promedio" },
  { valor: `${conExperienciaEnGobierno}`, etiqueta: "con experiencia previa en gestión pública" },
];

function Dato({ children }: { children: React.ReactNode }) {
  return <span className="text-brand-gray-900/60">{children}</span>;
}

function Separador() {
  return <span className="h-1 w-1 shrink-0 rounded-full bg-brand-gray-900/25" aria-hidden="true" />;
}

function CandidatoPerfil({ candidato, index }: { candidato: CandidatoCompleto; index: number }) {
  const [abierto, setAbierto] = useState(false);
  const {
    nombre,
    cargo,
    numeroLista,
    photo,
    dni,
    sexo,
    fechaNacimiento,
    edad,
    lugarNacimiento,
    educacion,
    experienciaLaboral,
    trayectoriaPartidaria,
    sentenciasFirmes,
    ingresosAnuales2025,
    bienes,
    resumenTrayectoria,
  } = candidato;

  const fotoIzquierda = index % 2 === 0;

  const educacionVisible = Object.entries({
    "Educación básica": educacion.basica,
    "Educación técnica": educacion.tecnica,
    "Estudios no universitarios": educacion.noUniversitaria,
    "Educación universitaria": educacion.universitaria,
    Posgrado: educacion.posgrado,
  }).filter(([, valor]) => valor && valor !== "No registra");

  const nivelEducativoDestacado =
    educacion.posgrado && educacion.posgrado !== "No registra"
      ? educacion.posgrado.split(",")[0]
      : educacion.universitaria && educacion.universitaria !== "No registra"
        ? educacion.universitaria.split(",")[0]
        : null;

  const cargosPartidarios = trayectoriaPartidaria.cargosPartidarios ?? [];
  const sinTrayectoriaPartidaria =
    cargosPartidarios.length === 0 &&
    trayectoriaPartidaria.cargosEleccionPopular.length === 0 &&
    trayectoriaPartidaria.renuncias.length === 0;

  const hayBienes =
    bienes.inmuebles.length > 0 ||
    bienes.muebles.length > 0 ||
    (bienes.accionesYParticipaciones?.length ?? 0) > 0;

  return (
    <div className="border-t border-brand-gray-900/10 py-14 first:border-t-0 first:pt-0 sm:py-20">
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-14">
        <div className={`lg:col-span-5 ${fotoIzquierda ? "lg:order-1" : "lg:order-2"}`}>
          {photo ? (
            <img
              src={photo}
              alt={`Foto de ${nombre}`}
              className="aspect-square w-full max-w-xs rounded-2xl object-cover object-top lg:max-w-none"
            />
          ) : (
            <div className="flex aspect-square w-full max-w-xs flex-col items-center justify-center gap-2 rounded-2xl bg-brand-gray-50 lg:max-w-none">
              <UserRound size={40} className="text-brand-gray-900/20" strokeWidth={1.25} />
              <span className="text-xs font-semibold uppercase tracking-wide text-brand-gray-900/35">
                Foto pendiente
              </span>
            </div>
          )}
        </div>

        <div className={`lg:col-span-7 ${fotoIzquierda ? "lg:order-2" : "lg:order-1"}`}>
          <p className="eyebrow text-brand-green">
            {cargo}
            {numeroLista !== null ? ` · N° ${numeroLista} en la lista` : ""}
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold leading-[1.1] tracking-tight text-brand-gray-900 sm:text-4xl">
            {nombre}
          </h2>

          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-brand-gray-900/70">
            {resumenTrayectoria}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm">
            <Dato>{edad} años</Dato>
            <Separador />
            <Dato>{lugarNacimiento}</Dato>
            {nivelEducativoDestacado && (
              <>
                <Separador />
                <Dato>{nivelEducativoDestacado}</Dato>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setAbierto((v) => !v)}
            aria-expanded={abierto}
            className="mt-7 inline-flex items-center gap-1.5 border-b border-brand-green-dark/30 pb-0.5 text-sm font-semibold text-brand-green-dark transition-colors hover:border-brand-green-dark"
          >
            {abierto ? "Ocultar hoja de vida completa" : "Ver hoja de vida completa"}
            <ChevronDown size={15} className={`transition-transform ${abierto ? "rotate-180" : ""}`} />
          </button>

          {abierto && (
            <div className="mt-9 grid grid-cols-1 gap-x-10 gap-y-8 border-t border-brand-gray-900/10 pt-9 sm:grid-cols-2">
              <div>
                <h3 className="eyebrow text-brand-gray-900/40">Datos personales</h3>
                <dl className="mt-3 flex flex-col gap-1.5 text-sm">
                  <div className="flex justify-between gap-3">
                    <dt className="text-brand-gray-900/50">DNI</dt>
                    <dd className="text-brand-gray-900/80">{dni}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-brand-gray-900/50">Sexo</dt>
                    <dd className="text-brand-gray-900/80">{sexo}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-brand-gray-900/50">Nacimiento</dt>
                    <dd className="text-right text-brand-gray-900/80">{formatFecha(fechaNacimiento)}</dd>
                  </div>
                </dl>
              </div>

              {educacionVisible.length > 0 && (
                <div>
                  <h3 className="eyebrow text-brand-gray-900/40">Educación</h3>
                  <dl className="mt-3 flex flex-col gap-2.5 text-sm">
                    {educacionVisible.map(([label, valor]) => (
                      <div key={label}>
                        <dt className="text-xs font-semibold text-brand-gray-900/50">{label}</dt>
                        <dd className="text-brand-gray-900/80">{valor}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {experienciaLaboral.length > 0 && (
                <div>
                  <h3 className="eyebrow text-brand-gray-900/40">Experiencia laboral</h3>
                  <ul className="mt-3 flex flex-col gap-2 text-sm text-brand-gray-900/80">
                    {experienciaLaboral.map((exp) => (
                      <li key={exp} className="flex gap-2.5">
                        <Separador />
                        {exp}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h3 className="eyebrow text-brand-gray-900/40">Trayectoria político-partidaria</h3>
                {sinTrayectoriaPartidaria ? (
                  <p className="mt-3 text-sm text-brand-gray-900/60">Sin trayectoria previa registrada.</p>
                ) : (
                  <div className="mt-3 flex flex-col gap-3 text-sm text-brand-gray-900/80">
                    {cargosPartidarios.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-brand-gray-900/50">Cargos partidarios</p>
                        <ul className="mt-1 flex flex-col gap-1">
                          {cargosPartidarios.map((c) => (
                            <li key={c}>{c}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {trayectoriaPartidaria.cargosEleccionPopular.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-brand-gray-900/50">Cargos por elección popular</p>
                        <ul className="mt-1 flex flex-col gap-1">
                          {trayectoriaPartidaria.cargosEleccionPopular.map((c) => (
                            <li key={c}>{c}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {trayectoriaPartidaria.renuncias.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-brand-gray-900/50">Renuncias</p>
                        <ul className="mt-1 flex flex-col gap-1">
                          {trayectoriaPartidaria.renuncias.map((r) => (
                            <li key={r}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
                <p className="mt-3 text-sm text-brand-gray-900/80">
                  <span className="text-xs font-semibold uppercase tracking-wide text-brand-gray-900/50">
                    Sentencias firmes:{" "}
                  </span>
                  {sentenciasFirmes}
                </p>
              </div>

              <div>
                <h3 className="eyebrow text-brand-gray-900/40">Ingresos anuales 2025</h3>
                {ingresosAnuales2025 ? (
                  <dl className="mt-3 flex flex-col gap-1.5 text-sm">
                    <div className="flex justify-between gap-3">
                      <dt className="text-brand-gray-900/50">Remuneración bruta</dt>
                      <dd className="text-brand-gray-900/80">
                        {formatMoneda(ingresosAnuales2025.remuneracionBruta)}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-brand-gray-900/50">Renta bruta individual</dt>
                      <dd className="text-brand-gray-900/80">
                        {formatMoneda(ingresosAnuales2025.rentaBrutaEjercicioIndividual)}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-brand-gray-900/50">Otros ingresos</dt>
                      <dd className="text-brand-gray-900/80">{formatMoneda(ingresosAnuales2025.otrosIngresos)}</dd>
                    </div>
                    <div className="flex justify-between gap-3 border-t border-brand-gray-900/10 pt-1.5 font-semibold text-brand-gray-900">
                      <dt>Total</dt>
                      <dd>{formatMoneda(ingresosAnuales2025.total)}</dd>
                    </div>
                  </dl>
                ) : (
                  <p className="mt-3 text-sm text-brand-gray-900/60">No registra.</p>
                )}
              </div>

              {hayBienes && (
                <div className="sm:col-span-2">
                  <h3 className="eyebrow text-brand-gray-900/40">Bienes declarados</h3>
                  <div className="mt-3 grid grid-cols-1 gap-6 text-sm text-brand-gray-900/80 sm:grid-cols-2">
                    {bienes.inmuebles.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-brand-gray-900/50">Inmuebles</p>
                        <ul className="mt-1.5 flex flex-col gap-1.5">
                          {bienes.inmuebles.map((b, i) => (
                            <li key={i}>
                              {b.nota ?? `${b.tipo} — ${b.ubicacion}`}
                              {b.valor !== undefined && ` (${formatMoneda(b.valor)})`}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {bienes.muebles.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-brand-gray-900/50">Muebles</p>
                        <ul className="mt-1.5 flex flex-col gap-1.5">
                          {bienes.muebles.map((b, i) => (
                            <li key={i}>
                              {b.tipo} {b.placa ? `(placa ${b.placa})` : ""}
                              {b.valor !== undefined && ` — ${formatMoneda(b.valor)}`}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {bienes.accionesYParticipaciones && bienes.accionesYParticipaciones.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-brand-gray-900/50">Acciones y participaciones</p>
                        <ul className="mt-1.5 flex flex-col gap-1.5">
                          {bienes.accionesYParticipaciones.map((a, i) => (
                            <li key={i}>
                              {a.empresa} — {a.tipo} ({a.unidades}) · {formatMoneda(a.valor)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AllCandidates() {
  useDocumentHead({
    title: "Nuestros candidatos — PROGRESEMOS Puno 2026",
    description:
      "Conoce a todos los candidatos de PROGRESEMOS para la Provincia de Puno y su hoja de vida, según la declaración jurada presentada ante el JNE.",
  });

  return (
    <div className="min-h-screen bg-white font-body">
      <Navbar solid />

      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-brand-green-dark via-brand-green to-brand-green-dark pb-20 pt-32 sm:pb-24 sm:pt-40">
          <ContourMotif className="pointer-events-none absolute inset-x-0 top-0 h-20 w-full text-white/10" />
          <div className="container-editorial relative">
            <span className="eyebrow mb-5 block text-brand-lime">Nuestra fórmula</span>
            <h1 className="max-w-2xl font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl">
              Los candidatos de PROGRESEMOS para Puno
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/75">
              La fórmula completa a la Municipalidad Provincial de Puno, con la hoja de vida de cada
              candidato según su declaración jurada presentada ante el JNE.
            </p>
          </div>
        </section>

        <section className="border-b border-brand-gray-900/10 bg-white py-10 sm:py-12">
          <div className="container-editorial grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
            {estadisticas.map((e) => (
              <div key={e.etiqueta} className="border-l-2 border-brand-green/25 pl-4">
                <p className="font-display text-3xl font-extrabold text-brand-green-dark sm:text-4xl">{e.valor}</p>
                <p className="mt-1 text-sm leading-snug text-brand-gray-900/60">{e.etiqueta}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="container-editorial">
          {candidatosCompletos.map((candidato, i) => (
            <CandidatoPerfil candidato={candidato} index={i} key={candidato.dni} />
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}
