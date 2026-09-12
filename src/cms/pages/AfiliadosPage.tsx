import { useEffect, useState, useRef, type FormEvent } from "react";
import { Search, Trash2, ChevronLeft, ChevronRight, DownloadCloud } from "lucide-react";
import { toPng } from "html-to-image";
import CarnetAfiliado from "../../components/CarnetAfiliado";
import { useAuth } from "../../api/AuthProvider";
import { ApiError } from "../../api/client";
import {
  buscarVoluntarios,
  actualizarRolVoluntario,
  eliminarVoluntario,
  listarRolesAfiliado,
  type ApiRolAfiliado,
  type ApiVoluntario,
} from "../../api/voluntarios";
import ConfirmDialog from "../ConfirmDialog";

const POR_PAGINA = 10;

function iniciales(nombreCompleto: string) {
  const partes = nombreCompleto.trim().split(/\s+/);
  return ((partes[0]?.[0] ?? "") + (partes[1]?.[0] ?? "")).toUpperCase();
}

function formatFechaCorta(isoDatetime: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(isoDatetime);
  if (!match) return isoDatetime;
  const [, anio, mes, dia] = match;
  return `${dia}/${mes}/${anio}`;
}

const claseSelectRol =
  "rounded-lg border border-brand-gray-900/15 bg-white px-2 py-1.5 text-xs font-semibold text-brand-gray-900/80 outline-none transition-colors focus:border-brand-green disabled:opacity-50";

