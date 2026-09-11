import { useState } from "react";
import SectionHeader from "./SectionHeader";
import NewsCard from "./NewsCard";
import NewsModal from "./NewsModal";
import Button from "./Button";
import { noticiasApi } from "../api/content";
import type { ApiNoticia } from "../api/content";
import { usePublicCollection } from "../hooks/usePublicCollection";

// Sin campo "featured" en la API: la noticia más reciente por fecha ocupa el
// espacio destacado. Las que no tienen fecha van al final.
function sortByFechaDesc(items: ApiNoticia[]): ApiNoticia[] {
  return [...items].sort((a, b) => {
    if (!a.fecha && !b.fecha) return 0;
    if (!a.fecha) return 1;
    if (!b.fecha) return -1;
    return b.fecha.localeCompare(a.fecha);
  });
}

function NewsSkeleton() {
  return (
    <div className="mt-16 grid grid-cols-1 gap-16 lg:grid-cols-12" aria-hidden="true">
      <div className="lg:col-span-7">
        <div className="aspect-[16/10] w-full animate-pulse rounded-2xl bg-brand-gray-50" />
        <div className="mt-6 h-4 w-32 animate-pulse rounded-full bg-brand-gray-50" />
        <div className="mt-4 h-8 w-full animate-pulse rounded-lg bg-brand-gray-50" />
      </div>
      <div className="flex flex-col gap-6 lg:col-span-5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex gap-4 border-t border-brand-gray-900/10 pt-6 first:border-t-0 first:pt-0">
            <div className="aspect-square w-28 shrink-0 animate-pulse rounded-xl bg-brand-gray-50 sm:w-32" />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="h-3 w-20 animate-pulse rounded-full bg-brand-gray-50" />
              <div className="h-4 w-full animate-pulse rounded-lg bg-brand-gray-50" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function News() {
  const [selectedNews, setSelectedNews] = useState<ApiNoticia | null>(null);

  const { items, loading, failed } = usePublicCollection(noticiasApi.list);
  const sorted = sortByFechaDesc(items);
  const [featured, ...rest] = sorted;
  const secondary = rest.slice(0, 3);

  if (!loading && (failed || !featured)) return null;

  return (
    <section id="noticias" className="bg-white py-24 sm:py-32">
      <div className="container-editorial">
        <SectionHeader eyebrow="05 — Prensa" title="Últimas noticias" />

        {loading ? (
          <NewsSkeleton />
        ) : (
          <div className="mt-16 grid grid-cols-1 gap-16 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <NewsCard item={featured} index={0} featured onClick={() => setSelectedNews(featured)} />
            </div>
            <div className="flex flex-col gap-6 lg:col-span-5">
              {secondary.map((item, i) => (
                <NewsCard item={item} index={i} key={item.id} onClick={() => setSelectedNews(item)} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-20 flex justify-center">
          <Button href="/noticias" target="_blank" rel="noopener noreferrer" variant="secondary">
            Ver todas las noticias
          </Button>
        </div>
      </div>

      <NewsModal
        open={!!selectedNews}
        item={selectedNews}
        onClose={() => setSelectedNews(null)}
      />
    </section>
  );
}
