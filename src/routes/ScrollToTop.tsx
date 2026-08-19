import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// react-router-dom (con <Routes>, no el router de datos) no resetea el scroll
// al navegar entre rutas — antes esto no hacía falta porque cada página era
// un archivo .html distinto y el navegador siempre cargaba fresco en scroll 0.
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
