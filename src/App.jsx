import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import ProposalsPage from "./pages/Proposals.jsx";
import CandidatePage from "./pages/Candidate.jsx";
import NewsPage from "./pages/News.jsx";
import ScrollUtils from "./components/ScrollUtils.jsx";

export default function App() {
  return (
    <div className="font-body">
      <ScrollUtils />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/propuestas" element={<ProposalsPage />} />
        <Route path="/candidato" element={<CandidatePage />} />
        <Route path="/noticias" element={<NewsPage />} />
      </Routes>
    </div>
  );
}
