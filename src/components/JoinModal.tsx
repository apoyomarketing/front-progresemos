import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X, Check, Upload, Download, Camera } from "lucide-react";
import { toPng } from "html-to-image";
import logo from "../assets/progresemos-logo.png";
import { ApiError } from "../api/client";
import {
  registrarVoluntario,
  validarDni,
  subirFotoVoluntario,
  actualizarFotoVoluntario,
  obtenerVoluntarioPorDni,
  actualizarRolVoluntario,
  type PersonaReniec,
  type Preinscripcion,
} from "../api/voluntarios";
import CarnetAfiliado from "./CarnetAfiliado";

interface JoinModalProps {
  open: boolean;
  onClose: () => void;
}

const PASOS = ["Inicio", "Datos", "Confirmar", "Foto", "Personero", "Carnet"];

const soloDigitos = (valor: string, max: number) => valor.replace(/\D/g, "").slice(0, max);
const esDni = (valor: string) => /^\d{8}$/.test(valor);
const esCelular = (valor: string) => /^9\d{8}$/.test(valor);

export default function JoinModal({ open, onClose }: JoinModalProps) {
  const [paso, setPaso] = useState(1);
  const [dni, setDni] = useState("");
  const [celular, setCelular] = useState("");
  const [aceptaWhatsapp, setAceptaWhatsapp] = useState(false);
  const [confirmaDatos, setConfirmaDatos] = useState(false);
  const [persona, setPersona] = useState<PersonaReniec | null>(null);
  const [registro, setRegistro] = useState<Preinscripcion | null>(null);
  const [foto, setFoto] = useState<File | null>(null);
  const [fotoPreviewUrl, setFotoPreviewUrl] = useState("");
  const [subiendoFoto, setSubiendoFoto] = useState(false);
  const [actualizandoFoto, setActualizandoFoto] = useState(false);
  // El backend reutiliza la misma ruta de archivo al reemplazar la foto, así que
  // el navegador puede seguir mostrando la imagen anterior desde su caché en
  // memoria aunque el <img src> no haya cambiado de texto. Este contador se sube
  // en cada subida exitosa y se agrega como query param para forzar a que el
  // navegador la trate como un recurso nuevo y la vuelva a pedir.
  const [fotoVersion, setFotoVersion] = useState(0);
  const [cargando, setCargando] = useState(false);
  const [actualizandoRol, setActualizandoRol] = useState(false);
  const [error, setError] = useState("");
  // "Revisar mi carnet": paso 2 se reutiliza como buscador por DNI en vez del
  // formulario completo. Si no encuentra nada, cae al formulario normal (con
  // el DNI ya cargado) para que complete su afiliación.
  const [modoRevisar, setModoRevisar] = useState(false);
  const [carnetNoEncontrado, setCarnetNoEncontrado] = useState(false);

  const dniRef = useRef<HTMLInputElement>(null);
  const carnetRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, onClose]);

  // Foco al campo del DNI al entrar al paso 2.
  useEffect(() => {
    if (open && paso === 2) dniRef.current?.focus();
  }, [open, paso]);

  // Libera el object URL de la preview de la foto al cambiarla o desmontar.
  useEffect(() => {
    return () => {
      if (fotoPreviewUrl) URL.revokeObjectURL(fotoPreviewUrl);
    };
  }, [fotoPreviewUrl]);

  function handleClose() {
    onClose();
    // Se limpia después de la animación de salida, no de golpe, para no
    // "parpadear" el contenido mientras el modal todavía se está cerrando.
    setTimeout(() => {
      setPaso(1);
      setDni("");
      setCelular("");
      setAceptaWhatsapp(false);
      setConfirmaDatos(false);
      setPersona(null);
      setRegistro(null);
      setFoto(null);
      setFotoPreviewUrl("");
      setActualizandoFoto(false);
      setFotoVersion(0);
      setModoRevisar(false);
      setCarnetNoEncontrado(false);
      setError("");
    }, 300);
  }

  const puedeContinuar = esDni(dni) && esCelular(celular) && aceptaWhatsapp;

  function abrirRevisarCarnet() {
    setError("");
    setCarnetNoEncontrado(false);
    setModoRevisar(true);
    setPaso(2);
  }

  async function buscarCarnet() {
    setError("");
    setCargando(true);
    try {
      setRegistro(await obtenerVoluntarioPorDni(dni));
      setModoRevisar(false);
      setPaso(6);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        // No tiene carnet todavía: pasa al formulario normal, con el DNI ya
        // cargado, para que complete su afiliación.
        setModoRevisar(false);
        setCarnetNoEncontrado(true);
        return;
      }
      setError(err instanceof Error ? err.message : "No pudimos buscar tu carnet.");
    } finally {
      setCargando(false);
    }
  }

  async function verificar() {
    setError("");
    setCargando(true);
    try {
      setPersona(await validarDni(dni));
      setConfirmaDatos(false);
      setPaso(3);
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        // Ya estaba preinscrito: en vez de bloquear, traemos su carnet ya
        // guardado en la base para que pueda volver a descargarlo.
        try {
          setRegistro(await obtenerVoluntarioPorDni(dni));
          setPaso(6);
          return;
        } catch (getErr) {
          setError(getErr instanceof Error ? getErr.message : "No pudimos recuperar tu carnet.");
          return;
        }
      }
      setError(err instanceof Error ? err.message : "No pudimos verificar tu DNI.");
    } finally {
      setCargando(false);
    }
  }

  async function confirmar() {
    setError("");
    setCargando(true);
    try {
      const data = await registrarVoluntario({ dni, celular, acepta_whatsapp: aceptaWhatsapp });
      setRegistro(data);
      setPaso(4);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No pudimos guardar tu registro.");
    } finally {
      setCargando(false);
    }
  }

  function onFotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0];
    if (!archivo) return;
    if (fotoPreviewUrl) URL.revokeObjectURL(fotoPreviewUrl);
    setFoto(archivo);
    setFotoPreviewUrl(URL.createObjectURL(archivo));
  }

  async function subirFoto() {
    if (!registro || !foto) return;
    setError("");
    setSubiendoFoto(true);
    try {
      const data = actualizandoFoto
        ? await actualizarFotoVoluntario(registro.dni, foto)
        : await subirFotoVoluntario(registro.codigo, foto);
      setRegistro(data);
      setFotoVersion((v) => v + 1);
      setPaso(actualizandoFoto ? 6 : 5);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No pudimos subir tu foto.");
    } finally {
      setSubiendoFoto(false);
    }
  }

  function omitirFoto() {
    setError("");
    setPaso(actualizandoFoto ? 6 : 5);
  }

  function abrirCambiarFoto() {
    setError("");
    setFoto(null);
    if (fotoPreviewUrl) URL.revokeObjectURL(fotoPreviewUrl);
    setFotoPreviewUrl("");
    setActualizandoFoto(true);
    setPaso(4);
  }

  async function handlePersonero(acepta: boolean) {
    if (!registro) return;
    if (!acepta) {
      setPaso(6);
      return;
    }
    
    setError("");
    setActualizandoRol(true);
    try {
      const data = await actualizarRolVoluntario(undefined, registro.codigo, "personero");
      setRegistro(data);
      setPaso(6);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No pudimos actualizar tu rol.");
    } finally {
      setActualizandoRol(false);
    }
  }

  async function descargarCarnet() {
    if (!carnetRef.current || !registro) return;
    try {
      const dataUrl = await toPng(carnetRef.current, { cacheBust: true, pixelRatio: 2 });
      const enlace = document.createElement("a");
      enlace.href = dataUrl;
      enlace.download = `carnet-progresemos-${registro.codigo}.png`;
      enlace.click();
    } catch {
      setError("No pudimos generar la imagen del carnet. Inténtalo de nuevo.");
    }
  }

  const claseInput =
    "w-full rounded-lg border border-brand-gray-900/15 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand-green";
  const btnPrimario =
    "rounded-full bg-brand-green px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-green-dark disabled:cursor-not-allowed disabled:opacity-40";
  const btnFantasma =
    "rounded-full border border-brand-gray-900/15 px-5 py-3 text-sm font-semibold text-brand-gray-900/70 transition-colors hover:bg-brand-gray-50";
  const claseCheck =
    "flex cursor-pointer items-start gap-2.5 text-xs leading-relaxed text-brand-gray-900/70";

  const fotoUrlSinCache = registro?.foto
    ? `${registro.foto}${registro.foto.includes("?") ? "&" : "?"}v=${fotoVersion}`
    : null;
  // Preferimos la vista previa local (el archivo que el usuario acaba de elegir)
  // sobre la URL del backend: así el carnet se actualiza al instante sin esperar
  // a que el servidor confirme que la foto ya está disponible en esa ruta.
  const fotoCarnet = fotoPreviewUrl || fotoUrlSinCache;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-gray-900/70 backdrop-blur-sm px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-h-[90vh] w-full max-w-sm overflow-y-auto overscroll-contain rounded-2xl bg-white p-7"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleClose}
              aria-label="Cerrar"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-brand-gray-900/40 transition-colors hover:bg-brand-gray-50 hover:text-brand-gray-900"
            >
              <X size={18} />
            </button>

            <div className="mb-5 flex items-center gap-2.5">
              <img src={logo} alt="" className="h-9 w-9 rounded-md object-cover" />
              <span className="leading-none">
                <span id={titleId} className="block font-display text-lg font-bold text-brand-gray-900">
                  Únete a PROGRESEMOS
                </span>
                <span className="block text-[11px] font-semibold tracking-[0.14em] text-brand-green-dark/70">
                  PUNO 2026
                </span>
              </span>
            </div>

            <ol className="mb-6 flex gap-1.5" aria-label="Progreso">
              {PASOS.map((nombre, i) => {
                const n = i + 1;
                return (
                  <li key={nombre} className="flex-1">
                    <span
                      className={`block h-1 rounded-full ${
                        n <= paso ? "bg-brand-green" : "bg-brand-gray-900/10"
                      }`}
                    />
                    <span
                      className={`mt-1.5 block text-[10px] font-semibold ${
                        n === paso ? "text-brand-gray-900" : "text-brand-gray-900/40"
                      }`}
                    >
                      {nombre}
                    </span>
                  </li>
                );
              })}
            </ol>

            {/* ---------- PASO 1 ---------- */}
            {paso === 1 && (
              <div className="flex flex-col gap-4">
                <p className="text-sm leading-relaxed text-brand-gray-900/70">
                  Ser voluntario es acompañar al partido con tu presencia.
                </p>
                <div className="mt-1 flex gap-2">
                  <button type="button" onClick={handleClose} className={btnFantasma}>
                    Ahora no
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCarnetNoEncontrado(false);
                      setPaso(2);
                    }}
                    className={`flex-1 ${btnPrimario}`}
                  >
                    Quiero unirme
                  </button>
                </div>
                <button type="button" onClick={abrirRevisarCarnet} className={`w-full ${btnFantasma}`}>
                  Revisar mi carnet
                </button>
              </div>
            )}

            {/* ---------- PASO 2 ---------- */}
            {paso === 2 && modoRevisar && (
              <div className="flex flex-col gap-4">
                <p className="text-sm leading-relaxed text-brand-gray-900/70">
                  Escribe tu DNI para ver tu carnet de afiliado.
                </p>

                <div>
                  <label
                    htmlFor="join-dni"
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-gray-900/50"
                  >
                    DNI
                  </label>
                  <input
                    id="join-dni"
                    ref={dniRef}
                    type="text"
                    inputMode="numeric"
                    maxLength={8}
                    value={dni}
                    onChange={(e) => setDni(soloDigitos(e.target.value, 8))}
                    placeholder="12345678"
                    className={claseInput}
                  />
                  {dni.length > 0 && !esDni(dni) && (
                    <p className="mt-1.5 text-xs text-red-600">Debe tener 8 dígitos.</p>
                  )}
                </div>

                {error && (
                  <p className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-600">{error}</p>
                )}

                <div className="mt-1 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setError("");
                      setModoRevisar(false);
                      setPaso(1);
                    }}
                    className={btnFantasma}
                  >
                    Atrás
                  </button>
                  <button
                    type="button"
                    onClick={buscarCarnet}
                    disabled={!esDni(dni) || cargando}
                    className={`flex-1 ${btnPrimario}`}
                  >
                    {cargando ? "Buscando…" : "Buscar"}
                  </button>
                </div>
              </div>
            )}

            {paso === 2 && !modoRevisar && (
              <div className="flex flex-col gap-4">
                {carnetNoEncontrado && (
                  <p className="rounded-lg bg-brand-yellow/15 px-3 py-2.5 text-sm text-brand-gray-900/80">
                    Todavía no tienes un carnet. Completa tus datos para afiliarte.
                  </p>
                )}

                <div>
                  <label
                    htmlFor="join-dni"
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-gray-900/50"
                  >
                    DNI
                  </label>
                  <input
                    id="join-dni"
                    ref={dniRef}
                    type="text"
                    inputMode="numeric"
                    maxLength={8}
                    value={dni}
                    onChange={(e) => setDni(soloDigitos(e.target.value, 8))}
                    placeholder="12345678"
                    className={claseInput}
                  />
                  {dni.length > 0 && !esDni(dni) && (
                    <p className="mt-1.5 text-xs text-red-600">Debe tener 8 dígitos.</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="join-celular"
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-gray-900/50"
                  >
                    Celular
                  </label>
                  <div className="flex items-stretch gap-2">
                    <span className="flex items-center rounded-lg border border-brand-gray-900/15 bg-brand-gray-50 px-3 text-sm font-semibold text-brand-gray-900/60">
                      +51
                    </span>
                    <input
                      id="join-celular"
                      type="text"
                      inputMode="numeric"
                      maxLength={9}
                      value={celular}
                      onChange={(e) => setCelular(soloDigitos(e.target.value, 9))}
                      placeholder="987654321"
                      className={claseInput}
                    />
                  </div>
                  {celular.length > 0 && !esCelular(celular) && (
                    <p className="mt-1.5 text-xs text-red-600">9 dígitos, empieza con 9.</p>
                  )}
                </div>

                <label className={claseCheck}>
                  <input
                    type="checkbox"
                    checked={aceptaWhatsapp}
                    onChange={(e) => setAceptaWhatsapp(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-brand-green"
                  />
                  <span>Acepto recibir información del partido por WhatsApp.</span>
                </label>

                {error && (
                  <p className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-600">{error}</p>
                )}

                <div className="mt-1 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setError("");
                      setCarnetNoEncontrado(false);
                      setPaso(1);
                    }}
                    className={btnFantasma}
                  >
                    Atrás
                  </button>
                  <button
                    type="button"
                    onClick={verificar}
                    disabled={!puedeContinuar || cargando}
                    className={`flex-1 ${btnPrimario}`}
                  >
                    {cargando ? "Verificando…" : "Continuar"}
                  </button>
                </div>
              </div>
            )}

            {/* ---------- PASO 3 ---------- */}
            {paso === 3 && (
              <div className="flex flex-col gap-4">
                <dl className="rounded-xl border border-brand-gray-900/10 bg-brand-gray-50 px-4 py-1">
                  <div className="flex justify-between gap-4 border-b border-brand-gray-900/10 py-2.5">
                    <dt className="text-xs font-semibold text-brand-gray-900/50">Nombre</dt>
                    <dd className="text-right text-sm font-semibold">{persona?.nombre_completo}</dd>
                  </div>
                  <div className="flex justify-between gap-4 border-b border-brand-gray-900/10 py-2.5">
                    <dt className="text-xs font-semibold text-brand-gray-900/50">DNI</dt>
                    <dd className="text-right text-sm font-semibold">{persona?.dni}</dd>
                  </div>
                  <div className="flex justify-between gap-4 py-2.5">
                    <dt className="text-xs font-semibold text-brand-gray-900/50">Celular</dt>
                    <dd className="text-right text-sm font-semibold">+51 {celular}</dd>
                  </div>
                </dl>

                {/* Check obligatorio: sin marcarlo el botón queda apagado */}
                <label className={claseCheck}>
                  <input
                    type="checkbox"
                    checked={confirmaDatos}
                    onChange={(e) => setConfirmaDatos(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-brand-green"
                  />
                  <span>Confirmo que los datos son correctos.</span>
                </label>

                {error && (
                  <p className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-600">{error}</p>
                )}

                <div className="mt-1 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setError("");
                      setPaso(2);
                    }}
                    className={btnFantasma}
                  >
                    Corregir
                  </button>
                  <button
                    type="button"
                    onClick={confirmar}
                    disabled={!confirmaDatos || cargando}
                    className={`flex-1 ${btnPrimario}`}
                  >
                    {cargando ? "Registrando…" : "Confirmar"}
                  </button>
                </div>
              </div>
            )}

            {/* ---------- PASO 4: FOTO ---------- */}
            {paso === 4 && (
              <div className="flex flex-col gap-4">
                <p className="text-sm leading-relaxed text-brand-gray-900/70">
                  {actualizandoFoto
                    ? "Selecciona la nueva foto para tu carnet de afiliado."
                    : "Agrega una foto para tu carnet de afiliado. Es opcional, puedes omitirlo por ahora."}
                </p>

                <label
                  htmlFor="join-foto"
                  className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-brand-gray-900/15 bg-brand-gray-50 px-4 py-8 text-center transition-colors hover:border-brand-green/50"
                >
                  {fotoPreviewUrl ? (
                    <img
                      src={fotoPreviewUrl}
                      alt="Vista previa"
                      className="h-20 w-20 rounded-full object-cover"
                    />
                  ) : (
                    <Upload size={22} className="text-brand-gray-900/40" />
                  )}
                  <span className="text-xs font-semibold text-brand-gray-900/60">
                    {fotoPreviewUrl ? "Cambiar foto" : "Seleccionar foto"}
                  </span>
                  <input
                    id="join-foto"
                    type="file"
                    accept="image/*"
                    onChange={onFotoChange}
                    className="hidden"
                  />
                </label>

                {error && (
                  <p className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-600">{error}</p>
                )}

                <div className="mt-1 flex gap-2">
                  <button type="button" onClick={omitirFoto} className={btnFantasma}>
                    {actualizandoFoto ? "Cancelar" : "Omitir por ahora"}
                  </button>
                  <button
                    type="button"
                    onClick={subirFoto}
                    disabled={!foto || subiendoFoto}
                    className={`flex-1 ${btnPrimario}`}
                  >
                    {subiendoFoto ? "Subiendo…" : "Subir foto"}
                  </button>
                </div>
              </div>
            )}

            {/* ---------- PASO 5: PERSONERO ---------- */}
            {paso === 5 && registro && (
              <div className="flex flex-col gap-4 text-center">
                <p className="font-display text-lg font-bold text-brand-gray-900">
                  ¿Te gustaría participar como personero en las próximas elecciones?
                </p>
                <p className="text-sm leading-relaxed text-brand-gray-900/70">
                  Los personeros defienden los votos de PROGRESEMOS en las mesas de sufragio el día de las elecciones.
                </p>

                {error && (
                  <p className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-600 text-left">{error}</p>
                )}

                <div className="mt-4 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => handlePersonero(true)}
                    disabled={actualizandoRol}
                    className={`w-full ${btnPrimario}`}
                  >
                    {actualizandoRol ? "Actualizando…" : "Sí, quiero ser personero"}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handlePersonero(false)} 
                    disabled={actualizandoRol}
                    className={`w-full ${btnFantasma}`}
                  >
                    No, gracias
                  </button>
                </div>
              </div>
            )}

            {/* ---------- PASO 6: CARNET ---------- */}
            {paso === 6 && registro && (
              <div className="flex flex-col items-center text-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-green/10 text-brand-green">
                  <Check size={22} strokeWidth={2.5} />
                </span>
                <p className="mt-3 font-display text-lg font-bold text-brand-gray-900">
                  ¡Ya eres parte de PROGRESEMOS!
                </p>
                <p className="mt-1 text-sm text-brand-gray-900/60">
                  Descarga tu carnet de afiliado.
                </p>

                <div className="mt-5 w-full">
                  <CarnetAfiliado
                    ref={carnetRef}
                    nombreCompleto={registro.nombre_completo}
                    dni={registro.dni}
                    codigo={registro.codigo}
                    fotoUrl={fotoCarnet}
                    fechaAfiliacion={registro.fecha_afiliacion}
                    rol={registro.rol_afiliado}
                  />
                </div>

                {error && (
                  <p className="mt-4 w-full rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-600">
                    {error}
                  </p>
                )}

                <button
                  type="button"
                  onClick={descargarCarnet}
                  className={`mt-5 flex w-full items-center justify-center gap-2 ${btnPrimario}`}
                >
                  <Download size={16} />
                  Descargar PNG
                </button>
                <button
                  type="button"
                  onClick={abrirCambiarFoto}
                  className={`mt-2 flex w-full items-center justify-center gap-2 ${btnFantasma}`}
                >
                  <Camera size={16} />
                  Cambiar foto de perfil
                </button>
                <button type="button" onClick={handleClose} className={`mt-2 w-full ${btnFantasma}`}>
                  Cerrar
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
