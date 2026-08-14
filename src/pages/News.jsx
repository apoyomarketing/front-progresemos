import Navbar from "../components/Navbar.jsx";
import NewsSection from "../components/News.jsx";
import Footer from "../components/Footer.jsx";

export default function NewsPage() {
  return (
    <>
      <Navbar />
      <div className="pt-24">
        <NewsSection />
      </div>
      <Footer />
    </>
  );
}
