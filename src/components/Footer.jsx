const NAV_COL = ["Inicio", "El Partido", "Propuestas", "Candidato", "Noticias"];
const INFO_COL = ["Documentos", "Transparencia", "Privacidad", "Términos"];

export default function Footer() {
  return (
    <footer className="bg-negrosuave text-white/80 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-5 md:px-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        <div>
          <div className="flex items-center gap-2 font-display font-extrabold text-white mb-3">
            <span className="w-8 h-8 rounded-full bg-verde-principal flex items-center justify-center text-sm">
              P
            </span>
            PROGRESEMOS
          </div>
          <p className="text-sm leading-relaxed">
            Plataforma institucional de Progresemos. Contenido de ejemplo.
          </p>
        </div>

        <div>
          <p className="font-display font-bold text-white mb-3 text-sm">Navegación</p>
          <ul className="space-y-2 text-sm">
            {NAV_COL.map((l) => (
              <li key={l}>
                <a href="#" className="hover:text-verde-lima transition-colors focus-ring rounded">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-display font-bold text-white mb-3 text-sm">Información</p>
          <ul className="space-y-2 text-sm">
            {INFO_COL.map((l) => (
              <li key={l}>
                <a href="#" className="hover:text-verde-lima transition-colors focus-ring rounded">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-display font-bold text-white mb-3 text-sm">Contacto</p>
          <ul className="space-y-2 text-sm">
            <li>contacto@progresemos.pe (placeholder)</li>
            <li>+51 000 000 000 (placeholder)</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-8 border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-white/50">
        <p>© 2026 Progresemos. Todos los derechos reservados.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-white focus-ring rounded">Política de privacidad</a>
          <a href="#" className="hover:text-white focus-ring rounded">Términos de uso</a>
          <a href="#" className="hover:text-white focus-ring rounded">Accesibilidad</a>
        </div>
      </div>
    </footer>
  );
}
