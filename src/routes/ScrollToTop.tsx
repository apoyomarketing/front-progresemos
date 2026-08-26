import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// react-router-dom (con <Routes>, no el router de datos) no resetea el scroll
// al navegar entre rutas — antes esto no hacía falta porque cada página era
// un archivo .html distinto y el navegador siempre cargaba fresco en scroll 0.
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Si la URL trae un hash (ej. volviendo al inicio con "/#candidatos" desde
    // el Navbar en otra página), hay que saltar a esa sección en vez de forzar
    // el scroll a 0 y perder el salto.
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "instant" });
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
