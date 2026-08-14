import Navbar from "../components/Navbar.jsx";
import CandidateSection from "../components/Candidate.jsx";
import Agenda from "../components/Agenda.jsx";
import Footer from "../components/Footer.jsx";

export default function CandidatePage() {
  return (
    <>
      <Navbar />
      <div className="pt-16">
        <CandidateSection />
        <Agenda />
      </div>
      <Footer />
    </>
  );
}
