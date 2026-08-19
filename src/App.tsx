import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Proposals from "./components/Proposals";
import PunoSection from "./components/PunoSection";
import Leadership from "./components/Leadership";
import News from "./components/News";
import Documents from "./components/Documents";
import Participation from "./components/Participation";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-white font-body">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Proposals />
        <PunoSection />
        <Leadership />
        <News />
        <Documents />
        <Participation />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
