import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BrowserMultiFormatReader, type IScannerControls } from "@zxing/browser";
import { BarcodeFormat, DecodeHintType } from "@zxing/library";
import { ArrowLeft, Check, AlertCircle, Info, Keyboard, Camera, Users, X } from "lucide-react";
import { useAuth } from "../../api/AuthProvider";
import { ApiError } from "../../api/client";
import { obtenerActividad, type ApiActividad } from "../../api/actividades";
import { crearAsistencia, listAsistencia } from "../../api/asistencia";
import { buscarVoluntarios, type ApiVoluntario } from "../../api/voluntarios";

interface Feedback {
  tono: "ok" | "duplicado" | "error";
  mensaje: string;
}

interface AsistenteRow {
  id: number;
  nombre: string;
  dni: string;
  estado: string;
  hora: string;
}

function FeedbackIcon({ tono }: { tono: Feedback["tono"] }) {
  if (tono === "ok") return <Check size={18} />;
  if (tono === "duplicado") return <Info size={18} />;
  return <AlertCircle size={18} />;
}

function formatHora(iso: string) {
  const fecha = new Date(iso);
  if (Number.isNaN(fecha.getTime())) return "";
  return fecha.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
}

function CameraScanner({
  onDecode,
  feedback,
  onDismissFeedback,
}: {
  onDecode: (valor: string) => void;
  feedback: Feedback | null;
  onDismissFeedback: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const onDecodeRef = useRef(onDecode);
  const [error, setError] = useState("");

  useEffect(() => {
    onDecodeRef.current = onDecode;
  }, [onDecode]);

  useEffect(() => {
    let cancelled = false;
    let controls: IScannerControls | null = null;

    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.CODE_128]);
    const reader = new BrowserMultiFormatReader(hints);

    reader
      .decodeFromVideoDevice(undefined, videoRef.current ?? undefined, (result) => {
        if (result) onDecodeRef.current(result.getText());
      })
      .then((c) => {
        if (cancelled) {
          c.stop();
        } else {
          controls = c;
        }
      })
      .catch(() => {
        if (!cancelled) setError("No se pudo acceder a la cámara. Revisa los permisos del navegador.");
      });

    return () => {
      cancelled = true;
      controls?.stop();
    };
  }, []);

  if (error) {
    return <p className="w-full rounded-xl bg-red-50 px-4 py-3 text-center text-sm text-red-600">{error}</p>;
  }

  return (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-2xl border-2 border-brand-green bg-black">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video ref={videoRef} className="aspect-square w-full object-cover" muted playsInline />

        {feedback && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/70 p-6">
            <div
              className={`relative flex w-full max-w-[85%] flex-col items-center gap-2 rounded-2xl px-5 py-6 text-center shadow-xl ${
                feedback.tono === "ok"
                  ? "bg-brand-green text-white"
                  : feedback.tono === "duplicado"
                    ? "bg-brand-yellow text-brand-gray-900"
                    : "bg-red-600 text-white"
              }`}
            >
              <button
                type="button"
                onClick={onDismissFeedback}
                aria-label="Cerrar"
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full text-current/70 hover:bg-black/10"
              >
                <X size={15} />
              </button>
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/25">
                <FeedbackIcon tono={feedback.tono} />
              </span>
              <p className="font-display text-base font-bold leading-snug">
                {feedback.tono === "ok" ? "Registrado" : feedback.tono === "duplicado" ? "Ya estaba registrado" : "No encontrado"}
              </p>
              <p className="text-sm leading-snug opacity-90">{feedback.mensaje}</p>
            </div>
          </div>
        )}
      </div>
      <p className="mt-2 text-center text-xs text-brand-gray-900/40">
        Apunta la cámara al código de barras del carnet.
      </p>
    </div>
  );
}

