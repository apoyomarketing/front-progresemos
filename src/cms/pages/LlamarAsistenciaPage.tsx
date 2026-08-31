import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check, AlertCircle, Info } from "lucide-react";
import { useAuth } from "../../api/AuthProvider";
import { ApiError } from "../../api/client";
import { obtenerActividad, type ApiActividad } from "../../api/actividades";
import { crearAsistencia } from "../../api/asistencia";
import { buscarVoluntarios } from "../../api/voluntarios";

interface Registro {
  id: string;
  nombre: string;
  dni: string;
  tono: "ok" | "duplicado" | "error";
  mensaje: string;
}

export default function LlamarAsistenciaPage() {
  const { actividadId } = useParams<{ actividadId: string }>();
  const { withAuth } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);

  const [actividad, setActividad] = useState<ApiActividad | null>(null);
  const [loadingActividad, setLoadingActividad] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [dni, setDni] = useState("");
  const [procesando, setProcesando] = useState(false);
  const [registros, setRegistros] = useState<Registro[]>([]);

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
    inputRef.current?.focus();
  }, [loadingActividad]);

  async function registrarDni(valor: string) {
    if (!actividadId) return;
    setProcesando(true);
    try {
      const encontrados = await withAuth((access) => buscarVoluntarios(access, { dni: valor }));
      const voluntario = encontrados.find((v) => v.dni === valor);

      if (!voluntario) {
        setRegistros((prev) => [
          { id: `${Date.now()}`, nombre: "", dni: valor, tono: "error", mensaje: "DNI no encontrado entre los afiliados." },
          ...prev,
        ]);
        return;
      }

      await withAuth((access) =>
        crearAsistencia(access, {
          voluntario_id: voluntario.id,
          actividad_id: Number(actividadId),
          estado: "presente",
        }),
      );
      setRegistros((prev) => [
        {
          id: `${Date.now()}`,
          nombre: voluntario.nombre_completo,
          dni: valor,
          tono: "ok",
          mensaje: "Marcado como presente.",
        },
        ...prev,
      ]);
    } catch (err) {
      const yaRegistrado = err instanceof ApiError && err.status === 400;
      setRegistros((prev) => [
        {
          id: `${Date.now()}`,
          nombre: "",
          dni: valor,
          tono: yaRegistrado ? "duplicado" : "error",
          mensaje:
            err instanceof ApiError
              ? err.message
              : "No se pudo registrar la asistencia.",
        },
        ...prev,
      ]);
    } finally {
      setProcesando(false);
      setDni("");
      inputRef.current?.focus();
    }
  }

  function handleDniChange(valor: string) {
    const soloDigitos = valor.replace(/\D/g, "").slice(0, 8);
    setDni(soloDigitos);
    if (soloDigitos.length === 8 && !procesando) {
      void registrarDni(soloDigitos);
    }
  }

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

          <div className="mt-8 w-full">
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              autoFocus
              value={dni}
              onChange={(e) => handleDniChange(e.target.value)}
              disabled={procesando}
              placeholder="Escribe o escanea el DNI"
              className="w-full rounded-2xl border-2 border-brand-gray-900/15 bg-white px-5 py-5 text-center font-display text-3xl font-bold tracking-[0.2em] text-brand-gray-900 outline-none transition-colors focus:border-brand-green disabled:opacity-60"
            />
            <p className="mt-2 text-center text-xs text-brand-gray-900/40">
              Se marca como presente automáticamente al completar los 8 dígitos.
            </p>
          </div>

          {registros.length > 0 && (
            <div className="mt-8 flex w-full flex-col gap-2">
              {registros.map((r) => (
                <div
                  key={r.id}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm ${
                    r.tono === "ok"
                      ? "bg-brand-green/10 text-brand-green-dark"
                      : r.tono === "duplicado"
                        ? "bg-brand-yellow/15 text-brand-gray-900/80"
                        : "bg-red-50 text-red-600"
                  }`}
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/60">
                    {r.tono === "ok" ? (
                      <Check size={14} />
                    ) : r.tono === "duplicado" ? (
                      <Info size={14} />
                    ) : (
                      <AlertCircle size={14} />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{r.nombre || `DNI ${r.dni}`}</p>
                    <p className="truncate text-xs opacity-80">{r.mensaje}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
