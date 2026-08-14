import Navbar from "../components/Navbar.jsx";
import Hero from "../components/Hero.jsx";
import InfoBar from "../components/InfoBar.jsx";
import About from "../components/About.jsx";
import Principles from "../components/Principles.jsx";
import Proposals from "../components/Proposals.jsx";
import Candidate from "../components/Candidate.jsx";
import Agenda from "../components/Agenda.jsx";
import News from "../components/News.jsx";
import Transparency from "../components/Transparency.jsx";
import Gallery from "../components/Gallery.jsx";
import SocialMedia from "../components/SocialMedia.jsx";
import Contact from "../components/Contact.jsx";
import Footer from "../components/Footer.jsx";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <InfoBar />
      <About />
      <Principles />
      <Proposals compact />
      <Candidate />
      <Agenda />
      <News compact />
      <Transparency />
      <Gallery />
      <SocialMedia />
      <Contact />
      <Footer />
    </>
  );
}
