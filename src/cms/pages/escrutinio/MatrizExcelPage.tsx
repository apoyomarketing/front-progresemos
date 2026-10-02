import { useState, useEffect } from "react";
import { listarLocales, obtenerMatrizEscrutinio } from "../../../api/escrutinio";
import type { LocalVotacion, MatrizElemento } from "../../../api/escrutinio";
import { Download, Search, Filter, FileSpreadsheet, Layers, RefreshCw, Inbox } from "lucide-react";

export default function MatrizExcelPage() {
  const [locales, setLocales] = useState<LocalVotacion[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Hoja / Pestaña Activa: REGIONAL | PROVINCIAL | DISTRITAL
  const [activeSheet, setActiveSheet] = useState<"REGIONAL" | "PROVINCIAL" | "DISTRITAL">("REGIONAL");

  // Filtros
  const filterProvincia = "PUNO";
  const [filterDistrito, setFilterDistrito] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Respuesta enviada por el Endpoint Backend GET /api/escrutinio/matriz/
  const [partidosHeader, setPartidosHeader] = useState<string[]>([]);
  const [matrizRows, setMatrizRows] = useState<MatrizElemento[]>([]);
  const [totalesPorPartido, setTotalesPorPartido] = useState<Record<string, number>>({});
  const [granTotalVotos, setGranTotalVotos] = useState<number>(0);

  useEffect(() => {
    fetchLocales();
  }, []);

  useEffect(() => {
    fetchMatriz();
  }, [activeSheet, filterProvincia, filterDistrito]);

  const fetchLocales = async () => {
    try {
      const data = await listarLocales();
      setLocales(data);
    } catch (err) {
      console.error("Error al cargar locales:", err);
    }
  };

  const fetchMatriz = async () => {
    try {
      setLoading(true);

      const res = await obtenerMatrizEscrutinio({
        provincia: filterProvincia || undefined,
        distrito: filterDistrito || undefined,
        tipo: activeSheet,
      });

      setPartidosHeader(res.partidos || []);
      setMatrizRows(res.matriz || []);
      setTotalesPorPartido(res.totales_partidos || {});
      setGranTotalVotos(res.gran_total_votos || 0);
    } catch (err) {
      console.error("Error al obtener la matriz:", err);
    } finally {
      setLoading(false);
    }
  };

  // Obtener lista única de distritos disponibles
  const distritosDisponibles = Array.from(
    new Set(locales.map((l) => l.distrito).filter(Boolean))
  ).sort();

  // Búsqueda rápida por nombre de colegio, dirección o mesa
  const filteredRows = matrizRows.filter((row) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      row.nombre_local.toLowerCase().includes(term) ||
      row.direccion_local.toLowerCase().includes(term) ||
      String(row.nro_mesa).includes(term)
    );
  });

  // Función para exportar los datos reales recibidos del backend a Excel (.csv)
  const handleExportCSV = () => {
    if (filteredRows.length === 0) {
      setErrorMsg("No hay actas registradas en la matriz para exportar.");
      setTimeout(() => setErrorMsg(null), 4000);
      return;
    }

    const headers = [
      "Distrito",
      "Nombre Local",
      "Dirección Local",
      "Mesa",
      ...partidosHeader,
      "Total Votos",
    ];

    const csvRows = [headers.join(",")];

    filteredRows.forEach((r) => {
      const rowVals = [
        `"${r.distrito}"`,
        `"${r.nombre_local.replace(/"/g, '""')}"`,
        `"${r.direccion_local.replace(/"/g, '""')}"`,
        `"${r.nro_mesa}"`,
        ...partidosHeader.map((p) => r.votos_partidos[p] || 0),
        r.total_votos,
      ];
      csvRows.push(rowVals.join(","));
    });

    // Fila final de totales
    const totalRowVals = [
      '"TOTALES CONSOLIDADOS"',
      '""',
      '""',
      '""',
      '""',
      ...partidosHeader.map((p) => totalesPorPartido[p] || 0),
      granTotalVotos,
    ];
    csvRows.push(totalRowVals.join(","));

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Matriz_Escrutinio_${activeSheet}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Cabecera y Controles */}
      <div className="rounded-2xl border border-brand-gray-200 bg-white p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-gray-100 pb-4">
          <div>
            <h3 className="text-xl font-bold text-brand-gray-900 flex items-center gap-2">
              <FileSpreadsheet className="text-emerald-600" size={24} /> Matriz General de Escrutinio por Mesa
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchMatriz}
              className="flex items-center gap-1.5 rounded-xl border border-brand-gray-300 px-3.5 py-2 text-xs font-semibold text-brand-gray-700 hover:bg-brand-gray-50 transition-colors shadow-sm"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Actualizar
            </button>
            <button
              onClick={handleExportCSV}
              disabled={filteredRows.length === 0}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 transition-all"
            >
              <Download size={16} /> Exportar a Excel (.csv)
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600 border border-red-200">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-brand-gray-700 flex items-center gap-1">
              <Filter size={14} className="text-brand-gray-400" /> Distrito
            </label>
            <select
              value={filterDistrito}
              onChange={(e) => setFilterDistrito(e.target.value)}
              className="w-full rounded-xl border-brand-gray-300 bg-brand-gray-50 p-2.5 text-sm focus:border-brand-green focus:bg-white"
            >
              <option value="">Todos los Distritos</option>
              {distritosDisponibles.map((dist) => (
                <option key={dist} value={dist}>
                  {dist}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-brand-gray-700 flex items-center gap-1">
              <Search size={14} className="text-brand-gray-400" /> Buscar Local o Mesa
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border-brand-gray-300 bg-brand-gray-50 p-2.5 text-sm focus:border-brand-green focus:bg-white"
              placeholder="Nombre del colegio o # de mesa..."
            />
          </div>
        </div>
      </div>

      {/* Selector de 3 Hojas (Tabs) Estilo Excel */}
      <div className="flex items-center gap-1 bg-brand-gray-200/80 p-1.5 rounded-t-2xl border border-b-0 border-brand-gray-300">
        <span className="text-xs font-bold text-brand-gray-600 px-3 flex items-center gap-1">
          <Layers size={14} /> Hojas:
        </span>

        <button
          onClick={() => setActiveSheet("REGIONAL")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${activeSheet === "REGIONAL"
            ? "bg-emerald-600 text-white shadow-md"
            : "bg-white/80 text-brand-gray-700 hover:bg-white"
            }`}
        >
          📄 Hoja 1: Votos Regionales
        </button>

        <button
          onClick={() => setActiveSheet("PROVINCIAL")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${activeSheet === "PROVINCIAL"
            ? "bg-emerald-600 text-white shadow-md"
            : "bg-white/80 text-brand-gray-700 hover:bg-white"
            }`}
        >
          📄 Hoja 2: Votos Provinciales
        </button>

        <button
          onClick={() => setActiveSheet("DISTRITAL")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${activeSheet === "DISTRITAL"
            ? "bg-emerald-600 text-white shadow-md"
            : "bg-white/80 text-brand-gray-700 hover:bg-white"
            }`}
        >
          📄 Hoja 3: Votos Distritales
        </button>
      </div>

      {/* Tabla Matriz Excel */}
      <div className="rounded-b-2xl border border-brand-gray-300 bg-white shadow-sm overflow-x-auto -mt-6">
        {loading ? (
          <div className="text-center py-12 text-brand-gray-500">
            Consultando matriz oficial al servidor...
          </div>
        ) : filteredRows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center p-6 space-y-3">
            <div className="rounded-full bg-brand-gray-100 p-4 text-brand-gray-400">
              <Inbox size={32} />
            </div>
            <h4 className="text-base font-bold text-brand-gray-800">No hay actas registradas</h4>
            <p className="text-xs text-brand-gray-500 max-w-md">
              No se han encontrado registros de la elección <span className="font-bold text-brand-green">{activeSheet}</span>. Al digitalizar actas en el sistema aparecerán aquí automáticamente.
            </p>
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse font-mono">
            {/* Header de la Tabla */}
            <thead>
              <tr className="bg-emerald-800 text-white border-b border-emerald-900 uppercase">
                <th className="px-3 py-3 font-bold border-r border-emerald-700 text-center w-12">#</th>
                <th className="px-4 py-3 font-bold border-r border-emerald-700 whitespace-nowrap">Distrito</th>
                <th className="px-4 py-3 font-bold border-r border-emerald-700 min-w-[200px]">Nombre Local</th>
                <th className="px-4 py-3 font-bold border-r border-emerald-700 min-w-[180px]">Dirección Local</th>
                <th className="px-3 py-3 font-bold border-r border-emerald-700 text-center w-16 whitespace-nowrap">
                  Mesa
                </th>

                {/* Columnas de Partidos Enviadas por la API */}
                {partidosHeader.map((partido, pIdx) => (
                  <th
                    key={pIdx}
                    className="px-4 py-3 font-bold border-r border-emerald-700 text-right whitespace-nowrap bg-emerald-900/60"
                  >
                    {partido}
                  </th>
                ))}

                <th className="px-4 py-3 font-bold text-right whitespace-nowrap bg-emerald-950">Total Votos</th>
              </tr>
            </thead>

            {/* Cuerpo de Filas Enviadas por el Backend */}
            <tbody className="divide-y divide-brand-gray-200">
              {filteredRows.map((row, idx) => (
                <tr
                  key={`${row.id_local}-${row.nro_mesa}-${idx}`}
                  className={`hover:bg-amber-50/80 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-brand-gray-50/60"
                    }`}
                >
                  <td className="px-3 py-2 text-center text-brand-gray-400 font-sans border-r border-brand-gray-200 bg-brand-gray-100/50">
                    {idx + 1}
                  </td>
                  <td className="px-4 py-2 text-brand-gray-800 border-r border-brand-gray-200 whitespace-nowrap">
                    {row.distrito}
                  </td>
                  <td className="px-4 py-2 font-semibold text-brand-gray-900 border-r border-brand-gray-200">
                    {row.nombre_local}
                  </td>
                  <td className="px-4 py-2 text-brand-gray-600 border-r border-brand-gray-200 text-[11px]">
                    {row.direccion_local}
                  </td>
                  <td className="px-3 py-2 text-center font-bold text-emerald-700 border-r border-brand-gray-200 bg-emerald-50/30">
                    {row.nro_mesa}
                  </td>

                  {/* Votos por Partido */}
                  {partidosHeader.map((partido, pIdx) => {
                    const cant = row.votos_partidos ? row.votos_partidos[partido] || 0 : 0;
                    return (
                      <td
                        key={pIdx}
                        className={`px-4 py-2 text-right font-medium border-r border-brand-gray-200 ${cant > 0 ? "text-brand-gray-900 font-bold" : "text-brand-gray-400"
                          }`}
                      >
                        {cant.toLocaleString()}
                      </td>
                    );
                  })}

                  {/* Total Votos de la Mesa */}
                  <td className="px-4 py-2 text-right font-bold text-emerald-900 bg-emerald-100/50">
                    {row.total_votos.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>

            {/* Fila de Totales Generales (Respuesta API) */}
            <tfoot>
              <tr className="bg-emerald-900 text-white font-bold border-t-2 border-emerald-950">
                <td colSpan={4} className="px-4 py-3 text-right uppercase border-r border-emerald-800">
                  TOTALES CONSOLIDADOS ({activeSheet}):
                </td>
                <td className="px-3 py-3 text-center border-r border-emerald-800 bg-emerald-950">
                  {filteredRows.length} actas
                </td>

                {partidosHeader.map((partido, pIdx) => (
                  <td key={pIdx} className="px-4 py-3 text-right border-r border-emerald-800 bg-emerald-950">
                    {(totalesPorPartido[partido] || 0).toLocaleString()}
                  </td>
                ))}

                <td className="px-4 py-3 text-right bg-emerald-950 text-amber-300 text-sm">
                  {granTotalVotos.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  );
}
