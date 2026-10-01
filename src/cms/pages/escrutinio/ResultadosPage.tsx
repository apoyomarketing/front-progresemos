import { useState, useEffect } from "react";
import {
  obtenerDashboardResultados,
  listarLocales,
} from "../../../api/escrutinio";
import type { LocalVotacion } from "../../../api/escrutinio";
import { BarChart3, Building2, MapPin, Vote, Trophy, PieChart } from "lucide-react";

interface PartyResultItem {
  nombre_partido: string;
  total_votos: number;
  porcentaje: number;
}

export default function ResultadosPage() {
  // Modos de vista: provincial | distrito | local | mesa
  const [viewMode, setViewMode] = useState<"provincial" | "distrito" | "local" | "mesa">("provincial");
  const [tipo, setTipo] = useState<string>("PROVINCIAL");
  const [provincia, setProvincia] = useState("PUNO");

  // Filtros dependientes
  const [locales, setLocales] = useState<LocalVotacion[]>([]);
  const [selectedDistrito, setSelectedDistrito] = useState<string>("");
  const [selectedLocal, setSelectedLocal] = useState<string>("");
  const [selectedMesa, setSelectedMesa] = useState<string>("");

  // Respuestas del Endpoint Backend GET /api/escrutinio/resultados/dashboard/
  const [resultados, setResultados] = useState<PartyResultItem[]>([]);
  const [totalEmitido, setTotalEmitido] = useState<number>(0);
  const [electoresHabiles, setElectoresHabiles] = useState<number>(0);
  const [pctParticipacion, setPctParticipacion] = useState<number>(0);
  const [partidoLider, setPartidoLider] = useState<{
    nombre_partido: string;
    total_votos: number;
    porcentaje: number;
  } | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    listarLocales()
      .then(setLocales)
      .catch(() => alert("Error al cargar locales"));
  }, []);

  // Obtener lista única de distritos disponibles
  const distritosDisponibles = Array.from(
    new Set(locales.map((l) => l.distrito).filter(Boolean))
  ).sort();

  // Locales filtrados por distrito seleccionado
  const localesFiltrados = locales.filter((l) => l.distrito === selectedDistrito);

  useEffect(() => {
    fetchResultados();
  }, [viewMode, tipo, provincia, selectedDistrito, selectedLocal, selectedMesa]);

  const fetchResultados = async () => {
    try {
      setLoading(true);

      const res = await obtenerDashboardResultados({
        tipo,
        modo: viewMode,
        provincia: provincia || undefined,
        distrito: selectedDistrito || undefined,
        id_local: selectedLocal ? Number(selectedLocal) : undefined,
        nro_mesa: selectedMesa || undefined,
      });

      if (res) {
        setResultados(res.resultados_partidos || []);
        setTotalEmitido(res.total_emitido || 0);
        setElectoresHabiles(res.electores_habiles || 0);
        setPctParticipacion(res.pct_participacion || 0);
        setPartidoLider(res.partido_lider || null);
      } else {
        setResultados([]);
        setTotalEmitido(0);
        setElectoresHabiles(0);
        setPctParticipacion(0);
        setPartidoLider(null);
      }
    } catch (err) {
      console.error("Error cargando resultados del dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tarjeta Principal de Filtros */}
      <div className="rounded-2xl border border-brand-gray-200 bg-white p-6 shadow-sm space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-brand-gray-100 pb-4">
          <div>
            <h3 className="text-xl font-bold text-brand-gray-900 flex items-center gap-2">
              <PieChart className="text-brand-green" size={24} /> Dashboard de Resultados Electorales
            </h3>
          </div>

          {/* Modos de Filtrado */}
          <div className="flex bg-brand-gray-100/80 p-1 rounded-xl border border-brand-gray-200">
            <button
              onClick={() => setViewMode("provincial")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${viewMode === "provincial"
                  ? "bg-white text-brand-green shadow-sm"
                  : "text-brand-gray-600 hover:text-brand-gray-900"
                }`}
            >
              <Building2 size={14} /> Provincial
            </button>
            <button
              onClick={() => setViewMode("distrito")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${viewMode === "distrito"
                  ? "bg-white text-brand-green shadow-sm"
                  : "text-brand-gray-600 hover:text-brand-gray-900"
                }`}
            >
              <MapPin size={14} /> Por Distrito
            </button>
            <button
              onClick={() => setViewMode("local")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${viewMode === "local"
                  ? "bg-white text-brand-green shadow-sm"
                  : "text-brand-gray-600 hover:text-brand-gray-900"
                }`}
            >
              <Building2 size={14} /> Por Local
            </button>
            <button
              onClick={() => setViewMode("mesa")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${viewMode === "mesa"
                  ? "bg-white text-brand-green shadow-sm"
                  : "text-brand-gray-600 hover:text-brand-gray-900"
                }`}
            >
              <Vote size={14} /> Por Mesa
            </button>
          </div>
        </div>

        {/* Fila de Controles Dinámicos */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          {/* Tipo Elección */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-brand-gray-700">Tipo de Elección</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full rounded-xl border-brand-gray-300 p-2.5 text-sm focus:border-brand-green focus:ring-brand-green bg-brand-gray-50"
            >
              <option value="REGIONAL">REGIONAL</option>
              <option value="PROVINCIAL">PROVINCIAL</option>
              <option value="DISTRITAL">DISTRITAL</option>
            </select>
          </div>

          {/* Provincia */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-brand-gray-700">Provincia</label>
            <input
              type="text"
              value={provincia}
              onChange={(e) => setProvincia(e.target.value.toUpperCase())}
              className="w-full rounded-xl border-brand-gray-300 p-2.5 text-sm focus:border-brand-green focus:ring-brand-green bg-brand-gray-50"
              placeholder="Ej. PUNO"
            />
          </div>

          {/* Selector de Distrito (si aplica) */}
          {(viewMode === "distrito" || viewMode === "local" || viewMode === "mesa") && (
            <div>
              <label className="mb-1 block text-xs font-semibold text-brand-gray-700">Distrito</label>
              <select
                value={selectedDistrito}
                onChange={(e) => {
                  setSelectedDistrito(e.target.value);
                  setSelectedLocal("");
                  setSelectedMesa("");
                }}
                className="w-full rounded-xl border-brand-gray-300 p-2.5 text-sm focus:border-brand-green focus:ring-brand-green bg-brand-gray-50"
              >
                <option value="">Seleccione Distrito...</option>
                {distritosDisponibles.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Selector de Local (si aplica) */}
          {(viewMode === "local" || viewMode === "mesa") && (
            <div>
              <label className="mb-1 block text-xs font-semibold text-brand-gray-700">Local de Votación</label>
              <select
                value={selectedLocal}
                onChange={(e) => {
                  setSelectedLocal(e.target.value);
                  setSelectedMesa("");
                }}
                disabled={!selectedDistrito}
                className="w-full rounded-xl border-brand-gray-300 p-2.5 text-sm focus:border-brand-green focus:ring-brand-green bg-brand-gray-50 disabled:opacity-50"
              >
                <option value="">Seleccione Local...</option>
                {localesFiltrados.map((l) => (
                  <option key={l.id_local} value={l.id_local}>
                    {l.nombre_local}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Selector de Mesa (si aplica) */}
          {viewMode === "mesa" && (
            <div>
              <label className="mb-1 block text-xs font-semibold text-brand-gray-700">Número de Mesa</label>
              <input
                type="text"
                value={selectedMesa}
                onChange={(e) => setSelectedMesa(e.target.value)}
                disabled={!selectedLocal}
                className="w-full rounded-xl border-brand-gray-300 p-2.5 text-sm focus:border-brand-green focus:ring-brand-green bg-brand-gray-50 disabled:opacity-50"
                placeholder="Ej. 1"
              />
            </div>
          )}
        </div>
      </div>

      {/* KPI Cards / Indicadores Clave */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-brand-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-gray-500 uppercase tracking-wider">Total Votos Emitidos</span>
            <div className="p-2 rounded-xl bg-brand-green/10 text-brand-green">
              <Vote size={20} />
            </div>
          </div>
          <p className="mt-2 text-3xl font-extrabold text-brand-gray-900">{totalEmitido.toLocaleString()}</p>
          <span className="text-xs text-brand-gray-400 mt-1 block">Votos totales procesados</span>
        </div>

        <div className="rounded-2xl border border-brand-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-gray-500 uppercase tracking-wider">Electores Hábiles</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600">
              <Building2 size={20} />
            </div>
          </div>
          <p className="mt-2 text-3xl font-extrabold text-brand-gray-900">{electoresHabiles.toLocaleString()}</p>
          <span className="text-xs text-brand-gray-400 mt-1 block">Padrón del ámbito</span>
        </div>

        <div className="rounded-2xl border border-brand-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-gray-500 uppercase tracking-wider">Participación</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
              <PieChart size={20} />
            </div>
          </div>
          <p className="mt-2 text-3xl font-extrabold text-emerald-700">{pctParticipacion}%</p>
          <span className="text-xs text-brand-gray-400 mt-1 block">% de avance / emitidos</span>
        </div>

        <div className="rounded-2xl border border-brand-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-gray-500 uppercase tracking-wider">Primer Lugar / Líder</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
              <Trophy size={20} />
            </div>
          </div>
          <p className="mt-2 text-lg font-bold text-brand-gray-900 truncate">
            {partidoLider ? partidoLider.nombre_partido : "Sin datos"}
          </p>
          <span className="text-xs font-bold text-emerald-600 mt-1 block">
            {partidoLider ? `${partidoLider.porcentaje}% (${partidoLider.total_votos.toLocaleString()} votos)` : "-"}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-brand-gray-500">Cargando dashboard del servidor...</div>
      ) : resultados.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* GRÁFICO VISUAL DE BARRAS POR PARTIDO */}
          <div className="lg:col-span-2 rounded-2xl border border-brand-gray-200 bg-white p-6 shadow-sm space-y-6">
            <h4 className="text-lg font-bold text-brand-gray-900 flex items-center gap-2">
              <BarChart3 size={20} className="text-brand-green" /> Gráfico de Distribución de Votos
            </h4>

            <div className="space-y-4">
              {resultados.map((partido, index) => {
                const isProgresemos = partido.nombre_partido.toUpperCase().includes("PROGRESEMOS");

                return (
                  <div key={index} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center gap-2">
                        <span className="w-5 text-center font-bold text-brand-gray-400">#{index + 1}</span>
                        <span className={`font-bold ${isProgresemos ? "text-brand-green-dark font-extrabold" : "text-brand-gray-800"}`}>
                          {partido.nombre_partido}
                        </span>
                        {isProgresemos && (
                          <span className="rounded-full bg-brand-green text-white px-2 py-0.5 text-[10px] font-bold">
                            NUESTRO PARTIDO
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-brand-gray-900">{partido.total_votos.toLocaleString()} votos</span>
                        <span className="text-brand-gray-400 ml-2">({partido.porcentaje}%)</span>
                      </div>
                    </div>

                    {/* Barra Visual */}
                    <div className="w-full h-4 bg-brand-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${isProgresemos
                            ? "bg-gradient-to-r from-emerald-500 to-green-600 shadow-sm"
                            : index === 0
                              ? "bg-blue-600"
                              : index === 1
                                ? "bg-amber-500"
                                : "bg-brand-gray-400"
                          }`}
                        style={{ width: `${Math.max(partido.porcentaje, 2)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* TABLA DE RESULTADOS DESGLOSADA */}
          <div className="rounded-2xl border border-brand-gray-200 bg-white shadow-sm overflow-hidden flex flex-col justify-between">
            <div>
              <div className="p-4 border-b border-brand-gray-100 bg-brand-gray-50/50">
                <h4 className="font-bold text-brand-gray-900 text-sm">Tabla Detallada de Posiciones</h4>
              </div>
              <table className="w-full text-left text-sm text-brand-gray-600">
                <thead className="bg-brand-gray-50 text-[11px] uppercase text-brand-gray-700">
                  <tr>
                    <th className="px-4 py-3 font-semibold w-10">#</th>
                    <th className="px-4 py-3 font-semibold">Partido</th>
                    <th className="px-4 py-3 font-semibold text-right">Votos</th>
                    <th className="px-4 py-3 font-semibold text-right">%</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-gray-100 text-xs">
                  {resultados.map((res, i) => (
                    <tr key={i} className="hover:bg-brand-gray-50/80">
                      <td className="px-4 py-3 font-bold text-brand-gray-400">{i + 1}</td>
                      <td className="px-4 py-3 font-semibold text-brand-gray-900">{res.nombre_partido}</td>
                      <td className="px-4 py-3 text-right font-extrabold text-brand-green-dark">
                        {res.total_votos.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-brand-gray-600">{res.porcentaje}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-brand-gray-50 border-t border-brand-gray-100 text-xs text-brand-gray-500 text-center">
              Total Votos Sumados: <strong className="text-brand-gray-900">{totalEmitido.toLocaleString()}</strong>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border border-brand-gray-200 text-brand-gray-500">
          No hay datos registrados para la consulta realizada. Seleccione los filtros correspondientes.
        </div>
      )}
    </div>
  );
}
