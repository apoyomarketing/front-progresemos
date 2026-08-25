import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X, Check } from "lucide-react";
import logo from "../assets/progresemos-logo.png";
import { registrarVoluntario, validarDni, type PersonaReniec } from "../api/voluntarios";

interface JoinModalProps {
  open: boolean;
  onClose: () => void;
}

const PASOS = ["Inicio", "Datos", "Confirmar", "Listo"];

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
  const [codigo, setCodigo] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const dniRef = useRef<HTMLInputElement>(null);
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
      setCodigo("");
      setError("");
    }, 300);
  }

  const puedeContinuar = esDni(dni) && esCelular(celular) && aceptaWhatsapp;

  async function verificar() {
    setError("");
    setCargando(true);
    try {
      setPersona(await validarDni(dni));
      setConfirmaDatos(false);
      setPaso(3);
    } catch (err) {
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
      setCodigo(data.codigo);
      setPaso(4);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No pudimos guardar tu registro.");
    } finally {
      setCargando(false);
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
            className="relative w-full max-w-sm rounded-2xl bg-white p-7"
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
                  <button type="button" onClick={() => setPaso(2)} className={`flex-1 ${btnPrimario}`}>
                    Quiero unirme
                  </button>
                </div>
              </div>
            )}

            {/* ---------- PASO 2 ---------- */}
            {paso === 2 && (
              <div className="flex flex-col gap-4">
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
                  <button type="button" onClick={() => setPaso(1)} className={btnFantasma}>
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

            {/* ---------- PASO 4 ---------- */}
            {paso === 4 && (
              <div className="flex flex-col items-center text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-green/10 text-brand-green">
                  <Check size={28} strokeWidth={2.5} />
                </span>
                <p className="mt-4 font-display text-lg font-bold text-brand-gray-900">
                  Ya estás preinscrito
                </p>
                <p className="mt-1.5 text-sm text-brand-gray-900/60">
                  Te escribiremos por WhatsApp al +51 {celular}.
                </p>
                <p className="mt-4 w-full rounded-xl border border-dashed border-brand-gray-900/20 px-4 py-3">
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-gray-900/50">
                    Tu código
                  </span>
                  <span className="mt-1 block font-display text-xl font-bold tracking-widest text-brand-green-dark">
                    {codigo}
                  </span>
                </p>
                <button type="button" onClick={handleClose} className={`mt-5 w-full ${btnPrimario}`}>
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
