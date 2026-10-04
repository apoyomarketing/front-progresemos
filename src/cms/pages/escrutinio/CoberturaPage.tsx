import { useState, useEffect, useMemo } from "react";
import { obtenerCoberturaMesas, listarLocales } from "../../../api/escrutinio";
import type { CoberturaLocal, CoberturaRespuesta, LocalVotacion } from "../../../api/escrutinio";
import {
  MapPin,
  Building2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Clock,
  TrendingUp,
  LayoutGrid,
  ChevronDown,
  ChevronUp,
  Search,
} from "lucide-react";

// ─── helpers ────────────────────────────────────────────────────────────────

function pctColor(pct: number) {
  if (pct >= 90) return "text-emerald-600";
  if (pct >= 50) return "text-amber-600";
  return "text-red-600";
}

function pctBg(pct: number) {
  if (pct >= 90) return "bg-emerald-500";
  if (pct >= 50) return "bg-amber-500";
  return "bg-red-500";
}

function pctBadgeBg(pct: number) {
  if (pct >= 90) return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (pct >= 50) return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-red-50 text-red-700 border-red-200";
}

function StatusIcon({ pct }: { pct: number }) {
  if (pct >= 90) return <CheckCircle2 size={16} className="text-emerald-500" />;
  if (pct >= 50) return <Clock size={16} className="text-amber-500" />;
  return <AlertCircle size={16} className="text-red-500" />;
}

type SortKey = keyof Pick<
  CoberturaLocal,
  "nombre_local" | "mesas_esperadas" | "mesas_registradas" | "mesas_faltantes" | "pct_cobertura"
>;

// ─── component ──────────────────────────────────────────────────────────────

