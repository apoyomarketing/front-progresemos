import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X, UserRound, IdCard } from "lucide-react";
import logo from "../assets/progresemos-logo.png";

interface JoinModalProps {
  open: boolean;
  onClose: () => void;
}

function isValidDni(value: string): boolean {
  return /^\d{8}$/.test(value);
}

export default function JoinModal({ open, onClose }: JoinModalProps) {
  const [dni, setDni] = useState("");
  const [error, setError] = useState("");
  const [submittedDni, setSubmittedDni] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();

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

  function handleClose() {
    onClose();
    // Se limpia después de la animación de salida, no de golpe, para no
    // "parpadear" el contenido mientras el modal todavía se está cerrando.
    setTimeout(() => {
      setDni("");
      setError("");
      setSubmittedDni(null);
    }, 300);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidDni(dni)) {
      setError("Ingresa un DNI válido de 8 dígitos.");
      return;
    }
    setError("");
    setSubmittedDni(dni);
  }

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

            {submittedDni === null ? (
              <>
                <div className="mb-6 flex items-center gap-2.5">
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

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <label htmlFor="join-dni" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-gray-900/50">
                      DNI
                    </label>
                    <input
                      id="join-dni"
                      ref={inputRef}
                      type="text"
                      inputMode="numeric"
                      maxLength={8}
                      value={dni}
                      onChange={(e) => setDni(e.target.value.replace(/\D/g, ""))}
                      placeholder="12345678"
                      className="w-full rounded-lg border border-brand-gray-900/15 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand-green"
                    />
                    {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                  </div>

                  <button
                    type="submit"
                    className="mt-2 rounded-full bg-brand-green px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-green-dark"
                  >
                    Generar carnet
                  </button>
                </form>
              </>
            ) : (
              <div className="flex flex-col items-center">
                <span
                  id={titleId}
                  className="mb-4 self-start rounded-full bg-brand-yellow/20 px-3 py-1 text-xs font-semibold text-brand-gray-900/70"
                >
                  Vista previa — datos de ejemplo
                </span>

                <div className="w-full overflow-hidden rounded-2xl border border-brand-gray-900/10 bg-gradient-to-br from-brand-green-dark via-brand-green to-brand-lime p-5 text-white">
                  <div className="flex items-center gap-2.5">
                    <img src={logo} alt="" className="h-8 w-8 rounded-md bg-white/90 object-cover p-0.5" />
                    <span className="leading-none">
                      <span className="block font-display text-sm font-bold tracking-tight">PROGRESEMOS</span>
                      <span className="block text-[10px] font-semibold tracking-[0.14em] text-white/80">
                        PUNO 2026
                      </span>
                    </span>
                    <IdCard size={18} className="ml-auto text-white/70" />
                  </div>

                  <div className="mt-5 flex items-center gap-4">
                    <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/15">
                      <UserRound size={32} strokeWidth={1.5} />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold uppercase tracking-wide">Nombre de ejemplo</p>
                      <p className="mt-1 text-xs text-white/75">Militante</p>
                      <p className="mt-2 text-xs text-white/75">
                        DNI <span className="font-semibold text-white">{submittedDni}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-center text-xs text-brand-gray-900/50">
                  Este carnet es solo una vista previa con datos de ejemplo. Todavía no hay un
                  proceso de afiliación conectado.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSubmittedDni(null);
                    setDni("");
                  }}
                  className="mt-5 rounded-full border border-brand-gray-900/15 px-5 py-2.5 text-sm font-semibold text-brand-gray-900/70 transition-colors hover:bg-brand-gray-50"
                >
                  Probar con otro DNI
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
