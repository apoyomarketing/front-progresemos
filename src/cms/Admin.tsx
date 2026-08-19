import { useState } from "react";
import { LogOut, FileText, Newspaper, Megaphone, Users } from "lucide-react";
import logo from "../assets/progresemos-logo.png";
import { useApiCollection } from "./useApiCollection";
import { propuestasApi, noticiasApi, comunicadosApi } from "../api/content";
import type { ApiPropuesta, ApiNoticia, ApiComunicado } from "../api/content";
import type { ApiUsuario } from "../api/types";
import type { WithAuth } from "../api/useAuthSession";
import CollectionManager from "./CollectionManager";
import type { FieldConfig } from "./CollectionManager";
import UsersPanel from "./UsersPanel";

const baseTabs = [
  { key: "propuestas", label: "Propuestas", icon: FileText },
  { key: "noticias", label: "Noticias", icon: Newspaper },
  { key: "comunicados", label: "Comunicados", icon: Megaphone },
] as const;

const usersTab = { key: "usuarios", label: "Usuarios", icon: Users } as const;

type TabKey = (typeof baseTabs)[number]["key"] | typeof usersTab.key;

const proposalFields: FieldConfig<ApiPropuesta>[] = [
  { key: "titulo", label: "Título", type: "text" },
  { key: "foto", label: "Foto", type: "image" },
  { key: "descripcion", label: "Descripción", type: "textarea" },
];

const newsFields: FieldConfig<ApiNoticia>[] = [
  { key: "titulo", label: "Título", type: "text" },
  { key: "foto", label: "Foto", type: "image" },
  { key: "video", label: "URL de video (opcional)", type: "text" },
  { key: "descripcion", label: "Descripción", type: "textarea" },
  { key: "fecha", label: "Fecha", type: "date" },
  { key: "lugar", label: "Lugar", type: "text" },
];

const comunicadoFields: FieldConfig<ApiComunicado>[] = [
  { key: "titulo", label: "Título", type: "text" },
  { key: "foto", label: "Foto", type: "image" },
  { key: "video", label: "URL de video (opcional)", type: "text" },
];

interface AdminProps {
  usuario: ApiUsuario;
  withAuth: WithAuth;
  onLogout: () => void;
}

export default function Admin({ usuario, withAuth, onLogout }: AdminProps) {
  const isAdmin = usuario.rol?.nombre === "Administrador";
  const tabs = isAdmin ? [...baseTabs, usersTab] : baseTabs;
  const [tab, setTab] = useState<TabKey>("propuestas");

  const proposals = useApiCollection(propuestasApi, withAuth);
  const news = useApiCollection(noticiasApi, withAuth);
  const comunicados = useApiCollection(comunicadosApi, withAuth);

  return (
    <div className="min-h-screen bg-white font-body">
      <header className="border-b border-brand-gray-900/10">
        <div className="container-editorial flex h-18 items-center justify-between py-4">
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="Logotipo de PROGRESEMOS" className="h-9 w-9 rounded-md object-cover" />
            <span className="leading-none">
              <span className="block font-display text-lg font-bold tracking-tight text-brand-gray-900">
                PROGRESEMOS
              </span>
              <span className="block text-[11px] font-semibold tracking-[0.14em] text-brand-green-dark/70">
                CMS
              </span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-brand-gray-900/60 sm:inline">{usuario.nombre}</span>
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-2 rounded-full border border-brand-gray-900/15 px-4 py-2 text-sm font-semibold text-brand-gray-900/70 transition-colors hover:border-brand-green hover:text-brand-green-dark"
            >
              <LogOut size={15} /> Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <div className="container-editorial py-10">
        <div className="flex flex-wrap gap-2 border-b border-brand-gray-900/10 pb-4">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                tab === key ? "bg-brand-green text-white" : "text-brand-gray-900/60 hover:bg-brand-gray-50"
              }`}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        <div className="mt-8 max-w-2xl">
          {tab === "propuestas" && (
            <>
              {proposals.loading && <p className="text-sm text-brand-gray-900/50">Cargando propuestas…</p>}
              {proposals.loadError && <p className="text-sm text-red-600">{proposals.loadError}</p>}
              {!proposals.loading && (
                <CollectionManager
                  title="Propuestas"
                  emptyLabel="Todavía no hay propuestas."
                  fields={proposalFields}
                  titleKey="titulo"
                  items={proposals.items}
                  onCreate={proposals.create}
                  onUpdate={proposals.update}
                  onDelete={proposals.remove}
                />
              )}
            </>
          )}
          {tab === "noticias" && (
            <>
              {news.loading && <p className="text-sm text-brand-gray-900/50">Cargando noticias…</p>}
              {news.loadError && <p className="text-sm text-red-600">{news.loadError}</p>}
              {!news.loading && (
                <CollectionManager
                  title="Noticias"
                  emptyLabel="Todavía no hay noticias."
                  fields={newsFields}
                  titleKey="titulo"
                  items={news.items}
                  onCreate={news.create}
                  onUpdate={news.update}
                  onDelete={news.remove}
                />
              )}
            </>
          )}
          {tab === "comunicados" && (
            <>
              {comunicados.loading && <p className="text-sm text-brand-gray-900/50">Cargando comunicados…</p>}
              {comunicados.loadError && <p className="text-sm text-red-600">{comunicados.loadError}</p>}
              {!comunicados.loading && (
                <CollectionManager
                  title="Comunicados"
                  emptyLabel="Todavía no hay comunicados."
                  fields={comunicadoFields}
                  titleKey="titulo"
                  items={comunicados.items}
                  onCreate={comunicados.create}
                  onUpdate={comunicados.update}
                  onDelete={comunicados.remove}
                />
              )}
            </>
          )}
          {tab === "usuarios" && isAdmin && (
            <UsersPanel currentUsuario={usuario} withAuth={withAuth} />
          )}
        </div>
      </div>
    </div>
  );
}
