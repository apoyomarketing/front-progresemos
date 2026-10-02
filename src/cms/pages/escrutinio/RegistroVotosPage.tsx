import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import {
  listarLocales,
  listarPartidos,
  registrarVotos,
} from "../../../api/escrutinio";
import type {
  LocalVotacion,
  Partido,
  VotosPayload,
} from "../../../api/escrutinio";
import { useAuth } from "../../../api/AuthProvider";
import { Plus, Trash2, Save, AlertCircle, X, Check, MapPin, Building2, Vote } from "lucide-react";

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
  const [activeTab, setActiveTab] = useState<"REGIONAL" | "CONSEJERO" | "PROVINCIAL" | "DISTRITAL">("REGIONAL");

  // Votos por cada tipo de elección
  const [votosRegional, setVotosRegional] = useState<VotoRow[]>([{ id_partido: "", cant_voto: "" }]);
  const [votosConsejero, setVotosConsejero] = useState<VotoRow[]>([{ id_partido: "", cant_voto: "" }]);
  const [votosProvincial, setVotosProvincial] = useState<VotoRow[]>([{ id_partido: "", cant_voto: "" }]);
  const [votosDistrital, setVotosDistrital] = useState<VotoRow[]>([{ id_partido: "", cant_voto: "" }]);

  // Genera una fila por cada partido con voto en blanco para que el usuario solo llene el número
  const buildRowsFromPartidos = (parts: typeof partidosList): VotoRow[] =>
    parts.map((p) => ({ id_partido: String(p.id_partido), cant_voto: "" }));

  // Estado del Modal de Confirmación
  const [showConfirmModal, setShowConfirmModal] = useState(false);
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
        // Pre-cargar todos los partidos como filas en cada tipo de elección
        if (parts.length > 0) {
          const rows = parts.map((p) => ({ id_partido: String(p.id_partido), cant_voto: "" }));
          setVotosRegional(rows);
          setVotosConsejero(rows.map((r) => ({ ...r })));
          setVotosProvincial(rows.map((r) => ({ ...r })));
          setVotosDistrital(rows.map((r) => ({ ...r })));
        }
      } catch (err) {
        showError("Error al cargar locales de votación.");
      } finally {
        setLoadingLocales(false);
      }
    }
    initData();
  }, []);


  // Obtener lista única de distritos
  const distritosDisponibles = Array.from(
    new Set(allLocales.map((l) => l.distrito).filter(Boolean))
  ).sort();

  // Filtrar locales según el distrito seleccionado
  const localesFiltrados = allLocales.filter((l) => l.distrito === selectedDistrito);
  const localObjeto = allLocales.find((l) => String(l.id_local) === selectedLocal);

  // Manejadores para agregar/eliminar/actualizar filas de votos
  const handleAddRow = (tipo: "REGIONAL" | "CONSEJERO" | "PROVINCIAL" | "DISTRITAL") => {
    const newRow = { id_partido: "", cant_voto: "" };
    if (tipo === "REGIONAL") setVotosRegional([...votosRegional, newRow]);
    if (tipo === "CONSEJERO") setVotosConsejero([...votosConsejero, newRow]);
    if (tipo === "PROVINCIAL") setVotosProvincial([...votosProvincial, newRow]);
    if (tipo === "DISTRITAL") setVotosDistrital([...votosDistrital, newRow]);
  };

  const handleRemoveRow = (tipo: "REGIONAL" | "CONSEJERO" | "PROVINCIAL" | "DISTRITAL", index: number) => {
    if (tipo === "REGIONAL") setVotosRegional(votosRegional.filter((_, i) => i !== index));
    if (tipo === "CONSEJERO") setVotosConsejero(votosConsejero.filter((_, i) => i !== index));
    if (tipo === "PROVINCIAL") setVotosProvincial(votosProvincial.filter((_, i) => i !== index));
    if (tipo === "DISTRITAL") setVotosDistrital(votosDistrital.filter((_, i) => i !== index));
  };

  const handleUpdateRow = (
    tipo: "REGIONAL" | "CONSEJERO" | "PROVINCIAL" | "DISTRITAL",
    index: number,
    field: "id_partido" | "cant_voto",
    value: string
  ) => {
    const updateFn = (list: VotoRow[]) => {
      const copy = [...list];
      copy[index][field] = value;
      return copy;
    };

    if (tipo === "REGIONAL") setVotosRegional(updateFn);
    if (tipo === "CONSEJERO") setVotosConsejero(updateFn);
    if (tipo === "PROVINCIAL") setVotosProvincial(updateFn);
    if (tipo === "DISTRITAL") setVotosDistrital(updateFn);
  };

  // Helper para filtrar votos válidos
  const getValidVotos = (votos: VotoRow[]) =>
    votos
      .filter((v) => v.id_partido.trim() !== "" && v.cant_voto.trim() !== "")
      .map((v) => ({
        id_partido: Number(v.id_partido),
        cant_voto: Number(v.cant_voto),
      }));

  const validRegional = getValidVotos(votosRegional);
  const validConsejero = getValidVotos(votosConsejero);
  const validProvincial = getValidVotos(votosProvincial);
  const validDistrital = getValidVotos(votosDistrital);

  // Al presionar el botón Guardar, validamos y abrimos el modal
  const handleOpenConfirmation = (e: FormEvent) => {
    e.preventDefault();

    if (!selectedDistrito) {
      showError("Por favor, seleccione primero un distrito.");
      return;
    }
    if (!selectedLocal) {
      showError("Por favor, seleccione un local de votación.");
      return;
    }
    if (!nroMesa) {
      showError("Por favor, ingrese el número de mesa.");
      return;
    }
    if (validRegional.length === 0 && validConsejero.length === 0 && validProvincial.length === 0 && validDistrital.length === 0) {
      showError("Ingrese al menos un voto válido en alguna de las elecciones (Regional, Consejero, Provincial o Distrital).");
      return;
    }

    const hasDuplicates = (votos: { id_partido: number }[]) => {
      const ids = votos.map((v) => v.id_partido);
      return new Set(ids).size !== ids.length;
    };

    if (hasDuplicates(validRegional) || hasDuplicates(validConsejero) || hasDuplicates(validProvincial) || hasDuplicates(validDistrital)) {
      showError("Error: Ha ingresado el mismo partido político más de una vez en un mismo tipo de elección. Por favor, verifique y asigne solo una cantidad de votos por partido.");
      return;
    }

    setShowConfirmModal(true);
  };

  // Al confirmar en el modal, enviamos las peticiones al backend
  const handleConfirmAndSave = async () => {
    if (!session?.access) {
      showError("No se encontró sesión activa. Inicie sesión nuevamente.");
      return;
    }

    setIsSubmitting(true);
    const token = session.access;
    const localId = Number(selectedLocal);
    const mesaNum = Number(nroMesa);

    try {
      const promises = [];

      if (validRegional.length > 0) {
        const payload: VotosPayload = {
          id_local: localId,
          nro_mesa: mesaNum,
          tipo_eleccion: "REGIONAL",
          votos: validRegional,
        };
        promises.push(registrarVotos(payload, token));
      }

      if (validConsejero.length > 0) {
        const payload: VotosPayload = {
          id_local: localId,
          nro_mesa: mesaNum,
          tipo_eleccion: "CONSEJERO",
          votos: validConsejero,
        };
        promises.push(registrarVotos(payload, token));
      }

      if (validProvincial.length > 0) {
        const payload: VotosPayload = {
          id_local: localId,
          nro_mesa: mesaNum,
          tipo_eleccion: "PROVINCIAL",
          votos: validProvincial,
        };
        promises.push(registrarVotos(payload, token));
      }

      if (validDistrital.length > 0) {
        const payload: VotosPayload = {
          id_local: localId,
          nro_mesa: mesaNum,
          tipo_eleccion: "DISTRITAL",
          votos: validDistrital,
        };
        promises.push(registrarVotos(payload, token));
      }

      await Promise.all(promises);

      // Guardar copia local de las actas registradas para visualización inmediata en Matriz Excel
      try {
        const storedStr = localStorage.getItem("escrutinio_votos_registrados") || "[]";
        const storedList = JSON.parse(storedStr);

        const newEntries = [];
        if (validRegional.length > 0) {
          newEntries.push({
            id_local: localId,
            nro_mesa: mesaNum,
            distrito: selectedDistrito,
            nombre_local: localObjeto?.nombre_local,
            direccion_local: localObjeto?.direccion_local,
            tipo_eleccion: "REGIONAL",
            votos: validRegional,
          });
        }
        if (validConsejero.length > 0) {
          newEntries.push({
            id_local: localId,
            nro_mesa: mesaNum,
            distrito: selectedDistrito,
            nombre_local: localObjeto?.nombre_local,
            direccion_local: localObjeto?.direccion_local,
            tipo_eleccion: "CONSEJERO",
            votos: validConsejero,
          });
        }
        if (validProvincial.length > 0) {
          newEntries.push({
            id_local: localId,
            nro_mesa: mesaNum,
            distrito: selectedDistrito,
            nombre_local: localObjeto?.nombre_local,
            direccion_local: localObjeto?.direccion_local,
            tipo_eleccion: "PROVINCIAL",
            votos: validProvincial,
          });
        }
        if (validDistrital.length > 0) {
          newEntries.push({
            id_local: localId,
            nro_mesa: mesaNum,
            distrito: selectedDistrito,
            nombre_local: localObjeto?.nombre_local,
            direccion_local: localObjeto?.direccion_local,
            tipo_eleccion: "DISTRITAL",
            votos: validDistrital,
          });
        }

        localStorage.setItem("escrutinio_votos_registrados", JSON.stringify([...storedList, ...newEntries]));
      } catch (err) {
        console.error("Error guardando en caché local:", err);
      }

      showSuccess("¡Acta de mesa guardada exitosamente!");
      setShowConfirmModal(false);

      // Limpiar datos de votos y número de mesa para la siguiente digitación
      setNroMesa("");
      const resetRows = buildRowsFromPartidos(partidosList);
      setVotosRegional(resetRows);
      setVotosConsejero(resetRows.map((r) => ({ ...r })));
      setVotosProvincial(resetRows.map((r) => ({ ...r })));
      setVotosDistrital(resetRows.map((r) => ({ ...r })));
    } catch (error: any) {
      showError(error?.message || "Ocurrió un error al registrar los votos.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderVotosForm = (tipo: "REGIONAL" | "CONSEJERO" | "PROVINCIAL" | "DISTRITAL", list: VotoRow[]) => (
    <div className="space-y-3">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-semibold text-brand-gray-500 uppercase tracking-wider">
          Partidos y Votos ({tipo})
        </span>
        <button
          type="button"
          onClick={() => handleAddRow(tipo)}
          className="flex items-center gap-1.5 rounded-lg bg-brand-green/10 px-3 py-1.5 text-xs font-semibold text-brand-green hover:bg-brand-green/20 transition-colors"
        >
          <Plus size={15} /> Agregar Partido
        </button>
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
                className="w-full rounded-lg border-brand-gray-300 p-2 text-sm focus:border-brand-green focus:ring-brand-green bg-white"
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
                className="w-full rounded-lg border-brand-gray-300 p-2 text-sm focus:border-brand-green focus:ring-brand-green bg-white"
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
              className="w-full rounded-lg border-brand-gray-300 p-2 text-sm focus:border-brand-green focus:ring-brand-green bg-white"
              placeholder="Ej. 120"
              min="0"
            />
          </div>
          <button
            type="button"
            onClick={() => handleRemoveRow(tipo, idx)}
            disabled={list.length === 1}
            className="mt-5 p-2 text-brand-gray-400 hover:text-red-600 disabled:opacity-30 transition-colors"
            title="Eliminar fila"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="rounded-2xl border border-brand-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-brand-gray-100 pb-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-brand-gray-900">Ingreso de Actas de Escrutinio</h3>
            <p className="text-sm text-brand-gray-500 mt-1">
              Seleccione el distrito y local de votación, luego ingrese los votos por mesa para cada elección.
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

        <form onSubmit={handleOpenConfirmation} className="space-y-6">
          {/* Paso 1: Selección de Distrito, Local y Mesa */}
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
                }}
                className="w-full rounded-xl border-brand-gray-300 bg-white p-3 text-sm focus:border-brand-green focus:ring-brand-green shadow-sm"
                required
              >
                <option value="">Seleccione un distrito...</option>
                {distritosDisponibles.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
              {loadingLocales && (
                <span className="text-xs text-brand-gray-400 mt-1 block">Cargando locales...</span>
              )}
            </div>

            {/* Selector de Local de Votación */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-brand-gray-700 flex items-center gap-1.5">
                <Building2 size={16} className="text-brand-green" /> 2. Local de Votación
              </label>
              <select
                value={selectedLocal}
                onChange={(e) => setSelectedLocal(e.target.value)}
                disabled={!selectedDistrito}
                className="w-full rounded-xl border-brand-gray-300 bg-white p-3 text-sm focus:border-brand-green focus:ring-brand-green shadow-sm disabled:bg-brand-gray-100 disabled:cursor-not-allowed"
                required
              >
                <option value="">
                  {selectedDistrito ? "Seleccione un local..." : "Primero elija un distrito..."}
                </option>
                {localesFiltrados.map((local) => (
                  <option key={local.id_local} value={local.id_local}>
                    {local.nombre_local}
                  </option>
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
                onChange={(e) => setNroMesa(e.target.value)}
                disabled={!selectedLocal}
                className="w-full rounded-xl border-brand-gray-300 bg-white p-3 text-sm focus:border-brand-green focus:ring-brand-green shadow-sm disabled:bg-brand-gray-100 disabled:cursor-not-allowed"
                placeholder="Ej. 1"
                min="1"
                required
              />
            </div>
          </div>

          {/* Paso 2: Conteo de Votos por Elección */}
          {selectedLocal && (
            <div className="mt-8 rounded-xl border border-brand-gray-200 bg-white p-5 shadow-sm">
              <h4 className="font-semibold text-brand-gray-900 mb-4 text-base">
                Conteo de Votos por Tipo de Elección
              </h4>

              {/* Pestañas para Regional, Consejero, Provincial, Distrital */}
              <div className="flex border-b border-brand-gray-200 mb-6 flex-wrap">
                {(["REGIONAL", "CONSEJERO", "PROVINCIAL", "DISTRITAL"] as const).map((tab) => {
                  const validCount =
                    tab === "REGIONAL"
                      ? validRegional.length
                      : tab === "CONSEJERO"
                      ? validConsejero.length
                      : tab === "PROVINCIAL"
                      ? validProvincial.length
                      : validDistrital.length;

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
                      {validCount > 0 && (
                        <span className="rounded-full bg-brand-green text-white text-xs px-2 py-0.5 font-bold">
                          {validCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Formulario según la pestaña activa */}
              {activeTab === "REGIONAL" && renderVotosForm("REGIONAL", votosRegional)}
              {activeTab === "CONSEJERO" && renderVotosForm("CONSEJERO", votosConsejero)}
              {activeTab === "PROVINCIAL" && renderVotosForm("PROVINCIAL", votosProvincial)}
              {activeTab === "DISTRITAL" && renderVotosForm("DISTRITAL", votosDistrital)}
            </div>
          )}

          {/* Botón Guardar */}
          <div className="flex justify-end pt-4 border-t border-brand-gray-100">
            <button
              type="submit"
              disabled={!selectedLocal}
              className="flex items-center gap-2 rounded-xl bg-brand-green px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-brand-green-dark disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Save size={18} /> Guardar Acta
            </button>
          </div>
        </form>
      </div>

      {/* MODAL DE CONFIRMACIÓN */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-brand-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-brand-green/10 p-2.5 text-brand-green">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-brand-gray-900">Confirmación de Digitación</h4>
                  <p className="text-xs text-brand-gray-500">
                    Revise detalladamente la información del acta antes de guardar.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="text-brand-gray-400 hover:text-brand-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            {/* Resumen de Ubicación y Mesa */}
            <div className="grid grid-cols-3 gap-4 bg-brand-gray-50 p-4 rounded-xl border border-brand-gray-200 text-sm">
              <div>
                <span className="text-xs font-semibold text-brand-gray-500 uppercase block">Distrito</span>
                <span className="font-bold text-brand-gray-900">{selectedDistrito}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-brand-gray-500 uppercase block">Local de Votación</span>
                <span className="font-bold text-brand-gray-900">{localObjeto?.nombre_local}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-brand-gray-500 uppercase block">Mesa Física</span>
                <span className="font-bold text-brand-green-dark">Mesa Nº {nroMesa}</span>
              </div>
            </div>

            {/* Resumen de Votos Registrados */}
            <div className="space-y-4">
              <h5 className="text-sm font-bold text-brand-gray-900 uppercase tracking-wide">
                Resumen de Votos a Registrar:
              </h5>

              {/* Regional */}
              {validRegional.length > 0 && (
                <div className="border border-brand-gray-200 rounded-xl p-3 bg-white">
                  <div className="flex justify-between items-center mb-2 font-semibold text-xs text-brand-green uppercase">
                    <span>Elección Regional</span>
                    <span>Total Votos: {validRegional.reduce((a, b) => a + b.cant_voto, 0)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-brand-gray-700">
                    {validRegional.map((v, i) => {
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
              )}

              {/* Consejero */}
              {validConsejero.length > 0 && (
                <div className="border border-brand-gray-200 rounded-xl p-3 bg-white">
                  <div className="flex justify-between items-center mb-2 font-semibold text-xs text-brand-green uppercase">
                    <span>Elección Consejero</span>
                    <span>Total Votos: {validConsejero.reduce((a, b) => a + b.cant_voto, 0)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-brand-gray-700">
                    {validConsejero.map((v, i) => {
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
              )}

              {/* Provincial */}
              {validProvincial.length > 0 && (
                <div className="border border-brand-gray-200 rounded-xl p-3 bg-white">
                  <div className="flex justify-between items-center mb-2 font-semibold text-xs text-brand-green uppercase">
                    <span>Elección Provincial</span>
                    <span>Total Votos: {validProvincial.reduce((a, b) => a + b.cant_voto, 0)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-brand-gray-700">
                    {validProvincial.map((v, i) => {
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
              )}

              {/* Distrital */}
              {validDistrital.length > 0 && (
                <div className="border border-brand-gray-200 rounded-xl p-3 bg-white">
                  <div className="flex justify-between items-center mb-2 font-semibold text-xs text-brand-green uppercase">
                    <span>Elección Distrital</span>
                    <span>Total Votos: {validDistrital.reduce((a, b) => a + b.cant_voto, 0)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-brand-gray-700">
                    {validDistrital.map((v, i) => {
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
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 border-t border-brand-gray-100 pt-4">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
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
                  "Guardando..."
                ) : (
                  <>
                    <Check size={18} /> Aceptar y Guardar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
