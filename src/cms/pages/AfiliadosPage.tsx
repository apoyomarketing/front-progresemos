import { useEffect, useState, type FormEvent } from "react";
import { Search, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "../../api/AuthProvider";
import { ApiError } from "../../api/client";
import {
  buscarVoluntarios,
  actualizarRolVoluntario,
  eliminarVoluntario,
  ROLES_AFILIADO,
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

  function buscar(filtros: { dni?: string; nombre?: string }) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    buscar({ dni: dni.trim() || undefined, nombre: nombre.trim() || undefined });
  }

  function limpiarBusqueda() {
    setDni("");
    setNombre("");
    buscar({});
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
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 rounded-full bg-brand-green px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-green-dark"
        >
          <Search size={15} /> Buscar
        </button>
        {(dni || nombre) && (
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
            {/* Tabla — tablet y desktop */}
            <div className="hidden overflow-x-auto rounded-2xl border border-brand-gray-900/10 bg-white shadow-sm md:block">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-brand-gray-900/10 bg-brand-gray-50">
                    <th className="w-14 px-5 py-3.5" />
                    <th className="whitespace-nowrap px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-brand-gray-900/50">
                      Nombre
                    </th>
                    <th className="whitespace-nowrap px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-brand-gray-900/50">
                      DNI
                    </th>
                    <th className="whitespace-nowrap px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-brand-gray-900/50">
                      Código
                    </th>
                    <th className="whitespace-nowrap px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-brand-gray-900/50">
                      Fecha afiliación
                    </th>
                    <th className="whitespace-nowrap px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-brand-gray-900/50">
                      Rol
                    </th>
                    <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-brand-gray-900/50">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((v) => (
                    <tr
                      key={v.id}
                      className="border-b border-brand-gray-900/10 last:border-b-0 even:bg-brand-gray-50/40 hover:bg-brand-gray-50"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-brand-green/10 text-xs font-bold text-brand-green-dark">
                          {v.foto ? (
                            <img src={v.foto} alt="" className="h-full w-full object-cover" />
                          ) : (
                            iniciales(v.nombre_completo)
                          )}
                        </div>
                      </td>
                      <td className="max-w-[16rem] truncate px-5 py-3.5 font-semibold text-brand-gray-900">
                        {v.nombre_completo}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-brand-gray-900/70">{v.dni}</td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-brand-gray-900/70">{v.codigo}</td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-brand-gray-900/70">
                        {formatFechaCorta(v.fecha_afiliacion)}
                      </td>
                      <td className="px-5 py-3.5">
                        <select
                          value={v.rol_afiliado}
                          onChange={(e) => handleRolChange(v, e.target.value)}
                          disabled={rolUpdatingId === v.id}
                          className={claseSelectRol}
                        >
                          {ROLES_AFILIADO.map((r) => (
                            <option key={r.value} value={r.value}>
                              {r.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setPendingDelete(v)}
                            disabled={deletingId === v.id}
                            aria-label="Eliminar"
                            className="flex h-8 w-8 items-center justify-center rounded-full text-brand-gray-900/50 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tarjetas apiladas — mobile */}
            <div className="flex flex-col gap-3 md:hidden">
              {pageItems.map((v) => (
                <div key={v.id} className="rounded-2xl border border-brand-gray-900/10 bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-green/10 text-xs font-bold text-brand-green-dark">
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

                  <div className="mt-3">
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-brand-gray-900/40">
                      Rol
                    </label>
                    <select
                      value={v.rol_afiliado}
                      onChange={(e) => handleRolChange(v, e.target.value)}
                      disabled={rolUpdatingId === v.id}
                      className={`w-full ${claseSelectRol}`}
                    >
                      {ROLES_AFILIADO.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-4 flex items-center gap-2 border-t border-brand-gray-900/10 pt-3">
                    <button
                      type="button"
                      onClick={() => setPendingDelete(v)}
                      disabled={deletingId === v.id}
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-brand-gray-900/60 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
                    >
                      <Trash2 size={14} /> Eliminar
                    </button>
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
    </div>
  );
}
