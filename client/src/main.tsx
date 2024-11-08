import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./App.tsx";
import "react-toastify/dist/ReactToastify.css";
import "nprogress/nprogress.css";
import { ToastContainer } from "react-toastify";
import { BrowserRouter as Router } from "react-router-dom";
// import ReduxProvider from "./hooks/redux-provider.tsx";
import { ReactQueryClientProvider } from "./hooks/queryProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReactQueryClientProvider>
      <Router>
        <App />
        <ToastContainer position="bottom-right" />
      </Router>
    </ReactQueryClientProvider>
  </StrictMode>,
);
