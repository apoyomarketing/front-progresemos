import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AllProposals from "./AllProposals.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AllProposals />
  </StrictMode>,
);
