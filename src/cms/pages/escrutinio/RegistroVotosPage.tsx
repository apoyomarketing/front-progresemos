import { useState, useEffect, useCallback } from "react";
import type { FormEvent } from "react";
import {
  listarLocales,
  listarPartidos,
  registrarVotos,
  consultarEstadoMesa,
} from "../../../api/escrutinio";
import type {
  LocalVotacion,
  Partido,
  VotosPayload,
} from "../../../api/escrutinio";
import { useAuth } from "../../../api/AuthProvider";
import {
  Plus,
  Trash2,
  Save,
  AlertCircle,
  X,
  Check,
  MapPin,
  Building2,
  Vote,
  Search,
  CheckCircle2,
  Loader2,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Partidos pre-cargados por defecto según tipo de elección.
// Se usan los IDs exactos de la base de datos para mayor fiabilidad.
// El dropdown sigue mostrando TODOS los partidos del API.
//
// IDs de referencia:
//  1  SOMOS PERU                        6  ASI - JUNTOS POR EL PERU
//  2  PARTIDO CIVICO OBRAS              7  PAIS PARA TODOS
//  3  AHORA NACION                      8  PROGRESEMOS
//  4  ALIANZA ELECTORAL VENCEREMOS      9  PERU PRIMERO
//  5  SALVEMOS AL PERU                 10  PUEBLO CONSCIENTE
//                                      99  VOTOS EN BLANCO
//                                     100  VOTOS NULOS
//                                     101  VOTOS IMPUGNADOS
// ---------------------------------------------------------------------------

/** IDs pre-cargados para REGIONAL y CONSEJERO */
const PRELOAD_BASE_IDS = [2, 9, 7, 3, 8, 10, 1, 4, 6, 99, 100, 101];

/** IDs adicionales para PROVINCIAL y DISTRITAL */
const PRELOAD_EXTRA_IDS = [5, 17]; // SALVEMOS AL PERU // PODEMOS PERU

/** Devuelve los partidos que deben pre-cargarse como filas por defecto,
 *  respetando el orden definido en los arrays de IDs. */
const getPreloadPartidos = (
  partidos: Partido[],
  tipo: "REGIONAL" | "CONSEJERO" | "PROVINCIAL" | "DISTRITAL"
): Partido[] => {
  const ids =
    tipo === "PROVINCIAL" || tipo === "DISTRITAL"
      ? [...PRELOAD_BASE_IDS, ...PRELOAD_EXTRA_IDS]
      : PRELOAD_BASE_IDS;
  return ids
    .map((id) => partidos.find((p) => p.id_partido === id))
    .filter((p): p is Partido => p !== undefined);
};

type TipoEleccion = "REGIONAL" | "CONSEJERO" | "PROVINCIAL" | "DISTRITAL";

interface VotoRow {
  id_partido: string;
  cant_voto: string;
}

export default function RegistroVotosPage() {
  const { session } = useAuth();

  const [allLocales, setAllLocales] = useState<LocalVotacion[]>([]);
  const [partidosList, setPartidosList] = useState<Partido[]>([]);
  const [loadingLocales, setLoadingLocales] = useState(false);

  // Selección de Ubicación
  const [selectedDistrito, setSelectedDistrito] = useState<string>("");
  const [selectedLocal, setSelectedLocal] = useState<string>("");
  const [nroMesa, setNroMesa] = useState<string>("");

  // Tab de Conteo por Elección
  const [activeTab, setActiveTab] = useState<TipoEleccion>("REGIONAL");

  // Estado de la mesa: qué tipos ya fueron registrados en el back
  const [tiposRegistrados, setTiposRegistrados] = useState<string[]>([]);
  const [consultandoMesa, setConsultandoMesa] = useState(false);
  const [mesaConfirmada, setMesaConfirmada] = useState(false);

  // Votos por cada tipo de elección
  const [votosRegional, setVotosRegional] = useState<VotoRow[]>([{ id_partido: "", cant_voto: "" }]);
  const [votosConsejero, setVotosConsejero] = useState<VotoRow[]>([{ id_partido: "", cant_voto: "" }]);
  const [votosProvincial, setVotosProvincial] = useState<VotoRow[]>([{ id_partido: "", cant_voto: "" }]);
  const [votosDistrital, setVotosDistrital] = useState<VotoRow[]>([{ id_partido: "", cant_voto: "" }]);

  // Estado del Modal de Confirmación
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [tipoAGuardar, setTipoAGuardar] = useState<TipoEleccion | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setSuccessMsg(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setErrorMsg(null), 6000);
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setErrorMsg(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setSuccessMsg(null), 5000);
  };

  useEffect(() => {
    async function initData() {
      try {
        setLoadingLocales(true);
        const [locs, parts] = await Promise.all([
          listarLocales(),
          listarPartidos().catch(() => []),
        ]);
        setAllLocales(locs);
        setPartidosList(parts);
        // Pre-cargar filas por defecto según las keywords de cada tipo de elección
        if (parts.length > 0) {
          const makeRows = (tipo: "REGIONAL" | "CONSEJERO" | "PROVINCIAL" | "DISTRITAL") =>
            getPreloadPartidos(parts, tipo).map((p) => ({ id_partido: String(p.id_partido), cant_voto: "" }));
          setVotosRegional(makeRows("REGIONAL"));
          setVotosConsejero(makeRows("CONSEJERO"));
          setVotosProvincial(makeRows("PROVINCIAL"));
          setVotosDistrital(makeRows("DISTRITAL"));
        }
      } catch {
        showError("Error al cargar locales de votación.");
      } finally {
        setLoadingLocales(false);
      }
    }
    initData();
  }, []);

  // Cuando cambia el local o la mesa, reseteamos la confirmación
  useEffect(() => {
    setMesaConfirmada(false);
    setTiposRegistrados([]);
  }, [selectedLocal, nroMesa]);


  // Obtener lista única de distritos
  const distritosDisponibles = Array.from(
    new Set(allLocales.map((l) => l.distrito).filter(Boolean))
  ).sort();

  // Filtrar locales según el distrito seleccionado
  const localesFiltrados = allLocales.filter((l) => l.distrito === selectedDistrito);
  const localObjeto = allLocales.find((l) => String(l.id_local) === selectedLocal);

  // Confirmar mesa: consulta al back qué tipos ya están registrados
  const handleConfirmarMesa = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!selectedDistrito) { showError("Por favor, seleccione primero un distrito."); return; }
      if (!selectedLocal) { showError("Por favor, seleccione un local de votación."); return; }
      if (!nroMesa || Number(nroMesa) < 1) { showError("Por favor, ingrese un número de mesa válido."); return; }
      if (!session?.access) { showError("No se encontró sesión activa. Inicie sesión nuevamente."); return; }

      setConsultandoMesa(true);
      try {
        const estado = await consultarEstadoMesa(
          Number(selectedLocal),
          Number(nroMesa),
          session.access
        );
        setTiposRegistrados(estado.tipos_registrados);
        setMesaConfirmada(true);
        const orden: TipoEleccion[] = ["REGIONAL", "CONSEJERO", "PROVINCIAL", "DISTRITAL"];
        const primerLibre = orden.find((t) => !estado.tipos_registrados.includes(t));
        if (primerLibre) setActiveTab(primerLibre);
      } catch {
        // Si el endpoint aún no existe en el back, igual permitimos continuar
        setTiposRegistrados([]);
        setMesaConfirmada(true);
      } finally {
        setConsultandoMesa(false);
      }
    },
    [selectedDistrito, selectedLocal, nroMesa, session]
  );

  // Guardar un tipo específico
  const handleGuardarTipo = (tipo: TipoEleccion) => {
    const votos = getVotosPorTipo(tipo);
    const validos = getValidVotos(votos);
    if (validos.length === 0) {
      showError(`Ingrese al menos un voto válido para la Elección ${tipo}.`);
      return;
    }
    const hasDuplicates = (v: { id_partido: number }[]) => {
      const ids = v.map((x) => x.id_partido);
      return new Set(ids).size !== ids.length;
    };
    if (hasDuplicates(validos)) {
      showError("Ha ingresado el mismo partido más de una vez. Por favor verifique.");
      return;
    }
    setTipoAGuardar(tipo);
    setShowConfirmModal(true);
  };

  // Helpers
  const getVotosPorTipo = (tipo: TipoEleccion): VotoRow[] => {
    if (tipo === "REGIONAL") return votosRegional;
    if (tipo === "CONSEJERO") return votosConsejero;
    if (tipo === "PROVINCIAL") return votosProvincial;
    return votosDistrital;
  };

  const getValidVotos = (votos: VotoRow[]) =>
    votos
      .filter((v) => v.id_partido.trim() !== "" && v.cant_voto.trim() !== "")
      .map((v) => ({
        id_partido: Number(v.id_partido),
        cant_voto: Number(v.cant_voto),
      }));

  const resetVotosTipo = (tipo: TipoEleccion) => {
    const makeResetRows = (t: TipoEleccion) =>
      getPreloadPartidos(partidosList, t).map((p) => ({ id_partido: String(p.id_partido), cant_voto: "" }));
    if (tipo === "REGIONAL") setVotosRegional(makeResetRows("REGIONAL"));
    if (tipo === "CONSEJERO") setVotosConsejero(makeResetRows("CONSEJERO"));
    if (tipo === "PROVINCIAL") setVotosProvincial(makeResetRows("PROVINCIAL"));
    if (tipo === "DISTRITAL") setVotosDistrital(makeResetRows("DISTRITAL"));
  };

  // Manejadores para agregar/eliminar/actualizar filas de votos
  const handleAddRow = (tipo: TipoEleccion) => {
    const newRow = { id_partido: "", cant_voto: "" };
    if (tipo === "REGIONAL") setVotosRegional((p) => [...p, newRow]);
    if (tipo === "CONSEJERO") setVotosConsejero((p) => [...p, newRow]);
    if (tipo === "PROVINCIAL") setVotosProvincial((p) => [...p, newRow]);
    if (tipo === "DISTRITAL") setVotosDistrital((p) => [...p, newRow]);
  };

  const handleRemoveRow = (tipo: TipoEleccion, index: number) => {
    const filter = (list: VotoRow[]) => list.filter((_, i) => i !== index);
    if (tipo === "REGIONAL") setVotosRegional(filter);
    if (tipo === "CONSEJERO") setVotosConsejero(filter);
    if (tipo === "PROVINCIAL") setVotosProvincial(filter);
    if (tipo === "DISTRITAL") setVotosDistrital(filter);
  };

  const handleUpdateRow = (
    tipo: TipoEleccion,
    index: number,
    field: "id_partido" | "cant_voto",
    value: string
  ) => {
    const updateFn = (list: VotoRow[]) => {
      const copy = [...list];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    };
    if (tipo === "REGIONAL") setVotosRegional(updateFn);
    if (tipo === "CONSEJERO") setVotosConsejero(updateFn);
    if (tipo === "PROVINCIAL") setVotosProvincial(updateFn);
    if (tipo === "DISTRITAL") setVotosDistrital(updateFn);
  };

  // Al confirmar en el modal, envía solo el tipo seleccionado
  const handleConfirmAndSave = async () => {
    if (!tipoAGuardar) return;
    if (!session?.access) { showError("No se encontró sesión activa."); return; }

    setIsSubmitting(true);
    const token = session.access;
    const localId = Number(selectedLocal);
    const mesaNum = Number(nroMesa);

    try {
      const votos = getValidVotos(getVotosPorTipo(tipoAGuardar));

      const payload: VotosPayload = {
        id_local: localId,
        nro_mesa: mesaNum,
        tipo_eleccion: tipoAGuardar,
        votos,
      };

      await registrarVotos(payload, token);

      // Guardar en localStorage para Matriz Excel
      try {
        const storedStr = localStorage.getItem("escrutinio_votos_registrados") || "[]";
        const storedList = JSON.parse(storedStr);
        storedList.push({
          id_local: localId,
          nro_mesa: mesaNum,
          distrito: selectedDistrito,
          nombre_local: localObjeto?.nombre_local,
          direccion_local: localObjeto?.direccion_local,
          tipo_eleccion: tipoAGuardar,
          votos,
        });
        localStorage.setItem("escrutinio_votos_registrados", JSON.stringify(storedList));
      } catch {
        console.error("Error guardando en caché local.");
      }

      // Marcar tipo como ya registrado localmente
      const nuevosRegistrados = [...tiposRegistrados, tipoAGuardar];
      setTiposRegistrados(nuevosRegistrados);

      // Resetear solo el tab guardado
      resetVotosTipo(tipoAGuardar);

      showSuccess(`¡Acta ${tipoAGuardar} de la Mesa N° ${nroMesa} guardada exitosamente!`);
      setShowConfirmModal(false);
      setTipoAGuardar(null);

      // Mover al siguiente tab libre
      const orden: TipoEleccion[] = ["REGIONAL", "CONSEJERO", "PROVINCIAL", "DISTRITAL"];
      const siguiente = orden.find((t) => !nuevosRegistrados.includes(t));
      if (siguiente) setActiveTab(siguiente);
    } catch (error: any) {
      showError(error?.message || "Ocurrió un error al registrar los votos.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderVotosForm = (tipo: TipoEleccion, list: VotoRow[]) => {
    const yaRegistrado = tiposRegistrados.includes(tipo);
    const validCount = getValidVotos(list).length;
    return (
      <div className="space-y-3">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs font-semibold text-brand-gray-500 uppercase tracking-wider">
            Partidos y Votos ({tipo})
          </span>
          {!yaRegistrado && (
            <button
              type="button"
              onClick={() => handleAddRow(tipo)}
              className="flex items-center gap-1.5 rounded-lg bg-brand-green/10 px-3 py-1.5 text-xs font-semibold text-brand-green hover:bg-brand-green/20 transition-colors"
            >
              <Plus size={15} /> Agregar Partido
            </button>
          )}
        </div>

        {list.map((voto, idx) => (
          <div key={idx} className="flex items-center gap-3 bg-brand-gray-50 p-3 rounded-xl border border-brand-gray-200">
            <div className="w-12 text-center text-xs font-bold text-brand-gray-400">#{idx + 1}</div>
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-brand-gray-600">Partido Político</label>
              {partidosList.length > 0 ? (
                <select
                  value={voto.id_partido}
                  onChange={(e) => handleUpdateRow(tipo, idx, "id_partido", e.target.value)}
                  disabled={yaRegistrado}
                  className="w-full rounded-lg border-brand-gray-300 p-2 text-sm focus:border-brand-green focus:ring-brand-green bg-white disabled:bg-brand-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Seleccione partido...</option>
                  {partidosList.map((p) => {
                    const isSelectedElsewhere = list.some(
                      (otherVoto, otherIdx) => otherIdx !== idx && otherVoto.id_partido === String(p.id_partido)
                    );
                    return (
                      <option key={p.id_partido} value={p.id_partido} disabled={isSelectedElsewhere}>
                        {p.nombre_partido} {isSelectedElsewhere ? "(Ya seleccionado)" : `(${p.categoria})`}
                      </option>
                    );
                  })}
                </select>
              ) : (
                <input
                  type="number"
                  value={voto.id_partido}
                  onChange={(e) => handleUpdateRow(tipo, idx, "id_partido", e.target.value)}
                  disabled={yaRegistrado}
                  className="w-full rounded-lg border-brand-gray-300 p-2 text-sm focus:border-brand-green focus:ring-brand-green bg-white disabled:bg-brand-gray-100 disabled:cursor-not-allowed"
                  placeholder="Ej. 1"
                  min="1"
                />
              )}
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-brand-gray-600">Cantidad de Votos</label>
              <input
                type="number"
                value={voto.cant_voto}
                onChange={(e) => handleUpdateRow(tipo, idx, "cant_voto", e.target.value)}
                disabled={yaRegistrado}
                className="w-full rounded-lg border-brand-gray-300 p-2 text-sm focus:border-brand-green focus:ring-brand-green bg-white disabled:bg-brand-gray-100 disabled:cursor-not-allowed"
                placeholder="Ej. 120"
                min="0"
              />
            </div>
            {!yaRegistrado && (
              <button
                type="button"
                onClick={() => handleRemoveRow(tipo, idx)}
                disabled={list.length === 1}
                className="mt-5 p-2 text-brand-gray-400 hover:text-red-600 disabled:opacity-30 transition-colors"
                title="Eliminar fila"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        ))}

        {/* Botón guardar por tipo */}
        <div className="flex justify-end pt-4 border-t border-brand-gray-100 mt-4">
          {yaRegistrado ? (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-5 py-2.5 text-sm font-semibold text-emerald-700">
              <CheckCircle2 size={18} />
              Acta {tipo} ya registrada
            </div>
          ) : (
            <button
              type="button"
              onClick={() => handleGuardarTipo(tipo)}
              disabled={validCount === 0}
              className="flex items-center gap-2 rounded-xl bg-brand-green px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-brand-green-dark disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Save size={18} /> Guardar Acta {tipo.charAt(0) + tipo.slice(1).toLowerCase()}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="rounded-2xl border border-brand-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-brand-gray-100 pb-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-brand-gray-900">Ingreso de Actas de Escrutinio</h3>
            <p className="text-sm text-brand-gray-500 mt-1">
              Seleccione el local y número de mesa, confirme y luego registre cada acta por separado.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 rounded-xl bg-brand-green/10 px-3 py-1.5 text-xs font-semibold text-brand-green">
            <Vote size={18} /> Módulo de Escrutinio
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-600 border border-red-200 flex items-center gap-2">
            <AlertCircle size={18} /> {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-6 rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700 border border-emerald-200 flex items-center gap-2">
            <Check size={18} /> {successMsg}
          </div>
        )}

        {/* PASO 1: Selección de Distrito, Local y Mesa */}
        <form onSubmit={handleConfirmarMesa} className="space-y-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Selector de Distrito */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-brand-gray-700 flex items-center gap-1.5">
                <MapPin size={16} className="text-brand-green" /> 1. Distrito
              </label>
              <select
                value={selectedDistrito}
                onChange={(e) => {
                  setSelectedDistrito(e.target.value);
                  setSelectedLocal("");
                  setMesaConfirmada(false);
                }}
                className="w-full rounded-xl border-brand-gray-300 bg-white p-3 text-sm focus:border-brand-green focus:ring-brand-green shadow-sm"
                required
              >
                <option value="">Seleccione un distrito...</option>
                {distritosDisponibles.map((dist) => (
                  <option key={dist} value={dist}>{dist}</option>
                ))}
              </select>
              {loadingLocales && (
                <span className="text-xs text-brand-gray-400 mt-1 block">Cargando locales...</span>
              )}
            </div>

            {/* Selector de Local */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-brand-gray-700 flex items-center gap-1.5">
                <Building2 size={16} className="text-brand-green" /> 2. Local de Votación
              </label>
              <select
                value={selectedLocal}
                onChange={(e) => { setSelectedLocal(e.target.value); setMesaConfirmada(false); }}
                disabled={!selectedDistrito}
                className="w-full rounded-xl border-brand-gray-300 bg-white p-3 text-sm focus:border-brand-green focus:ring-brand-green shadow-sm disabled:bg-brand-gray-100 disabled:cursor-not-allowed"
                required
              >
                <option value="">
                  {selectedDistrito ? "Seleccione un local..." : "Primero elija un distrito..."}
                </option>
                {localesFiltrados.map((local) => (
                  <option key={local.id_local} value={local.id_local}>{local.nombre_local}</option>
                ))}
              </select>
            </div>

            {/* Número de Mesa */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-brand-gray-700 flex items-center gap-1.5">
                <Vote size={16} className="text-brand-green" /> 3. Número de Mesa
              </label>
              <input
                type="number"
                value={nroMesa}
                onChange={(e) => { setNroMesa(e.target.value); setMesaConfirmada(false); }}
                disabled={!selectedLocal}
                className="w-full rounded-xl border-brand-gray-300 bg-white p-3 text-sm focus:border-brand-green focus:ring-brand-green shadow-sm disabled:bg-brand-gray-100 disabled:cursor-not-allowed"
                placeholder="Ej. 1"
                min="1"
                required
              />
            </div>
          </div>

          {/* Botón verificar mesa */}
          {!mesaConfirmada && (
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={!selectedLocal || !nroMesa || consultandoMesa}
                className="flex items-center gap-2 rounded-xl bg-brand-green/90 px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-brand-green disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {consultandoMesa ? (
                  <><Loader2 size={16} className="animate-spin" /> Verificando mesa...</>
                ) : (
                  <><Search size={16} /> Verificar Mesa</>
                )}
              </button>
            </div>
          )}

          {/* Indicador de mesa confirmada */}
          {mesaConfirmada && (
            <div className="flex items-center justify-between rounded-xl bg-brand-green/5 border border-brand-green/30 px-4 py-3 mt-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-brand-green">
                <CheckCircle2 size={18} />
                Mesa N° {nroMesa} confirmada — {localObjeto?.nombre_local}
              </div>
              <button
                type="button"
                onClick={() => { setMesaConfirmada(false); setNroMesa(""); setTiposRegistrados([]); }}
                className="text-xs text-brand-gray-500 hover:text-red-600 underline"
              >
                Cambiar mesa
              </button>
            </div>
          )}
        </form>

        {/* PASO 2: Tabs por tipo de elección — solo aparece al confirmar la mesa */}
        {mesaConfirmada && (
          <div className="mt-8 rounded-xl border border-brand-gray-200 bg-white p-5 shadow-sm">
            <h4 className="font-semibold text-brand-gray-900 mb-4 text-base">
              Conteo de Votos por Tipo de Elección
            </h4>

            {/* Pestañas */}
            <div className="flex border-b border-brand-gray-200 mb-6 flex-wrap">
              {(["REGIONAL", "CONSEJERO", "PROVINCIAL", "DISTRITAL"] as TipoEleccion[]).map((tab) => {
                const yaReg = tiposRegistrados.includes(tab);
                const validCount = getValidVotos(getVotosPorTipo(tab)).length;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
                      activeTab === tab
                        ? "border-brand-green text-brand-green"
                        : "border-transparent text-brand-gray-500 hover:text-brand-gray-800"
                    }`}
                  >
                    Elección {tab.charAt(0) + tab.slice(1).toLowerCase()}
                    {yaReg ? (
                      <span className="rounded-full bg-emerald-500 text-white text-xs px-2 py-0.5 font-bold flex items-center gap-1">
                        <Check size={10} /> OK
                      </span>
                    ) : validCount > 0 ? (
                      <span className="rounded-full bg-brand-green text-white text-xs px-2 py-0.5 font-bold">
                        {validCount}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>

            {activeTab === "REGIONAL" && renderVotosForm("REGIONAL", votosRegional)}
            {activeTab === "CONSEJERO" && renderVotosForm("CONSEJERO", votosConsejero)}
            {activeTab === "PROVINCIAL" && renderVotosForm("PROVINCIAL", votosProvincial)}
            {activeTab === "DISTRITAL" && renderVotosForm("DISTRITAL", votosDistrital)}
          </div>
        )}
      </div>

      {/* MODAL DE CONFIRMACIÓN */}
      {showConfirmModal && tipoAGuardar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-brand-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-brand-green/10 p-2.5 text-brand-green">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-brand-gray-900">Confirmar Registro de Acta</h4>
                  <p className="text-xs text-brand-gray-500">
                    Revise la información antes de guardar — esta acción no se puede deshacer.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { setShowConfirmModal(false); setTipoAGuardar(null); }}
                className="text-brand-gray-400 hover:text-brand-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            {/* Resumen de ubicación */}
            <div className="grid grid-cols-3 gap-4 bg-brand-gray-50 p-4 rounded-xl border border-brand-gray-200 text-sm">
              <div>
                <span className="text-xs font-semibold text-brand-gray-500 uppercase block">Distrito</span>
                <span className="font-bold text-brand-gray-900">{selectedDistrito}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-brand-gray-500 uppercase block">Local</span>
                <span className="font-bold text-brand-gray-900">{localObjeto?.nombre_local}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-brand-gray-500 uppercase block">Mesa</span>
                <span className="font-bold text-brand-green-dark">Mesa N° {nroMesa}</span>
              </div>
            </div>

            {/* Tipo de elección a guardar */}
            <div className="rounded-xl bg-brand-green/5 border border-brand-green/20 px-4 py-3 text-sm font-semibold text-brand-green flex items-center gap-2">
              <Vote size={16} />
              Guardando: Elección {tipoAGuardar.charAt(0) + tipoAGuardar.slice(1).toLowerCase()}
            </div>

            {/* Resumen de votos */}
            <div className="space-y-2">
              <h5 className="text-xs font-bold text-brand-gray-900 uppercase tracking-wide">Votos a Registrar:</h5>
              <div className="border border-brand-gray-200 rounded-xl p-3 bg-white">
                <div className="flex justify-between items-center mb-2 font-semibold text-xs text-brand-green uppercase">
                  <span>Elección {tipoAGuardar}</span>
                  <span>Total: {getValidVotos(getVotosPorTipo(tipoAGuardar)).reduce((a, b) => a + b.cant_voto, 0)} votos</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-brand-gray-700">
                  {getValidVotos(getVotosPorTipo(tipoAGuardar)).map((v, i) => {
                    const nombre = partidosList.find((p) => p.id_partido === v.id_partido)?.nombre_partido || `ID #${v.id_partido}`;
                    return (
                      <div key={i} className="flex justify-between bg-brand-gray-50 px-3 py-1.5 rounded-md">
                        <span className="truncate pr-2" title={nombre}>{nombre}</span>
                        <span className="font-bold whitespace-nowrap">{v.cant_voto} votos</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex justify-end gap-3 border-t border-brand-gray-100 pt-4">
              <button
                type="button"
                onClick={() => { setShowConfirmModal(false); setTipoAGuardar(null); }}
                disabled={isSubmitting}
                className="rounded-xl border border-brand-gray-300 px-5 py-2.5 text-sm font-semibold text-brand-gray-700 hover:bg-brand-gray-50 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmAndSave}
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-xl bg-brand-green px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-green-dark disabled:opacity-50 transition-all shadow-md"
              >
                {isSubmitting ? (
                  <><Loader2 size={16} className="animate-spin" /> Guardando...</>
                ) : (
                  <><Check size={18} /> Confirmar y Guardar</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
