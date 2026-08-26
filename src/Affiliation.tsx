import { useState } from "react";
import { Users, GraduationCap, Megaphone, Handshake } from "lucide-react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Button from "./components/Button";
import JoinModal from "./components/JoinModal";
import { useDocumentHead } from "./hooks/useDocumentHead";

const beneficios = [
  {
    icon: Users,
    title: "Participa en las decisiones",
    description: "Ten voz en la organización interna y en la construcción del plan de gobierno de tu distrito.",
  },
  {
    icon: Megaphone,
    title: "Fortalece a PROGRESEMOS",
    description: "Cada afiliado suma representatividad al partido frente a la ciudadanía y las autoridades electorales.",
  },
  {
    icon: GraduationCap,
    title: "Formación política",
    description: "Accede a espacios de capacitación e información sobre la gestión pública y el trabajo territorial.",
  },
  {
    icon: Handshake,
    title: "Red de militantes",
    description: "Conéctate con dirigentes y vecinos comprometidos con el desarrollo de la provincia de Puno.",
  },
];

export default function Affiliation() {
  useDocumentHead({
    title: "Cómo afiliarte — PROGRESEMOS Puno 2026",
    description:
      "Conoce por qué afiliarte a PROGRESEMOS y cómo empezar el proceso de afiliación al partido en la provincia de Puno.",
  });

  const [joinOpen, setJoinOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-body">
      <Navbar solid />

      <main className="pb-24 pt-32 sm:pb-32 sm:pt-40">
        <div className="container-editorial">
          <span className="eyebrow mb-6 block text-brand-green">Afiliación</span>
          <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-brand-gray-900 sm:text-5xl lg:text-6xl">
            Súmate oficialmente a PROGRESEMOS
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-gray-900/70">
            Afiliarte es dar un paso más allá del voluntariado: te conviertes en militante del partido y
            parte activa de la organización que impulsa a Lucio Istaña y Julio Choque en la provincia de
            Puno.
          </p>

          <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {beneficios.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="flex flex-col justify-between rounded-2xl border border-brand-gray-900/10 bg-white p-7 transition-colors duration-300 hover:border-brand-green/40"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-gray-50 text-brand-green-dark">
                  <Icon size={20} strokeWidth={1.75} />
                </span>
                <div className="mt-8">
                  <h3 className="font-display text-lg font-bold text-brand-gray-900">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-brand-gray-900/60">{description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 rounded-2xl border border-brand-gray-900/10 bg-brand-gray-50 px-8 py-10 sm:px-12">
            <span className="eyebrow mb-4 block text-brand-green">¿Cómo sigue el proceso?</span>
            <h2 className="font-display text-2xl font-bold text-brand-gray-900 sm:text-3xl">
              Tres pasos para afiliarte
            </h2>
            <ol className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3">
              <li>
                <span className="font-display text-lg font-bold text-brand-green-dark">01</span>
                <p className="mt-2 text-sm leading-relaxed text-brand-gray-900/70">
                  Cuéntanos que quieres afiliarte a través del formulario de contacto.
                </p>
              </li>
              <li>
                <span className="font-display text-lg font-bold text-brand-green-dark">02</span>
                <p className="mt-2 text-sm leading-relaxed text-brand-gray-900/70">
                  Un miembro de PROGRESEMOS te contacta y te confirma los requisitos y documentos exactos.
                </p>
              </li>
              <li>
                <span className="font-display text-lg font-bold text-brand-green-dark">03</span>
                <p className="mt-2 text-sm leading-relaxed text-brand-gray-900/70">
                  Completas tu registro oficial como militante del partido.
                </p>
              </li>
            </ol>
          </div>

          <div className="mt-20 flex flex-col items-center gap-6 text-center">
            <h2 className="font-display text-2xl font-bold text-brand-gray-900 sm:text-3xl">
              ¿Lista o listo para dar el siguiente paso?
            </h2>
            <Button onClick={() => setJoinOpen(true)} variant="primary">
              Quiero afiliarme
            </Button>
          </div>
        </div>
      </main>

      <Footer />
      <JoinModal open={joinOpen} onClose={() => setJoinOpen(false)} />
    </div>
  );
}