export default function CoberturaPage() {
  const [allLocales, setAllLocales] = useState<LocalVotacion[]>([]);
  const [selectedDistrito, setSelectedDistrito] = useState("");
  const [selectedLocal, setSelectedLocal] = useState("");
  const [search, setSearch] = useState("");

  const [data, setData] = useState<CoberturaRespuesta | null>(null);
  const [loading, setLoading] = useState(true);   // true desde el inicio
  const [error, setError] = useState<string | null>(null);

  const [sortKey, setSortKey] = useState<SortKey>("pct_cobertura");
  const [sortAsc, setSortAsc] = useState(true);

  // Cargar locales una sola vez para los filtros
  useEffect(() => {
    listarLocales()
      .then(setAllLocales)
      .catch(() => {});
  }, []);

  const distritosDisponibles = useMemo(
    () => [...new Set(allLocales.map((l) => l.distrito).filter(Boolean))].sort(),
    [allLocales]
  );

  const localesFiltrados = useMemo(
    () => allLocales.filter((l) => l.distrito === selectedDistrito),
    [allLocales, selectedDistrito]
  );

  // Auto-fetch cada vez que cambian los filtros (closure correcto: valores dentro del effect)
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const params: { distrito?: string; id_local?: number } = {};
    if (selectedDistrito) params.distrito = selectedDistrito;
    if (selectedLocal) params.id_local = Number(selectedLocal);

    obtenerCoberturaMesas(params)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err: any) => {
        if (!cancelled) {
          const msg =
            err?.message ||
            "No se pudo conectar con el servidor. Verifique que el endpoint /escrutinio/cobertura/ esté disponible en el backend.";
          setError(msg);
          setData(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [selectedDistrito, selectedLocal]);

  // Función manual de reintento (usa los valores actuales de los filtros via re-render)
  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setData(null);

    const params: { distrito?: string; id_local?: number } = {};
    if (selectedDistrito) params.distrito = selectedDistrito;
    if (selectedLocal) params.id_local = Number(selectedLocal);

    obtenerCoberturaMesas(params)
      .then(setData)
      .catch((err: any) => {
        const msg =
          err?.message ||
          "No se pudo conectar con el servidor.";
        setError(msg);
      })
      .finally(() => setLoading(false));
  };



  // Tabla con búsqueda + ordenamiento
  const tableRows = useMemo(() => {
    if (!data) return [];
    let rows = [...data.locales];

    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.nombre_local.toLowerCase().includes(q) ||
          r.distrito.toLowerCase().includes(q)
      );
    }

    rows.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "number" && typeof bv === "number")
        return sortAsc ? av - bv : bv - av;
      return sortAsc
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });

    return rows;
  }, [data, search, sortKey, sortAsc]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc((v) => !v);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey === col ? (
      sortAsc ? (
        <ChevronUp size={13} />
      ) : (
        <ChevronDown size={13} />
      )
    ) : (
      <ChevronDown size={13} className="opacity-30" />
    );

  const resumen = data?.resumen;

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────── */}
      <div className="rounded-2xl border border-brand-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-gray-100 pb-5 mb-5">
          <div>
            <h3 className="text-xl font-bold text-brand-gray-900">
              Cobertura de Mesas
            </h3>
            <p className="text-sm text-brand-gray-500 mt-1">
              Seguimiento de mesas registradas vs. esperadas por local de
              votación.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-brand-green/10 px-3 py-1.5 text-xs font-semibold text-brand-green">
            <TrendingUp size={16} /> Reporte de Avance
          </div>
        </div>

        {/* ── Filtros ──────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Distrito */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-brand-gray-700 flex items-center gap-1.5">
              <MapPin size={14} className="text-brand-green" /> Distrito
            </label>
            <select
              value={selectedDistrito}
              onChange={(e) => {
                setSelectedDistrito(e.target.value);
                setSelectedLocal("");
              }}
              className="w-full rounded-xl border-brand-gray-300 bg-white p-2.5 text-sm focus:border-brand-green focus:ring-brand-green shadow-sm"
            >
              <option value="">Todos los distritos</option>
              {distritosDisponibles.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Local */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-brand-gray-700 flex items-center gap-1.5">
              <Building2 size={14} className="text-brand-green" /> Local
            </label>
            <select
              value={selectedLocal}
              onChange={(e) => setSelectedLocal(e.target.value)}
              disabled={!selectedDistrito}
              className="w-full rounded-xl border-brand-gray-300 bg-white p-2.5 text-sm focus:border-brand-green focus:ring-brand-green shadow-sm disabled:bg-brand-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">
                {selectedDistrito ? "Todos los locales" : "Primero elige distrito…"}
              </option>
              {localesFiltrados.map((l) => (
                <option key={l.id_local} value={l.id_local}>
                  {l.nombre_local}
                </option>
              ))}
            </select>
          </div>

          {/* Botón actualizar */}
          <div className="flex items-end">
            <button
              onClick={handleRetry}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-green px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-brand-green-dark disabled:opacity-50 transition-all"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
              {loading ? "Actualizando…" : "Actualizar"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Error ──────────────────────────────────────── */}
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm font-semibold text-red-600 flex items-center gap-2">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {/* ── KPIs de Resumen ────────────────────────────── */}
      {resumen && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {(
            [
              {
                label: "Locales",
                value: resumen.total_locales,
                icon: LayoutGrid,
                color: "text-indigo-600",
                bg: "bg-indigo-50",
              },
              {
                label: "Esperadas",
                value: resumen.total_mesas_esperadas,
                icon: Building2,
                color: "text-brand-gray-700",
                bg: "bg-brand-gray-50",
              },
              {
                label: "Registradas",
                value: resumen.total_mesas_registradas,
                icon: CheckCircle2,
                color: "text-emerald-600",
                bg: "bg-emerald-50",
              },
              {
                label: "Faltantes",
                value: resumen.total_mesas_faltantes,
                icon: Clock,
                color: "text-amber-600",
                bg: "bg-amber-50",
              },
              {
                label: "% Cobertura",
                value: `${resumen.pct_cobertura_global.toFixed(1)}%`,
                icon: TrendingUp,
                color: pctColor(resumen.pct_cobertura_global),
                bg:
                  resumen.pct_cobertura_global >= 90
                    ? "bg-emerald-50"
                    : resumen.pct_cobertura_global >= 50
                    ? "bg-amber-50"
                    : "bg-red-50",
              },
            ] as const
          ).map(({ label, value, icon: Icon, color, bg }) => (
            <div
              key={label}
              className="rounded-2xl border border-brand-gray-200 bg-white p-5 shadow-sm flex flex-col gap-3"
            >
              <div
                className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center`}
              >
                <Icon size={18} className={color} />
              </div>
              <div>
                <p className="text-xs font-semibold text-brand-gray-500 uppercase tracking-wide">
                  {label}
                </p>
                <p className={`text-2xl font-extrabold mt-0.5 ${color}`}>
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Barra de Progreso Global ────────────────────── */}
      {resumen && (
        <div className="rounded-2xl border border-brand-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-brand-gray-700">
              Progreso Global de Cobertura
            </span>
            <span
              className={`text-sm font-extrabold ${pctColor(
                resumen.pct_cobertura_global
              )}`}
            >
              {resumen.pct_cobertura_global.toFixed(1)}%
            </span>
          </div>
          <div className="h-4 w-full rounded-full bg-brand-gray-100 overflow-hidden">
            <div
              className={`h-4 rounded-full transition-all duration-700 ${pctBg(
                resumen.pct_cobertura_global
              )}`}
              style={{ width: `${Math.min(resumen.pct_cobertura_global, 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-brand-gray-400">
            <span>{resumen.total_mesas_registradas} registradas</span>
            <span>{resumen.total_mesas_faltantes} faltantes</span>
          </div>
        </div>
      )}

      {/* ── Tabla por Local ────────────────────────────── */}
      {data && (
        <div className="rounded-2xl border border-brand-gray-200 bg-white shadow-sm overflow-hidden">
          {/* Buscador */}
          <div className="flex items-center gap-3 border-b border-brand-gray-100 px-5 py-4">
            <Search size={16} className="text-brand-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por local o distrito…"
              className="flex-1 text-sm outline-none placeholder:text-brand-gray-400"
            />
            <span className="text-xs text-brand-gray-400 font-medium">
              {tableRows.length} locales
            </span>
          </div>

          {/* Tabla */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-gray-100 bg-brand-gray-50 text-left">
                  {(
                    [
                      { key: "nombre_local" as SortKey, label: "Local" },
                      { key: "mesas_esperadas" as SortKey, label: "Esperadas" },
                      {
                        key: "mesas_registradas" as SortKey,
                        label: "Registradas",
                      },
                      {
                        key: "mesas_faltantes" as SortKey,
                        label: "Faltantes",
                      },
                      { key: "pct_cobertura" as SortKey, label: "Cobertura" },
                    ]
                  ).map(({ key, label }) => (
                    <th
                      key={key}
                      onClick={() => toggleSort(key)}
                      className="px-5 py-3.5 text-xs font-semibold text-brand-gray-500 uppercase tracking-wide cursor-pointer select-none hover:text-brand-gray-800 transition-colors"
                    >
                      <span className="flex items-center gap-1">
                        {label} <SortIcon col={key} />
                      </span>
                    </th>
                  ))}
                  <th className="px-5 py-3.5 text-xs font-semibold text-brand-gray-500 uppercase tracking-wide">
                    Progreso
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-brand-gray-500 uppercase tracking-wide">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-12 text-center text-brand-gray-400 text-sm"
                    >
                      No hay datos para mostrar.
                    </td>
                  </tr>
                ) : (
                  tableRows.map((row, i) => (
                    <tr
                      key={row.id_local}
                      className={`border-b border-brand-gray-100 transition-colors hover:bg-brand-gray-50 ${
                        i % 2 === 0 ? "bg-white" : "bg-brand-gray-50/40"
                      }`}
                    >
                      {/* Local + Distrito */}
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-brand-gray-900 truncate max-w-[220px]">
                          {row.nombre_local}
                        </p>
                        <p className="text-xs text-brand-gray-400 mt-0.5">
                          {row.distrito}
                        </p>
                      </td>

                      {/* Mesas esperadas */}
                      <td className="px-5 py-3.5 text-center font-mono font-semibold text-brand-gray-700">
                        {row.mesas_esperadas}
                      </td>

                      {/* Registradas */}
                      <td className="px-5 py-3.5 text-center font-mono font-semibold text-emerald-600">
                        {row.mesas_registradas}
                      </td>

                      {/* Faltantes */}
                      <td className="px-5 py-3.5 text-center font-mono font-semibold text-amber-600">
                        {row.mesas_faltantes}
                      </td>

                      {/* % Cobertura */}
                      <td className="px-5 py-3.5 text-center">
                        <span
                          className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-bold ${pctBadgeBg(
                            row.pct_cobertura
                          )}`}
                        >
                          {row.pct_cobertura.toFixed(1)}%
                        </span>
                      </td>

                      {/* Barra de progreso */}
                      <td className="px-5 py-3.5">
                        <div className="w-28 h-2.5 rounded-full bg-brand-gray-100 overflow-hidden">
                          <div
                            className={`h-2.5 rounded-full ${pctBg(
                              row.pct_cobertura
                            )}`}
                            style={{
                              width: `${Math.min(row.pct_cobertura, 100)}%`,
                            }}
                          />
                        </div>
                      </td>

                      {/* Estado */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <StatusIcon pct={row.pct_cobertura} />
                          <span className="text-xs font-semibold text-brand-gray-600">
                            {row.pct_cobertura >= 90
                              ? "Completo"
                              : row.pct_cobertura >= 50
                              ? "Parcial"
                              : "Pendiente"}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Skeleton / Loading inicial */}
      {loading && !data && !error && (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-14 rounded-xl bg-brand-gray-100 animate-pulse"
            />
          ))}
          <p className="text-center text-xs text-brand-gray-400 pt-2">
            Cargando datos de cobertura…
          </p>
        </div>
      )}

      {/* Estado vacío: fetch terminó sin datos ni error */}
      {!loading && !data && !error && (
        <div className="rounded-2xl border border-brand-gray-200 bg-white p-12 text-center shadow-sm">
          <LayoutGrid size={40} className="mx-auto text-brand-gray-300 mb-4" />
          <p className="text-brand-gray-600 font-semibold">Sin datos de cobertura</p>
          <p className="text-sm text-brand-gray-400 mt-1">
            El servidor no devolvió información. Verifique que el endpoint
            <code className="mx-1 rounded bg-brand-gray-100 px-1.5 py-0.5 font-mono text-xs">
              GET /escrutinio/cobertura/
            </code>
            esté implementado.
          </p>
          <button
            onClick={handleRetry}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-green px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-green-dark transition-all shadow-sm"
          >
            <RefreshCw size={15} /> Reintentar
          </button>
        </div>
      )}
    </div>
  );
}

