import Navbar from "../components/Navbar.jsx";
import ProposalsSection from "../components/Proposals.jsx";
import Footer from "../components/Footer.jsx";

export default function ProposalsPage() {
  return (
    <>
      <Navbar />
      <div className="pt-24">
        <ProposalsSection />
      </div>
      <Footer />
    </>
  );
}
