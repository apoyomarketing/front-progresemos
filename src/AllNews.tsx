import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import NewsCard from "./components/NewsCard";
import { noticiasApi } from "./api/content";
import type { ApiNoticia } from "./api/content";
import { usePublicCollection } from "./hooks/usePublicCollection";
import { useDocumentHead } from "./hooks/useDocumentHead";

// Sin campo "featured" en la API: la noticia más reciente por fecha ocupa el
// espacio destacado, igual que en la sección de la landing.
function sortByFechaDesc(items: ApiNoticia[]): ApiNoticia[] {
  return [...items].sort((a, b) => {
    if (!a.fecha && !b.fecha) return 0;
    if (!a.fecha) return 1;
    if (!b.fecha) return -1;
    return b.fecha.localeCompare(a.fecha);
  });
}

export default function AllNews() {
  useDocumentHead({
    title: "Todas nuestras noticias — PROGRESEMOS Puno 2026",
    description:
      "Revisa todas las noticias y comunicados de PROGRESEMOS sobre la campaña en la Provincia de Puno.",
  });

  const { items, loading, failed } = usePublicCollection(noticiasApi.list);
  const sorted = sortByFechaDesc(items);
  const [featured, ...rest] = sorted;

  return (
    <div className="min-h-screen bg-white font-body">
      <Navbar solid />

      <main className="pb-24 pt-32 sm:pb-32 sm:pt-40">
        <div className="container-editorial">
          <span className="eyebrow mb-6 block text-brand-green">Prensa</span>
          <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-brand-gray-900 sm:text-5xl lg:text-6xl">
            Todas nuestras noticias
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-gray-900/70">
            Todo lo que compartimos sobre la campaña de PROGRESEMOS en la provincia de Puno.
          </p>

          {loading && (
            <p className="mt-16 text-sm text-brand-gray-900/50" aria-hidden="true">
              Cargando noticias…
            </p>
          )}
          {!loading && failed && (
            <p className="mt-16 text-sm text-brand-gray-900/50">
              No pudimos cargar las noticias. Intenta de nuevo más tarde.
            </p>
          )}
          {!loading && !failed && !featured && (
            <p className="mt-16 text-sm text-brand-gray-900/50">Todavía no hay noticias publicadas.</p>
          )}

          {!loading && !failed && featured && (
            <div className="mt-16 grid grid-cols-1 gap-16 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <NewsCard item={featured} index={0} featured />
              </div>
              <div className="flex flex-col gap-6 lg:col-span-5">
                {rest.map((item, i) => (
                  <NewsCard item={item} index={i} key={item.id} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
