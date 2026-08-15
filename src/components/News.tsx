import SectionHeader from "./SectionHeader";
import NewsCard from "./NewsCard";
import { news } from "../data/news";

export default function News() {
  const featured = news.find((n) => n.featured) ?? news[0];
  const secondary = news.filter((n) => n !== featured).slice(0, 3);

  return (
    <section id="noticias" className="bg-white py-24 sm:py-32">
      <div className="container-editorial">
        <SectionHeader eyebrow="Prensa" title="Últimas noticias" />

        <div className="mt-16 grid grid-cols-1 gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <NewsCard item={featured} index={0} />
          </div>
          <div className="flex flex-col gap-6 lg:col-span-5">
            {secondary.map((item, i) => (
              <NewsCard item={item} index={i} key={item.title} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
