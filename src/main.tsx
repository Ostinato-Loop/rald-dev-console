// RALD Dev Console — main.tsx
// LILCKY STUDIO LIMITED

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#0D1826",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#E8F4F0",
          },
        }}
      />
    </BrowserRouter>
  </StrictMode>,
);
