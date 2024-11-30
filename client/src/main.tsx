import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./App.tsx";
import "react-toastify/dist/ReactToastify.css";
import "nprogress/nprogress.css";
import { BrowserRouter as Router } from "react-router-dom";
import { ReactQueryClientProvider } from "./hooks/queryProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReactQueryClientProvider>
      <Router>
        <App />
      </Router>
    </ReactQueryClientProvider>
  </StrictMode>,
);
