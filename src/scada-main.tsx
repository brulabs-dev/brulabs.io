import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ScadaPage } from "./ScadaPage";
import "./styles.css";
import "./scada.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode><ScadaPage /></StrictMode>,
);
