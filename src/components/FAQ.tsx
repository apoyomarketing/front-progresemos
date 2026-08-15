import SectionHeader from "./SectionHeader";
import Accordion from "./Accordion";
import { faqs } from "../data/faq";

export default function FAQ() {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="container-editorial grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <SectionHeader eyebrow="Ayuda" title="Preguntas frecuentes" />
        </div>
        <div className="lg:col-span-8">
          <Accordion items={faqs} />
        </div>
      </div>
    </section>
  );
}
