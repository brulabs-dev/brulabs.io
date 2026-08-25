import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { TrainingPage } from "./TrainingPage";
import "./styles.css";
import "./training.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TrainingPage />
  </StrictMode>,
);