export default function LlamarAsistenciaPage() {
  const { actividadId } = useParams<{ actividadId: string }>();
  const { withAuth } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);

  const [actividad, setActividad] = useState<ApiActividad | null>(null);
  const [loadingActividad, setLoadingActividad] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [modo, setModo] = useState<"teclado" | "camara">("teclado");
  const [dni, setDni] = useState("");
  const [procesando, setProcesando] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const [asistentes, setAsistentes] = useState<AsistenteRow[]>([]);
  const [loadingAsistentes, setLoadingAsistentes] = useState(true);

  const procesandoRef = useRef(false);
  const ultimoEscaneoRef = useRef<{ valor: string; ts: number } | null>(null);

  useEffect(() => {
    if (!actividadId) return;
    let cancelled = false;
    withAuth((access) => obtenerActividad(access, Number(actividadId)))
      .then((data) => {
        if (!cancelled) setActividad(data);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err instanceof ApiError ? err.message : "No se pudo cargar la actividad.");
      })
      .finally(() => {
        if (!cancelled) setLoadingActividad(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actividadId]);

  useEffect(() => {
    if (!actividadId) return;
    let cancelled = false;
    setLoadingAsistentes(true);
    Promise.all([
      withAuth((access) => listAsistencia(access, { actividad_id: Number(actividadId) })),
      withAuth((access) => buscarVoluntarios(access, {})),
    ])
      .then(([asistencias, voluntarios]) => {
        if (cancelled) return;
        const porId = new Map(voluntarios.map((v) => [v.id, v]));
        const filas = asistencias
          .filter((a) => a.estado !== "eliminado")
          .map((a) => {
            const v = porId.get(a.voluntario_id);
            return {
              id: a.id,
              nombre: v?.nombre_completo ?? `Voluntario #${a.voluntario_id}`,
              dni: v?.dni ?? "",
              estado: a.estado,
              hora: a.created_at,
            };
          })
          .sort((a, b) => b.hora.localeCompare(a.hora));
        setAsistentes(filas);
      })
      .catch(() => {
        // El listado de asistentes es un complemento informativo: si falla no
        // debe bloquear el flujo de escaneo, que es lo prioritario acá.
      })
      .finally(() => {
        if (!cancelled) setLoadingAsistentes(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actividadId]);

  useEffect(() => {
    if (modo === "teclado") inputRef.current?.focus();
  }, [loadingActividad, modo]);

  const registrarDni = useCallback(
    async (valor: string) => {
      if (!actividadId) return;
      setProcesando(true);
      procesandoRef.current = true;
      setFeedback(null);
      try {
        const encontrados = await withAuth((access) => buscarVoluntarios(access, { dni: valor }));
        const voluntario: ApiVoluntario | undefined = encontrados.find((v) => v.dni === valor);

        if (!voluntario) {
          setFeedback({ tono: "error", mensaje: `DNI ${valor} no encontrado entre los afiliados.` });
          return;
        }

        const asistencia = await withAuth((access) =>
          crearAsistencia(access, {
            voluntario_id: voluntario.id,
            actividad_id: Number(actividadId),
            estado: "presente",
          }),
        );

        setAsistentes((prev) => [
          {
            id: asistencia.id,
            nombre: voluntario.nombre_completo,
            dni: voluntario.dni,
            estado: asistencia.estado,
            hora: asistencia.created_at,
          },
          ...prev,
        ]);
        setFeedback({ tono: "ok", mensaje: `${voluntario.nombre_completo} — marcado como presente.` });
      } catch (err) {
        const yaRegistrado = err instanceof ApiError && err.status === 400;
        setFeedback({
          tono: yaRegistrado ? "duplicado" : "error",
          mensaje: err instanceof ApiError ? err.message : "No se pudo registrar la asistencia.",
        });
      } finally {
        setProcesando(false);
        procesandoRef.current = false;
        setDni("");
        inputRef.current?.focus();
      }
    },
    [actividadId, withAuth],
  );

  function handleDniChange(valor: string) {
    const soloDigitos = valor.replace(/\D/g, "").slice(0, 8);
    setDni(soloDigitos);
    if (soloDigitos.length === 8 && !procesando) {
      void registrarDni(soloDigitos);
    }
  }

  const handleDecoded = useCallback(
    (texto: string) => {
      const limpio = texto.replace(/\D/g, "");
      if (limpio.length !== 8) return;

      const ahora = Date.now();
      // Mientras el carnet sigue frente a la cámara, la misma lectura llega en
      // cada frame — sin este enfriamiento se dispararían decenas de intentos
      // duplicados por segundo hasta que la persona lo retire.
      if (ultimoEscaneoRef.current?.valor === limpio && ahora - ultimoEscaneoRef.current.ts < 4000) return;
      if (procesandoRef.current) return;

      ultimoEscaneoRef.current = { valor: limpio, ts: ahora };
      void registrarDni(limpio);
    },
    [registrarDni],
  );

  const claseTab = (activo: boolean) =>
    `inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
      activo ? "bg-brand-green text-white" : "text-brand-gray-900/60 hover:bg-brand-gray-50"
    }`;

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center">
      <div className="w-full">
        <Link
          to="/admin/actividades"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-gray-900/60 hover:text-brand-green-dark"
        >
          <ArrowLeft size={15} /> Volver a actividades
        </Link>
      </div>

      {loadingActividad ? (
        <p className="mt-8 text-sm text-brand-gray-900/50">Cargando actividad…</p>
      ) : loadError ? (
        <p className="mt-8 text-sm text-red-600">{loadError}</p>
      ) : (
        <>
          <div className="mt-4 text-center">
            <h2 className="font-display text-xl font-bold text-brand-gray-900">Llamar asistencia</h2>
            <p className="mt-1 text-sm text-brand-gray-900/60">
              {actividad?.nombre}
              {actividad?.fecha ? ` · ${actividad.fecha}` : ""}
              {actividad?.lugar ? ` · ${actividad.lugar}` : ""}
            </p>
          </div>

          <div className="mt-6 flex w-full rounded-full border border-brand-gray-900/10 bg-brand-gray-50 p-1">
            <button type="button" onClick={() => setModo("teclado")} className={claseTab(modo === "teclado")}>
              <Keyboard size={15} /> Teclado
            </button>
            <button type="button" onClick={() => setModo("camara")} className={claseTab(modo === "camara")}>
              <Camera size={15} /> Cámara
            </button>
          </div>

          <div className="mt-6 w-full">
            {modo === "teclado" ? (
              <>
                <input
                  ref={inputRef}
                  type="text"
                  inputMode="numeric"
                  autoFocus
                  value={dni}
                  onChange={(e) => handleDniChange(e.target.value)}
                  disabled={procesando}
                  placeholder="Escribe el DNI"
                  className="w-full rounded-2xl border-2 border-brand-gray-900/15 bg-white px-5 py-5 text-center font-display text-3xl font-bold tracking-[0.2em] text-brand-gray-900 outline-none transition-colors focus:border-brand-green disabled:opacity-60"
                />
                <p className="mt-2 text-center text-xs text-brand-gray-900/40">
                  Se marca como presente automáticamente al completar los 8 dígitos.
                </p>
              </>
            ) : (
              <CameraScanner
                onDecode={handleDecoded}
                feedback={feedback}
                onDismissFeedback={() => setFeedback(null)}
              />
            )}
          </div>

          {modo === "teclado" && feedback && (
            <div
              className={`mt-6 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm ${
                feedback.tono === "ok"
                  ? "bg-brand-green/10 text-brand-green-dark"
                  : feedback.tono === "duplicado"
                    ? "bg-brand-yellow/15 text-brand-gray-900/80"
                    : "bg-red-50 text-red-600"
              }`}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/60">
                <FeedbackIcon tono={feedback.tono} />
              </span>
              <p className="min-w-0 flex-1 truncate font-medium">{feedback.mensaje}</p>
            </div>
          )}

          <div className="mt-8 w-full">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-brand-gray-900/70">
              <Users size={15} />
              Asistentes {loadingAsistentes ? "" : `(${asistentes.length})`}
            </div>

            {loadingAsistentes ? (
              <p className="mt-3 text-sm text-brand-gray-900/50">Cargando asistentes…</p>
            ) : asistentes.length === 0 ? (
              <p className="mt-3 rounded-xl border border-dashed border-brand-gray-900/15 p-4 text-center text-sm text-brand-gray-900/50">
                Todavía no hay nadie registrado en esta actividad.
              </p>
            ) : (
              <div className="mt-3 flex max-h-96 flex-col gap-1.5 overflow-y-auto">
                {asistentes.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-brand-gray-900/10 bg-white px-4 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-brand-gray-900">{a.nombre}</p>
                      {a.dni && <p className="text-xs text-brand-gray-900/50">DNI {a.dni}</p>}
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="block text-xs font-semibold capitalize text-brand-green-dark">
                        {a.estado}
                      </span>
                      <span className="block text-[11px] text-brand-gray-900/40">{formatHora(a.hora)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
