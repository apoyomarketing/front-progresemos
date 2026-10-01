import { NavLink, Outlet } from "react-router-dom";
import { BarChart3, Edit3, FileSpreadsheet } from "lucide-react";

export default function EscrutinioLayout() {
  const tabs = [
    { path: "registro", label: "Registro de Actas", icon: Edit3 },
    { path: "resultados", label: "Resultados", icon: BarChart3 },
    { path: "matriz", label: "Matriz Excel", icon: FileSpreadsheet },
  ];


  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brand-gray-900 font-display">Escrutinio</h2>
          <p className="text-sm text-brand-gray-500 mt-1">
            Módulo de registro y visualización del conteo de votos.
          </p>
        </div>
      </div>

      <div className="border-b border-brand-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `group inline-flex items-center gap-2 border-b-2 py-4 px-1 text-sm font-medium ${
                  isActive
                    ? "border-brand-green text-brand-green-dark"
                    : "border-transparent text-brand-gray-500 hover:border-brand-gray-300 hover:text-brand-gray-700"
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-4">
        <Outlet />
      </div>
    </div>
  );
}
