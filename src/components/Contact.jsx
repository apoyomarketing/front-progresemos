import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import Reveal from "./Reveal.jsx";

// Datos institucionales placeholder. Reemplazar antes de publicar.
const CONTACT_INFO = {
  email: "contacto@progresemos.pe (placeholder)",
  phone: "+51 000 000 000 (placeholder)",
  address: "Dirección institucional (placeholder)",
};

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [consent, setConsent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!consent) return;
    // Punto de integración futuro: reemplazar por una llamada a la API/backend real.
    setSent(true);
  };

  return (
    <section id="contacto" className="py-20 md:py-28 bg-grisclaro">
      <div className="max-w-7xl mx-auto px-5 md:px-8 grid md:grid-cols-2 gap-14">
        <Reveal>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-negrosuave mb-4">
            Contacto
          </h2>
          <p className="text-gristexto mb-8">Datos institucionales por configurar.</p>
          <div className="space-y-4 text-sm text-gristexto">
            <p className="flex items-center gap-3">
              <span className="text-verde-oscuro">
                <Mail size={18} />
              </span>
              {CONTACT_INFO.email}
            </p>
            <p className="flex items-center gap-3">
              <span className="text-verde-oscuro">
                <Phone size={18} />
              </span>
              {CONTACT_INFO.phone}
            </p>
            <p className="flex items-center gap-3">
              <span className="text-verde-oscuro">
                <MapPin size={18} />
              </span>
              {CONTACT_INFO.address}
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          {sent ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-verde-principal/20">
              <p className="font-display font-bold text-verde-oscuro text-lg mb-2">Mensaje enviado</p>
              <p className="text-sm text-gristexto">Gracias por escribirnos. Te responderemos a la brevedad.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="bg-white rounded-2xl p-6 md:p-8 space-y-4 shadow-sm">
              <input
                required
                placeholder="Nombre"
                className="w-full border border-grisclaro rounded-xl px-4 py-3 text-sm focus-ring focus:border-verde-principal outline-none"
              />
              <input
                required
                type="email"
                placeholder="Correo electrónico"
                className="w-full border border-grisclaro rounded-xl px-4 py-3 text-sm focus-ring focus:border-verde-principal outline-none"
              />
              <input
                required
                placeholder="Asunto"
                className="w-full border border-grisclaro rounded-xl px-4 py-3 text-sm focus-ring focus:border-verde-principal outline-none"
              />
              <textarea
                required
                placeholder="Mensaje"
                rows="4"
                className="w-full border border-grisclaro rounded-xl px-4 py-3 text-sm focus-ring focus:border-verde-principal outline-none"
              />
              <label className="flex items-start gap-2.5 text-xs text-gristexto">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 accent-verde-principal"
                  required
                />
                Autorizo el tratamiento de mis datos de acuerdo con la política de privacidad.
              </label>
              <button
                type="submit"
                className="w-full bg-verde-principal hover:bg-verde-oscuro text-white font-semibold py-3.5 rounded-full transition-colors focus-ring"
              >
                Enviar mensaje
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