export default function AfiliadosPage() {
  const { withAuth } = useAuth();

  const [items, setItems] = useState<ApiVoluntario[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [dni, setDni] = useState("");
  const [nombre, setNombre] = useState("");
  const [page, setPage] = useState(1);

  const [rolUpdatingId, setRolUpdatingId] = useState<number | null>(null);
  const [actionError, setActionError] = useState("");
  const [pendingDelete, setPendingDelete] = useState<ApiVoluntario | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [rolesDb, setRolesDb] = useState<ApiRolAfiliado[]>([]);

  const [rol, setRol] = useState("");
  const [carnetTarget, setCarnetTarget] = useState<ApiVoluntario | null>(null);
  const [descargandoId, setDescargandoId] = useState<number | null>(null);
  const carnetRef = useRef<HTMLDivElement>(null);

  function buscar(filtros: { dni?: string; nombre?: string; rol?: string }) {
    setLoading(true);
    setLoadError("");
    withAuth((access) => buscarVoluntarios(access, filtros))
      .then((data) => {
        setItems(data);
        setPage(1);
      })
      .catch((err) => {
        setLoadError(err instanceof ApiError ? err.message : "No se pudo cargar la lista de afiliados.");
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    buscar({});
    withAuth(listarRolesAfiliado).then(setRolesDb).catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    buscar({ dni: dni.trim() || undefined, nombre: nombre.trim() || undefined, rol: rol || undefined });
  }

  function limpiarBusqueda() {
    setDni("");
    setNombre("");
    setRol("");
    buscar({});
  }

  useEffect(() => {
    if (carnetTarget && carnetRef.current) {
      const timer = setTimeout(() => {
        toPng(carnetRef.current!, { cacheBust: true, pixelRatio: 2 })
          .then((dataUrl) => {
            const enlace = document.createElement("a");
            enlace.href = dataUrl;
            enlace.download = `carnet-progresemos-${carnetTarget.codigo}.png`;
            enlace.click();
          })
          .catch(() => setActionError("No pudimos generar el carnet."))
          .finally(() => {
            setCarnetTarget(null);
            setDescargandoId(null);
          });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [carnetTarget]);

  function handleDescargar(v: ApiVoluntario) {
    setDescargandoId(v.id);
    setCarnetTarget(v);
  }

  async function handleRolChange(v: ApiVoluntario, nuevoRol: string) {
    if (nuevoRol === v.rol_afiliado) return;
    setActionError("");
    setRolUpdatingId(v.id);
    try {
      const updated = await withAuth((access) => actualizarRolVoluntario(access, v.codigo, nuevoRol));
      setItems((prev) => prev.map((it) => (it.id === updated.id ? updated : it)));
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "No se pudo cambiar el rol. Intenta de nuevo.");
    } finally {
      setRolUpdatingId(null);
    }
  }

  async function handleConfirmDelete() {
    if (!pendingDelete) return;
    setActionError("");
    setDeletingId(pendingDelete.id);
    try {
      await withAuth((access) => eliminarVoluntario(access, pendingDelete.codigo));
      setItems((prev) => prev.filter((it) => it.id !== pendingDelete.id));
      setPendingDelete(null);
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "No se pudo eliminar. Intenta de nuevo.");
      setPendingDelete(null);
    } finally {
      setDeletingId(null);
    }
  }

  const totalPages = Math.max(1, Math.ceil(items.length / POR_PAGINA));
  const pageItems = items.slice((page - 1) * POR_PAGINA, page * POR_PAGINA);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-brand-gray-900">Afiliados</h2>
      </div>

      <form onSubmit={handleSearch} className="mt-5 flex flex-wrap items-end gap-3">
        <div className="min-w-[160px] flex-1">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-gray-900/50">
            DNI
          </label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={8}
            value={dni}
            onChange={(e) => setDni(e.target.value.replace(/\D/g, "").slice(0, 8))}
            placeholder="12345678"
            className="w-full rounded-lg border border-brand-gray-900/15 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-brand-green"
          />
        </div>
        <div className="min-w-[220px] flex-[2]">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-gray-900/50">
            Nombre
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre o apellido"
            className="w-full rounded-lg border border-brand-gray-900/15 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-brand-green"
          />
        </div>
        <div className="min-w-[160px] flex-1">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-gray-900/50">
            Rol
          </label>
          <select
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            className="w-full rounded-lg border border-brand-gray-900/15 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-brand-green"
          >
            <option value="">Todos</option>
            {rolesDb.map((r) => (
              <option key={r.id} value={r.rol_name}>
                {r.rol_name.charAt(0).toUpperCase() + r.rol_name.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 rounded-full bg-brand-green px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-green-dark"
        >
          <Search size={15} /> Buscar
        </button>
        {(dni || nombre || rol) && (
          <button
            type="button"
            onClick={limpiarBusqueda}
            className="rounded-full border border-brand-gray-900/15 px-4 py-2 text-sm font-semibold text-brand-gray-900/70 transition-colors hover:bg-brand-gray-50"
          >
            Limpiar
          </button>
        )}
      </form>

      {actionError && <p className="mt-5 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{actionError}</p>}

      <div className="mt-6">
        {loading && <p className="text-sm text-brand-gray-900/50">Cargando afiliados…</p>}
        {!loading && loadError && <p className="text-sm text-red-600">{loadError}</p>}
        {!loading && !loadError && items.length === 0 && (
          <p className="rounded-xl border border-dashed border-brand-gray-900/15 p-6 text-center text-sm text-brand-gray-900/50">
            No se encontraron afiliados.
          </p>
        )}

        {!loading && !loadError && items.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {pageItems.map((v) => (
                <div
                  key={v.id}
                  className="flex flex-col rounded-2xl border border-brand-gray-900/10 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-green/10 text-sm font-bold text-brand-green-dark">
                      {v.foto ? (
                        <img src={v.foto} alt="" className="h-full w-full object-cover" />
                      ) : (
                        iniciales(v.nombre_completo)
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-base font-bold text-brand-gray-900">
                        {v.nombre_completo}
                      </p>
                      <p className="text-sm text-brand-gray-900/60">DNI {v.dni}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPendingDelete(v)}
                      disabled={deletingId === v.id}
                      aria-label="Eliminar"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-brand-gray-900/40 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div className="mt-3 flex flex-col gap-1 text-sm text-brand-gray-900/60">
                    <p>
                      <span className="font-semibold text-brand-gray-900/40">Código: </span>
                      {v.codigo}
                    </p>
                    <p>
                      <span className="font-semibold text-brand-gray-900/40">Fecha afiliación: </span>
                      {formatFechaCorta(v.fecha_afiliacion)}
                    </p>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <div className="flex-1">
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-brand-gray-900/40">
                        Rol
                      </label>
                      <select
                        value={v.rol_afiliado}
                        onChange={(e) => handleRolChange(v, e.target.value)}
                        disabled={rolUpdatingId === v.id}
                        className={`w-full ${claseSelectRol}`}
                      >
                        {rolesDb.map((r) => (
                          <option key={r.id} value={r.rol_name}>
                            {r.rol_name.charAt(0).toUpperCase() + r.rol_name.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => handleDescargar(v)}
                        disabled={descargandoId === v.id}
                        title="Descargar Carnet"
                        className="flex h-[34px] w-[34px] items-center justify-center rounded-lg border border-brand-gray-900/15 bg-white text-brand-gray-900/70 transition-colors hover:border-brand-green hover:text-brand-green disabled:opacity-50"
                      >
                        <DownloadCloud size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-5 flex items-center justify-between gap-3">
                <p className="text-xs text-brand-gray-900/50">
                  Página {page} de {totalPages} · {items.length} afiliados
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    aria-label="Página anterior"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-gray-900/15 text-brand-gray-900/60 transition-colors hover:bg-brand-gray-50 disabled:opacity-40"
                  >
                    <ChevronLeft size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    aria-label="Página siguiente"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-gray-900/15 text-brand-gray-900/60 transition-colors hover:bg-brand-gray-50 disabled:opacity-40"
                  >
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Eliminar afiliado"
        message={`¿Eliminar a "${pendingDelete?.nombre_completo ?? ""}"? Va a quedar dado de baja y ya no va a aparecer en esta lista.`}
        confirmLabel="Eliminar"
        confirming={pendingDelete !== null && deletingId === pendingDelete.id}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />

      {carnetTarget && (
        <div className="fixed -left-[9999px] top-0">
          <div className="w-[320px]">
            <CarnetAfiliado
              ref={carnetRef}
              nombreCompleto={carnetTarget.nombre_completo}
              dni={carnetTarget.dni}
              codigo={carnetTarget.codigo}
              fotoUrl={carnetTarget.foto}
              fechaAfiliacion={carnetTarget.fecha_afiliacion}
              rol={carnetTarget.rol_afiliado}
            />
          </div>
        </div>
      )}
    </div>
  );
}
