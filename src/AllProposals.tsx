import Footer from "./components/Footer";
import ProposalCard from "./components/ProposalCard";
import { proposals } from "./data/proposals";
import logo from "./assets/progresemos-logo.png";

export default function AllProposals() {
  return (
    <div className="min-h-screen bg-white font-body">
      <header className="border-b border-brand-gray-900/10">
        <div className="container-editorial flex h-18 items-center justify-between py-4">
          <a href="/" className="flex items-center gap-2.5">
            <img src={logo} alt="Logotipo de PROGRESEMOS" className="h-9 w-9 rounded-md object-cover" />
            <span className="leading-none">
              <span className="block font-display text-lg font-bold tracking-tight text-brand-gray-900">
                PROGRESEMOS
              </span>
              <span className="block text-[11px] font-semibold tracking-[0.14em] text-brand-green-dark/70">
                PUNO 2026
              </span>
            </span>
          </a>
          <a href="/" className="text-sm font-semibold text-brand-green-dark hover:text-brand-green">
            ← Volver al inicio
          </a>
        </div>
      </header>

      <main className="py-24 sm:py-32">
        <div className="container-editorial">
          <span className="eyebrow mb-6 block text-brand-green">Propuestas</span>
          <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-brand-gray-900 sm:text-5xl lg:text-6xl">
            Todas nuestras propuestas
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-gray-900/70">
            Iniciativas concretas construidas desde el diálogo con la ciudadanía y las regiones,
            para transformar la provincia de Puno.
          </p>

          <div className="mt-20 flex flex-col gap-24 sm:gap-32">
            {proposals.map((proposal) => (
              <ProposalCard proposal={proposal} key={proposal.number} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
