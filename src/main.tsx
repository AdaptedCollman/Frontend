import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import "./utils/axios";
import { StatsProvider } from "./context/StatsContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <StatsProvider>
        <App />
      </StatsProvider>
    </AuthProvider>
  </React.StrictMode>
);
