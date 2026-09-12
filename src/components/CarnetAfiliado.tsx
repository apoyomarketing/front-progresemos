import { forwardRef, useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";
import portada from "../assets/carnet/portada fotochek.png";
import firmaLucio from "../assets/carnet/FIRMA LUCIO ISTAÑA.png";


interface CarnetAfiliadoProps {
  nombreCompleto: string;
  dni: string;
  codigo: string;
  fotoUrl: string | null;
  fechaAfiliacion: string;
  rol?: string;
}

function iniciales(nombreCompleto: string) {
  const partes = nombreCompleto.trim().split(/\s+/);
  return ((partes[0]?.[0] ?? "") + (partes[1]?.[0] ?? "")).toUpperCase();
}

function formatearFecha(fechaIso: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(fechaIso);
  if (!match) return fechaIso;
  const [, anio, mes, dia] = match;
  return `${dia}/${mes}/${anio}`;
}

const CarnetAfiliado = forwardRef<HTMLDivElement, CarnetAfiliadoProps>(function CarnetAfiliado(
  { nombreCompleto, dni, codigo, fotoUrl, fechaAfiliacion, rol },
  ref,
) {
  const barcodeRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!barcodeRef.current || !dni) return;
    JsBarcode(barcodeRef.current, dni, {
      format: "CODE128",
      width: 1.6,
      height: 36,
      fontSize: 11,
      margin: 0,
      background: "transparent",
      lineColor: "#14532d",
    });
  }, [dni]);

  return (
    <div
      ref={ref}
      className="mx-auto w-full max-w-[300px] overflow-hidden rounded-2xl border-[6px] border-brand-yellow bg-white shadow-lg"
    >
      <div className="bg-brand-green px-4 py-3">
        <span className="block font-display text-base font-extrabold tracking-wide text-white">
          PROGRESEMOS
        </span>
        <span className="block text-[8px] font-semibold tracking-[0.2em] text-brand-yellow">
          PUNO SEGURO, MODERNO Y PRODUCTIVO
        </span>
      </div>

      <div className="relative h-32 w-full">
        <img src={portada} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0" />

        <div className="absolute -bottom-10 left-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-brand-gray-50 shadow-md">
          {fotoUrl ? (
            <img
              src={fotoUrl}
              alt=""
              crossOrigin="anonymous"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="font-display text-xl font-bold text-brand-green-dark">
              {iniciales(nombreCompleto)}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center px-5 pb-4 pt-12">
        <div className="flex w-full items-center gap-3">
          <img
            src={firmaLucio}
            alt=""
            className="h-14 max-w-[140px] shrink-0 object-contain opacity-85"
          />
          <div className="flex-1 text-right">
            <p className="font-display text-sm font-extrabold uppercase leading-tight text-brand-gray-900">
              {nombreCompleto}
            </p>
            <span className="mt-1 inline-block text-[10px] font-bold uppercase tracking-[0.14em] text-brand-green-dark">
              {rol || "AFILIADO"}
            </span>
          </div>
        </div>

        <div className="mt-2 w-full border-t border-dashed border-brand-gray-900/15" />

        <div className="mt-3 flex w-full flex-col items-center">
          <svg ref={barcodeRef} className="w-full max-w-[220px]" />
        </div>

        <div className="mt-3 flex w-full justify-between text-left">
          <div>
            <span className="block text-[8px] font-semibold uppercase tracking-wide text-brand-gray-900/50">
              Código afiliado
            </span>
            <span className="block text-xs font-bold text-brand-green-dark">{codigo}</span>
          </div>
          <div className="text-right">
            <span className="block text-[8px] font-semibold uppercase tracking-wide text-brand-gray-900/50">
              Fecha de afiliación
            </span>
            <span className="block text-xs font-bold text-brand-gray-900">
              {formatearFecha(fechaAfiliacion)}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-brand-green py-2.5">
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.1em] text-brand-yellow">
          PROGRESEMOS, EL CAMBIO ES AHORA
        </p>
      </div>
    </div>
  );
});

export default CarnetAfiliado;
